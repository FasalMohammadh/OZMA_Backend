import { google } from 'googleapis';
import path from 'path';

import axios from './../Config/axios.js';
import { MONGO_DB_CONFIG } from './../Config/database.js';

import sendEmail from './../Helpers/sendEmail.js';
import getDirName from './../Helpers/getDirname.js';

import { User } from './../Validations/userValidation.js';

import 'dotenv/config';

const userModal = {
  async create(user: User) {
    await axios.post('/action/insertOne', {
      ...MONGO_DB_CONFIG,
      document: user,
    });
    await updateSpreadsheet(user);
    await sendEmail(user.email, user.fullName);
  },

  async findUserByEmail(email: string) {
    const response = await axios.post('/action/find', {
      ...MONGO_DB_CONFIG,
      filter: { email },
    });
    return response.data.documents;
  },

  async findUserByMobileNumber(mobileNumber: string) {
    const response = await axios.post('/action/find', {
      ...MONGO_DB_CONFIG,
      filter: { mobileNumber },
    });
    return response.data.documents;
  },
};

async function updateSpreadsheet(user: User) {
  const sheets = google.sheets('v4');
  const authClient = await new google.auth.GoogleAuth({
    keyFile: path.resolve(getDirName(), './../Config/spreadsheet.json'),
    scopes: 'https://www.googleapis.com/auth/spreadsheets',
  }).getClient();
  google.options({ auth: authClient });

  await sheets.spreadsheets.values.append({
    valueInputOption: 'USER_ENTERED',
    range: 'Sheet1!A:E',
    spreadsheetId: '1isOWkkJd26PG2jbxAKUBgSvgCO10bWRvBxjAQAi96Q4',
    requestBody: { values: [parseSheetRowData(user)] },
  });
}

function parseSheetRowData(user: User) {
  return [
    user.fullName,
    user.dob,
    user.email,
    user.mobileNumber,
    user.nic,
    user.address,
    user.olYear,
    user.profession,
    user.indexNo,
    user.photoUrl,
    user.signatureFileUrl,
    user.partOfSmf ? 'Yes' : 'No',
    user.contributionToOzma.join(', '),
  ];
}

export default userModal;