import mongoose from "mongoose";
import { MONGODB_URL } from "../config";

export default async () => {
  try {
    mongoose.set("strictQuery", true);
    mongoose.connect(MONGODB_URL);

    console.log("mongoDb connected");
  } catch (error) {
    console.log("error : " + error);
  }
};
