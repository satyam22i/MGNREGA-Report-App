import axios from 'axios';
import MgnregaData from '../models/mgnregaModel.js';


export const syncDataFromGovAPI = async (stateName, finYear) => {
  console.log(`Starting sync for ${stateName}, ${finYear}...`);
  
  const API_URL = process.env.GOV_API_URL;
  const API_KEY = process.env.GOV_API_KEY;

  if (!API_URL || !API_KEY) {
    console.error('API_URL or API_KEY is not defined in .env file.');
    return;
  }

  // Configure the API request
  const config = {
    params: {
      'api-key': API_KEY,
      'format': 'json',
      'limit': 1000, 
      'filters[state_name]': stateName,
      'filters[fin_year]': finYear,
    },
  };

  try {
    const response = await axios.get(API_URL, config);
    const records = response.data?.records;

    if (!records || records.length === 0) {
      console.warn('No records found from data.gov.in API for this query.');
      return;
    }

    console.log(`Found ${records.length} records from API. Starting database upsert...`);

    let successCount = 0;
    let errorCount = 0;


    const upsertPromises = records.map(async (record) => {
      try {

        const transformedData = {
          state_name: record.state_name,
          district_name: record.district_name,
          fin_year: record.fin_year,
          
          // Maps from 'Total_Households_Worked'
          familiesGivenWork: parseInt(record.Total_Households_Worked, 10) || 0,
          
          // Maps from 'Total_Individuals_Worked' 
          totalWorkDays: parseInt(record.Total_Individuals_Worked, 10) || 0,
          
          // Maps from 'Wages'
          totalWagesPaid: parseFloat(record.Wages, 10) || 0,
          
          // Maps from 'percentage_payments_gererated_within_15_days'
          paymentsOnTimePercent: parseFloat(record.percentage_payments_gererated_within_15_days, 10) || 0,
          
          rawApiRecord: record, 
        };

        // --- 3. Load (Upsert) ---
        // This command finds a document matching the filter OR creates a new one.
        await MgnregaData.findOneAndUpdate(
          { 
            state_name: transformedData.state_name,
            district_name: transformedData.district_name,
            fin_year: transformedData.fin_year,
          },
          transformedData, 
          {
            upsert: true, 
            new: true,    
          }
        );
        successCount++;
      } catch (err) {
        console.error(`Error upserting record: ${err.message}`);
        errorCount++;
      }
    });

    await Promise.all(upsertPromises);
    console.log(`Sync complete: ${successCount} records upserted, ${errorCount} errors.`);

  } catch (error) {
    console.error(`Error fetching from data.gov.in API: ${error.message}`);
  }
};


/**
 * @desc Get the latest cached report for a specific district
 */
export const getDistrictReport = async (req, res) => {
  try {
    const { stateName, districtName } = req.params;
    

    const report = await MgnregaData.findOne({
      state_name: stateName,
      district_name: districtName,
      fin_year: "2024-2025"
    });

    if (report) {
      res.json(report);
    } else {
      res.status(404).json({ message: 'No data found for this district in our cache.' });
    }
  } catch (error) {
    res.status(500).json({ message: `Server error: ${error.message}` });
  }
};

/**
 * @desc Get a list of all unique districts we have data for
 */
export const getAvailableDistricts = async (req, res) => {
  try {
    const { stateName } = req.params;
    
    // Find all unique ('distinct') district names from our database
    const districts = await MgnregaData.distinct('district_name', {
      state_name: stateName
    });
    
    res.json(districts.sort()); 
  } catch (error) {
    res.status(500).json({ message: `Server error: ${error.message}` });
  }
};

/**
 * @desc Manually trigger a data sync
 */
export const manualSync = async (req, res) => {
  try {
    
    const stateName = req.body.stateName || 'UTTAR PRADESH';
    const finYear = req.body.finYear || '2023-2024'; 
    
    
    syncDataFromGovAPI(stateName, finYear);
    
    res.status(202).json({ message: `Sync triggered for ${stateName}, ${finYear}.` });
  } catch (error) {
    res.status(500).json({ message: `Server error: ${error.message}` });
  }
};

