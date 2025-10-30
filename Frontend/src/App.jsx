import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Users, IndianRupee, CalendarDays, CheckCircle, Speaker } from 'lucide-react';
import DistrictSelector from './components/DistrictSelector.jsx';
import DataCard from './components/DataCard.jsx';
import ChartView from './components/ChartView.jsx';
import Modal from './components/Modal.jsx';

const API_BASE_URL = 'https://mgnrega-f28k.onrender.com/api/data';
const STATE_TO_QUERY = 'UTTAR PRADESH';

// Format functions
const formatRupees = (number) => new Intl.NumberFormat('en-IN', {
  style: 'currency',
  currency: 'INR',
  maximumFractionDigits: 0
}).format(number || 0);

const formatNumber = (number) => new Intl.NumberFormat('en-IN').format(number || 0);

// Language dictionary
const texts = {
  en: {
    title: "Our Voice, Our Rights",
    subTitle: "MGNREGA District Report",
    families: "Families Who Got Work",
    money: "Total Money Paid",
    days: "Total Days of Work Given",
    payments: "Payments Made On Time",
    what: "What does this mean?",
    whatIs: "What is MGNREGA?",
    meaning: "It is a government program that promises 100 days of work every year to rural families who ask for it.",
    workFamilies: "This is the total number of families in your district who were given work under this program in the last financial year.",
    dataSource: "Data is sourced from",
    langSwitch: "हिन्दी",
    loading: "Loading data...",
    locateError: "Could not determine your district from your location."
  },
  hi: {
    title: "हमारी आवाज़, हमारा अधिकार",
    subTitle: "मनरेगा ज़िला रिपोर्ट",
    families: "काम पाने वाले परिवार",
    money: "कुल भुगतान राशि",
    days: "दिए गए कुल कार्य दिवस",
    payments: "समय पर किए गए भुगतान",
    what: "इसका मतलब क्या है?",
    whatIs: "मनरेगा क्या है?",
    meaning: "यह सरकार की योजना है जो हर साल ग्रामीण परिवारों को 100 दिन का रोजगार देने का वादा करती है।",
    workFamilies: "यह आपके जिले के उन परिवारों की संख्या है जिन्हें पिछले वित्तीय वर्ष में इस योजना के तहत काम दिया गया।",
    dataSource: "डेटा स्रोत:",
    langSwitch: "English",
    loading: "डेटा लोड हो रहा है...",
    locateError: "आपका जिला स्थान से निर्धारित नहीं किया जा सका।"
  }
};

