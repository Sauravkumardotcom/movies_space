import { google } from 'googleapis';
import dotenv from 'dotenv';
dotenv.config();

const SCOPES = ['https://www.googleapis.com/auth/spreadsheets'];

// Load credentials from environment variables or a file
const credentials = {
  client_email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
  private_key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
};

const spreadsheetId = process.env.GOOGLE_SHEET_ID;

export function getSheetsClient() {
  const auth = new google.auth.JWT(
    credentials.client_email,
    null,
    credentials.private_key,
    SCOPES
  );
  return google.sheets({ version: 'v4', auth });
}

export async function appendRowToSheet(sheetName, rowData) {
  const sheets = getSheetsClient();
  await sheets.spreadsheets.values.append({
    spreadsheetId,
    range: `${sheetName}!A1:Z1`,
    valueInputOption: 'RAW',
    insertDataOption: 'INSERT_ROWS',
    requestBody: {
      values: [rowData],
    },
  });
}
