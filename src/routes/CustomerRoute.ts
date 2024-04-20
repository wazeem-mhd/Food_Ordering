import express from "express";
import {
  LoginUser,
  SignUpUser,
  RequestOtp,
  UpdateProfile,
  VerifyCustomer,
  ViewProfile,
} from "../controller";
import { Authendicate } from "../middlewear";

const router = express.Router();

/**--------------------- sign-Up --------------------- */

router.post("/signup", SignUpUser);

/**--------------------- Login --------------------- */

router.post("/login", LoginUser);
/**--------------------- Verify customer account --------------------- */

router.use(Authendicate);

router.patch("/verify", VerifyCustomer);
/**--------------------- OTP / OTP Request --------------------- */
router.patch("/otp", RequestOtp);

/**--------------------- Profile --------------------- */

router.get("/profile", ViewProfile);
router.patch("/profile", UpdateProfile);

export { router as CustomerRouter };