export default function App() {
  const [districts, setDistricts] = useState([]);
  const [selectedDistrict, setSelectedDistrict] = useState('');
  const [reportData, setReportData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [language, setLanguage] = useState(localStorage.getItem("lang") || "en");

  useEffect(() => {
    const fetchDistricts = async () => {
      try {
        setIsLoading(true);
        const response = await axios.get(`${API_BASE_URL}/districts/${STATE_TO_QUERY}`);
        setDistricts(response.data);
      } catch (err) {
        console.error("Error fetching districts:", err);
        setError(`Could not load district list: ${err.message}`);
      } finally {
        setIsLoading(false);
      }
    };
    fetchDistricts();
  }, []);

  useEffect(() => {
    localStorage.setItem("lang", language);
  }, [language]);

  const handleDistrictChange = async (districtName) => {
    if (!districtName) {
      setSelectedDistrict('');
      setReportData(null);
      return;
    }

    setSelectedDistrict(districtName);
    setIsLoading(true);
    setError(null);
    setReportData(null);

    try {
      const response = await axios.get(`${API_BASE_URL}/report/${STATE_TO_QUERY}/${districtName}`);
      setReportData(response.data);
    } catch (err) {
      console.error(`Error fetching report for ${districtName}:`, err);
      setError(`Could not load report: ${err.response?.data?.message || err.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLocateMe = () => {
    if (!('geolocation' in navigator)) {
      setError('Geolocation is not supported by your browser.');
      return;
    }

    setIsLoading(true);
    navigator.geolocation.getCurrentPosition(async (position) => {
      const { latitude, longitude } = position.coords;
      try {
        const response = await axios.get(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`);
        const district = response.data?.address?.county || response.data?.address?.state_district;

        if (district) {
          const matchedDistrict = districts.find(d => district.includes(d));
          if (matchedDistrict) {
            handleDistrictChange(matchedDistrict);
          } else {
            setError(`${texts[language].locateError}`);
          }
        } else {
          setError(`${texts[language].locateError}`);
        }
      } catch (err) {
        setError('Failed to find district from location.');
      } finally {
        setIsLoading(false);
      }
    }, (err) => {
      setError(`Location error: ${err.message}`);
      setIsLoading(false);
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 font-sans text-gray-900">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-4xl mx-auto px-4 py-5 sm:px-6 lg:px-8 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Speaker className="w-10 h-10 text-blue-600" strokeWidth={1.5} />
            <div>
              <h1 className="text-2xl font-bold text-gray-800">{texts[language].title}</h1>
              <p className="text-sm text-gray-500">{texts[language].subTitle} ({STATE_TO_QUERY})</p>
            </div>
          </div>

          {/* Language Toggle */}
          <button
            onClick={() => setLanguage(language === "en" ? "hi" : "en")}
            className="px-3 py-1 text-sm bg-blue-100 rounded-md hover:bg-blue-200 transition"
          >
            {texts[language].langSwitch}
          </button>
        </div>
      </header>

      {/* Main */}
      <main className="max-w-4xl mx-auto p-4 sm:p-6 lg:p-8">
        <DistrictSelector
          districts={districts}
          selectedDistrict={selectedDistrict}
          onDistrictChange={handleDistrictChange}
          onLocate={handleLocateMe}
          isLoading={isLoading}
        />

        {error && (
          <Modal title="Error" message={error} onClose={() => setError(null)} />
        )}

        {isLoading && !reportData && (
          <div className="flex flex-col justify-center items-center h-64 text-gray-500">
            <div className="loader ease-linear rounded-full border-4 border-t-4 border-gray-200 h-12 w-12 mb-4"></div>
            <p>{texts[language].loading}</p>
          </div>
        )}

        {reportData && (
          <div id="dashboard" className="mt-6 animate-fadeIn">
            <h2 className="text-3xl font-bold text-center mb-2">
              {texts[language].subTitle} – <span className="text-blue-600">{reportData.district_name}</span>
            </h2>
            <p className="text-center text-gray-500 mb-6">
              Financial Year: {reportData.fin_year} (Last Updated: {new Date(reportData.lastUpdatedAt).toLocaleDateString()})
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-6">
              <DataCard title={texts[language].families} value={formatNumber(reportData.familiesGivenWork)} icon={<Users className="w-8 h-8 text-green-700" />} iconBg="bg-green-100" />
              <DataCard title={texts[language].money} value={formatRupees(reportData.totalWagesPaid)} icon={<IndianRupee className="w-8 h-8 text-green-700" />} iconBg="bg-green-100" />
              <DataCard title={texts[language].days} value={formatNumber(reportData.totalWorkDays)} icon={<CalendarDays className="w-8 h-8 text-blue-700" />} iconBg="bg-blue-100" />
              <DataCard title={texts[language].payments} value={`${reportData.paymentsOnTimePercent}%`} icon={<CheckCircle className="w-8 h-8 text-green-700" />} iconBg="bg-green-100" />
            </div>

            <ChartView
              chartData={{ labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'], values: [120, 150, 180, 130, 170, 210] }}
              title="Work Days (Past 6 Months - Dummy Data)"
            />
          </div>
        )}

        <div className="bg-white p-6 rounded-lg shadow-md mt-6">
          <h3 className="text-xl font-semibold mb-4">{texts[language].what}</h3>
          <div className="space-y-4">
            <details className="group">
              <summary className="flex justify-between items-center font-medium cursor-pointer list-none">
                <span>{texts[language].whatIs}</span>
                <span className="transition-transform duration-200 group-open:rotate-180">▼</span>
              </summary>
              <p className="text-gray-600 mt-3">{texts[language].meaning}</p>
            </details>
            <details className="group">
              <summary className="flex justify-between items-center font-medium cursor-pointer list-none">
                <span>{texts[language].families}</span>
                <span className="transition-transform duration-200 group-open:rotate-180">▼</span>
              </summary>
              <p className="text-gray-600 mt-3">{texts[language].workFamilies}</p>
            </details>
          </div>
        </div>
      </main>

      <footer className="text-center p-6 mt-8 text-sm text-gray-500">
        {texts[language].dataSource} <a href="https://data.gov.in" className="text-blue-600 hover:underline">data.gov.in</a>
      </footer>
    </div>
  );
}


const styleSheet = document.createElement("style");
styleSheet.type = "text/css";
styleSheet.innerText = `
  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(10px); }
    to { opacity: 1; transform: translateY(0); }
  }
  .animate-fadeIn {
    animation: fadeIn 0.5s ease-out;
  }
`;
document.head.appendChild(styleSheet);
