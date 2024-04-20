import express from "express";
import App from "./services/ExpressApp";
import dbConnection from "./services/Mongodb";
import { PORT } from "./config";
import dotenv from "dotenv";

const startServer = async () => {
  const app = express();

  await dbConnection();
  await App(app);

  dotenv.config();
  app.listen(PORT, () => {
    console.log(`App Listning on port ${PORT}....`);
  });
};

startServer();
