import express, { Request, Response, NextFunction } from "express";
import { plainToClass } from "class-transformer";
import { CreateCustomerInput, LoginInput, ProfileInput } from "../dto";
import { validate } from "class-validator";
import { Customer } from "../models";
import {
  GenerateOtp,
  onRequestOtp,
  genPassword,
  genSalt,
  genSignature,
  verifypassword,
} from "../utility";

export const SignUpUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const userInput = plainToClass(CreateCustomerInput, req.body);

  const inputErrors = await validate(userInput, {
    validationError: { target: true },
  });

  const existuser = await Customer.findOne({ email: userInput.email });

  if (existuser !== null) {
    return res
      .status(400)
      .json({ message: "User already exist, try with another one" });
  }

  if (inputErrors.length > 0) {
    return res.status(400).json(inputErrors);
  }

  const { email, password, phone } = userInput;

  const salt = await genSalt();
  const hashPassword = await genPassword(password, salt);

  const { otp, expiry } = GenerateOtp();

  const result = await Customer.create({
    email: email,
    password: hashPassword,
    salt: salt,
    address: "",
    verified: false,
    phone: phone,
    firstName: "",
    lastName: "",
    otp: otp,
    otp_expiry: expiry,
    lan: 0,
    lat: 0,
  });

  if (result) {
    //send the OTP to customer
    await onRequestOtp(otp, phone);

    // Generate thre signature

    const signature = genSignature({
      _id: result._id,
      email: result.email,
      verified: result.verified,
    });

    // send result to client
    return res.status(201).json({
      signature: signature,
      verified: result.verified,
      email: result.email,
    });
  }

  return res.status(400).json({ message: "Error with signup" });
};

export const LoginUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const loginInput = plainToClass(LoginInput, req.body);

  const loginInputError = await validate(loginInput, {
    validationError: { target: true },
  });

  if (loginInputError.length > 0) {
    return res.json(loginInputError);
  }

  const { email, password } = loginInput;

  const user = await Customer.findOne({ email: email });

  if (user) {
    if (!user.verified) {
      return res.status(400).json({ message: "user Not verified" });
    }

    const passwordVerify = await verifypassword(
      password,
      user.password,
      user.salt
    );

    if (passwordVerify) {
      const signature = await genSignature({
        _id: user.id,
        email: user.email,
        verified: user.verified,
      });

      return res
        .status(200)
        .json({ signature, verified: user.verified, email: user.email });
    } else {
      return res.json({ message: "Invalid User" });
    }
  }

  return res.status(404).json({ message: "Error with login to your account" });
};

export const VerifyCustomer = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { otp } = req.body;
  const user = req.user;

  if (user) {
    const profile = await Customer.findById(user._id);

    if (profile) {
      if (profile.otp === parseInt(otp) && profile.otp_expiry >= new Date()) {
        profile.verified = true;

        const result = await profile.save();

        const signature = await genSignature({
          _id: result._id,
          email: result.email,
          verified: result.verified,
        });

        return res.status(200).json({
          signature: signature,
          email: result.email,
          verified: result.verified,
        });
      }
    }
  }

  return res.status(404).json({ message: "Error with signup" });
};

export const RequestOtp = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const user = req.user;

  if (user) {
    const userProfile = await Customer.findById(user._id);
    if (userProfile) {
      const { otp, expiry } = GenerateOtp();

      userProfile.otp = otp;
      userProfile.otp_expiry = expiry;

      await userProfile.save();

      await onRequestOtp(otp, userProfile.phone);

      return res.status(200).json({ message: "Otp send to your phone number" });
    }
  }

  return res.status(400).json({ message: "Error with Request OTP" });
};

export const ViewProfile = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const user = req.user;

  if (user) {
    const profile = await Customer.findById(user._id);

    if (profile) {
      return res.status(200).json(profile);
    } else {
      return res.status(404).json({ message: "Error on updating profile" });
    }

    return res
      .status(400)
      .json({ message: "Error with your profile updating" });
  }

  return res.status(400).json({ message: "Error with Edit profile" });
};

export const UpdateProfile = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const userInput = plainToClass(ProfileInput, req.body);

  const user = req.user;

  if (user) {
    const profile = await Customer.findById(user._id);
    const { firstName, lastName, address } = userInput;

    if (profile) {
      profile.firstName = firstName;
      profile.lastName = lastName;
      profile.address = address;

      const result = await profile.save();

      return res.status(200).json(result);
    }

    return res.status(400).json({ message: "Error with profile update" });
  }

  return res.status(400).json({ message: "Error with Edit profile" });
};
