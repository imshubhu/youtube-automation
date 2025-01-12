const { google } = require("googleapis");
const fs = require("fs");

// OAuth 2.0 setup
const CLIENT_ID = ''
const CLIENT_SECRET = ''
const REDIRECT_URI = ''; // E.g., http://localhost:3000/oauth2callback

// Replace with your refresh token (generated once using OAuth flow)
const REFRESH_TOKEN = '';

const oauth2Client = new google.auth.OAuth2(
    CLIENT_ID,
    CLIENT_SECRET,
    REDIRECT_URI
);

oauth2Client.setCredentials({ refresh_token: REFRESH_TOKEN });

// The ID of your Google Sheet (from the URL of the sheet)
const SPREADSHEET_ID = "your-spreadsheet-id";

// The range of cells to read (e.g., "Sheet1!A1:E10")
const RANGE = "Sheet1!A1:E10";

async function fetchData() {
  try {

    // Create the Sheets API client
    const sheets = google.sheets({ version: "v4", auth: oauth2Client });

    // Fetch data from the sheet
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: SPREADSHEET_ID,
      range: RANGE,
    });

    // Display the data
    const rows = response.data.values;
    if (rows.length) {
      console.log("Data fetched from Google Sheet:");
      rows.forEach((row) => {
        console.log(row);
      });
    } else {
      console.log("No data found.");
    }
  } catch (error) {
    console.error("Error fetching data:", error);
  }
}

// Run the function
fetchData();
