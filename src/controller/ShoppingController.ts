import express, { Request, Response, NextFunction } from "express";
import { Vendor, foodDoc } from "../models";

export const GetFoodAvailability = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const pinCode = req.params.pincode;

  try {
    const result = await Vendor.find({
      pinCode: pinCode,
      serviceAvailable: true,
    })
      .sort([["rating", "descending"]])
      .populate("foods");

    if (result.length < 1) {
      return res.status(400).json({ Message: "Data not Found" });
    }

    return res.json(result);
  } catch (error) {
    console.log("something went wrong");
  }
};

export const GetTopResturent = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const pinCode = req.params.pincode;

  try {
    const resturent = await Vendor.find({
      pinCode: pinCode,
      serviceAvailable: true,
    })
      .sort([["rating", "descending"]])
      .limit(10);

    return res.json(resturent);
  } catch (error) {
    console.log("something went wrong");
  }
};

export const GetFoodIn30Min = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const pinCode = req.params.pincode;

  try {
    const result = await Vendor.find({
      pinCode: pinCode,
      serviceAvailable: true,
    }).populate("foods");

    if (result.length > 0) {
      let foodsResult: any = [];
      result.map((vendor) => {
        const foods = vendor.foods as [foodDoc];
        foodsResult.push(...foods.filter((food) => food.readyTime <= 30));
      });

      return res.status(200).json(foodsResult);
    }

    return res.status(400).json({ message: "Data not found" });
  } catch (error) {
    console.log("something went wrong");
  }
};

export const SearchFood = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const pinCode = req.params.pincode;

  try {
    const result = await Vendor.find({
      pinCode: pinCode,
      serviceAvailable: true,
    }).populate("foods");

    if (result.length > 0) {
      let foodsResult: any = [];
      result.map((vendor) => {
        foodsResult.push(...vendor.foods);
      });
      return res.status(200).json(foodsResult);
    }

    return res.status(400).json({ message: "Data not found" });
  } catch (error) {
    console.log(error);
  }
};

export const GetResturentById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const id = req.params.id;

  try {
    const result = await Vendor.findById(id).populate("foods");

    if (result) {
      return res.status(200).json(result);
    }
    return res.status(400).json({ message: "Data not found" });
  } catch (error) {
    console.log(error);
  }
};
