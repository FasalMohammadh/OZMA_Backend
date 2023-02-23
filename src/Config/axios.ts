import axios from 'axios';
import { MONGO_DB_API } from './../Config/database.js';

import 'dotenv/config';

export default axios.create({
  baseURL: MONGO_DB_API,
  headers: {
    'api-key': process.env.MONGO_DB_API_KEY,
    'Content-Type': 'application/json',
    'Access-Control-Request-Headers': '*',
    Accept: 'application/json',
  },
});
