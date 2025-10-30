# 🇮🇳 Our Voice, Our Rights - MGNREGA Report App

Hello! This is a simple project that takes complex government data about the MGNREGA program and makes it easy for any common person to understand.

## 🤔 What is the problem this solves?

The government (data.gov.in) has an API for MGNREGA data. But this data is in a format that only computer experts (like us!) can read. A normal citizen in a village cannot use this to see how their district is performing.

Our app solves this! It's a "people-first" website.

### What it does:
* **Simple for Everyone:** The design is very clean and simple. We use big numbers and icons so anyone can understand it.
* **Easy to Use:** You just pick your District from a list, and you get the report.
* **Finds You (Bonus!):** It has a "Use My Location" button that can try to find your district automatically.
* **Fast & Reliable:** We don't call the government API every time. Our app is smart. It saves (caches) the data in our own database (MongoDB). This means our app is super-fast and will work even if the government's website is slow or down!

---

## 🛠️ How it is built (The Tech)

This project is built in two parts:

1.  **`backend/` (The Engine)**
    * This is a **Node.js / Express** server.
    * Its main job is to talk to the `data.gov.in` API.
    * It pulls the data, **cleans it**, and saves it neatly in our **MongoDB** database.
    * This acts as our own private, fast, and reliable "cache."

2.  **`Frontend/` (The Website You See)**
    * This is a **React** app (made with Vite).
    * It never talks to the government API. It only talks to *our own* `backend`.
    * It fetches the clean data from our backend and displays it in simple, easy-to-read "stat cards" and charts.

### Tech Stack
* **Frontend:** React, TailwindCSS, Chart.js, Axios
* **Backend:** Node.js, Express, Mongoose, MongoDB, Axios, dotenv
* **Database:** MongoDB Atlas

---

## 🚀 How to Run This Project (Setup)

To run this on your own computer, you need two things:
1.  A free MongoDB Atlas account (to get a `MONGO_URI`).
2.  A free, **personal API Key** from `data.gov.in`. (Don't use the sample key, it won't give real data!)

### Step 1: Backend Setup (The Engine)

First, let's get the engine running.

1.  Go into the backend folder:
    ```bash
    cd backend
    ```
2.  Install all the packages (like Express, Mongoose, etc.):
    ```bash
    npm install
    ```
3.  Create a new file named `.env` in the `backend/` folder. This is for your secret keys.
4.  Copy and paste this into your new `.env` file and fill in your details:

    ```text
    # Your MongoDB connection string
    MONGO_URI="mongodb+srv://<your_username>:<your_password>@....mongodb.net/mgnregaDB"

    # The API URL we found from data.gov.in
    GOV_API_URL="[https://api.data.gov.in/resource/ee03643a-ee4c-48c2-ac30-9f2ff26ab722](https://api.data.gov.in/resource/ee03643a-ee4c-48c2-ac30-9f2ff26ab722)"

    # Your PERSONAL API key from data.gov.in
    GOV_API_KEY="YOUR_REAL_API_KEY_GOES_HERE"
    ```

5.  Now, start the backend server!
    ```bash
    npm run dev
    ```

You should see a message like `MongoDB Connected...` and `Server running on port 5000`. It will also say `Sync complete...` after it fetches the data.

### Step 2: Frontend Setup (The Website)

Now, in a **new terminal**, let's start the website.

1.  Go into the frontend folder:
    ```bash
    cd Frontend
    ```
2.  Install all the packages (like React):
    ```bash
    npm install
    ```
3.  Start the app:
    ```bash
    npm run dev
    ```

This will open the website in your browser (usually at `http://localhost:5173`).

### ⭐ Live link-> https://sparkly-kringle-995b28.netlify.app/
