import { Request, Response, NextFunction } from "express";
import { FoodInput, vendorUpdateInput, vendorloginData } from "../dto";
import { findVendor } from "./AdminController";
import { genSignature, verifypassword } from "../utility";
import { Food, Vendor } from "../models";

export const VendorLogin = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { email, password } = <vendorloginData>req.body;

  const vendor = await findVendor("", email);

  if (vendor !== null) {
    const isVerify = await verifypassword(
      password,
      vendor.password,
      vendor.salt
    );

    if (isVerify) {
      const signature = genSignature({
        _id: vendor._id,
        email: vendor.email,
        foodType: vendor.foodType,
        name: vendor.name,
      });
      return res.json({ token: signature });
    } else {
      return res.json({ message: "Invalid User" });
    }
  }

  return res.json({ message: "Vendor not exit" });
};

export const GetVendorProfile = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const user = req.user;

  if (user) {
    const existUser = await Vendor.findById(user._id);
    return res.json(existUser);
  }
  return res.json({ message: "user info not found" });
};

export const UpdateVendorProfile = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const user = req.user;
  const { name, address, foodType, phone } = <vendorUpdateInput>req.body;

  if (user) {
    const existUser = await Vendor.findById(user._id);
    if (existUser !== null) {
      existUser.name = name;
      existUser.address = address;
      existUser.phone = phone;
      existUser.foodType = foodType;

      const updateUser = await existUser.save();
      return res.json(updateUser);
    }
    return res.json({ message: "Invalid User" });
  }
  return res.json({ message: "user info not found" });
};

export const UpdateVendorProfileImage = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const user = req.user;

  if (user) {
    const existUser = await findVendor(user._id);

    if (existUser) {
      const files = req.files as [Express.Multer.File];

      const images = files.map(
        (file: Express.Multer.File) => file.originalname
      );

      existUser.coverImages.push(...images);
      const result = await existUser.save();

      return res.json(result);
    } else {
      return res.json({ message: "Cant update right now" });
    }
  }
  return res.json({ message: "some thing went wrong on update profile" });
};

export const UpdateVendorService = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const user = req.user;

  if (user) {
    const existUser = await Vendor.findById(user._id);
    if (existUser !== null) {
      existUser.serviceAvailable = !existUser.serviceAvailable;

      const updateUser = await existUser.save();
      return res.json(updateUser);
    }
    return res.json({ message: "Invalid User" });
  }
  return res.json({ message: "user info not found" });
};

export const AddNewFood = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const user = req.user;
  const { name, description, catagory, foodType, readyTime, price } = await (<
    FoodInput
  >req.body);

  if (user) {
    const existUser = await findVendor(user._id);

    if (existUser) {
      const files = req.files as [Express.Multer.File];

      const images = files.map(
        (file: Express.Multer.File) => file.originalname
      );

      const newFood = await Food.create({
        vendorId: existUser._id,
        name: name,
        description: description,
        catagory: catagory,
        images: images,
        foodType: foodType,
        readyTime: readyTime,
        price: price,
        rating: 0,
      });

      await existUser.foods.push(newFood);
      const result = await existUser.save();

      return res.json(result);
    } else {
      return res.json({ message: "Realy sorry, Cann't add food now" });
    }
  }
  return res.json({ message: "user info not found" });
};

export const GetAllFoods = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const user = req.user;

  // console.log(user);
  if (user) {
    const vendorFoodDetails = await Food.find({ vendorId: user._id });

    if (vendorFoodDetails !== null) {
      return res.json(vendorFoodDetails);
    } else {
      return res.json({
        message: "there is No food in your profile ,please add more",
      });
    }
  }
  return res.json({ message: "Un-authorized user" });
};
