import { google } from 'googleapis';
import path from 'path';

import axios from './../Config/axios.js';
import { MONGO_DB_CONFIG, USER_ID_PREFIX } from './../Config/database.js';

import sendEmail from './../Helpers/sendEmail.js';
import getDirName from './../Helpers/getDirname.js';

import { User } from './../Validations/userValidation.js';

import 'dotenv/config';

interface UserExtended extends User {
  userId: string;
}

const userModal = {
  async create(user: UserExtended) {
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
  async findLastUser() {
    const { data } = await axios.post<{
      documents: Array<UserExtended>;
    }>('/action/find', {
      ...MONGO_DB_CONFIG,
      sort: { userId: -1 },
    });
    return data.documents.at(0) ?? null;
  },
};

async function updateSpreadsheet(user: UserExtended) {
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

function parseSheetRowData(user: UserExtended) {
  return [
    user.userId,
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
