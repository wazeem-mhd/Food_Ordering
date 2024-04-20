import express, { Application } from "express";
import {
  AdminRoute,
  CustomerRouter,
  ShoppingRoute,
  VendorRoute,
} from "../routes";
import path from "path";

export default async (app: Application) => {
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  app.use("/images", express.static(path.join(__dirname, "images")));

  app.use("/admin", AdminRoute);
  app.use("/vendor", VendorRoute);
  app.use("/customer", CustomerRouter);
  app.use(ShoppingRoute);

  return app;
};
