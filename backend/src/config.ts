import dotenv from "dotenv";

dotenv.config();

const tokenDB = process.env.TOKEN_DB;
const urlDB = process.env.URL_DB;
const port = process.env.PORT;

const config = {
  tokenDB,
  urlDB,
  port,
};

export default config;