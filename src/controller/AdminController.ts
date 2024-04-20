import { Request, Response, NextFunction } from "express";
import { createVendorInput } from "../dto";
import { Vendor } from "../models";
import { genSalt } from "bcryptjs";
import { genPassword } from "../utility";
import mongoose from "mongoose";

export const findVendor = async (id: string | undefined, email?: string) => {
  if (email) {
    return await Vendor.findOne({ email: email });
  } else {
    return await Vendor.findById(id);
  }
};

export const createVendor = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const {
    name,
    ownerName,
    foodType,
    pinCode,
    address,
    password,
    phone,
    email,
  } = <createVendorInput>req.body;

  const isAvailable = await findVendor("", email);
  // console.log(isAvailable);

  if (isAvailable != null) {
    return res.json({ message: "the User already exist with this email" });
  }

  const salt = await genSalt();

  const hashPassword = await genPassword(password, salt);
  console.log(hashPassword);

  const newVendor = await Vendor.create({
    name,
    ownerName,
    foodType,
    pinCode,
    address,
    password: hashPassword,
    phone,
    email,
    salt: salt,
    serviceAvailable: false,
    coverImages: [],
    rating: 0,
    foods: [],
  });

  return res.send(newVendor);
};

export const getVendors = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const vendors = await Vendor.find();

  if (vendors !== null) {
    return res.json(vendors);
  }

  return res.json({ message: "thre is no vendor Registered" });
};

export const getVendorById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const vendorId = req.params.id;

  if (!mongoose.Types.ObjectId.isValid(vendorId)) {
    return res.json({ message: "Invalid vendor Id" });
  }

  const vendor = await findVendor(vendorId);

  if (vendor !== null) {
    return res.json(vendor);
  }

  return res.json({ message: "Invalid vendor Id" });
};
