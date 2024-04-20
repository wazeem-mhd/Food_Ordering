import express, { Request, Response, NextFunction } from "express";
import {
  VendorLogin,
  GetVendorProfile,
  UpdateVendorProfile,
  UpdateVendorService,
  AddNewFood,
  GetAllFoods,
  UpdateVendorProfileImage,
} from "../controller";
import { Authendicate } from "../middlewear";
import multer from "multer";

const imageStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "images");
  },
  filename: function (req, file, cb) {
    cb(null, new Date().toISOString() + "_" + file.originalname);
  },
});

const images = multer({ storage: imageStorage }).array("images", 10);

const router = express.Router();
router.post("/login", VendorLogin);

router.use(Authendicate);

router.get("/profile", GetVendorProfile);
router.patch("/profile", UpdateVendorProfile);
router.patch("/service", UpdateVendorService);
router.patch("/coverimage", images, UpdateVendorProfileImage);

router.post("/food", images, AddNewFood);
router.get("/foods", GetAllFoods);

// router.get("/vendor", (req: Request, res: Response, next: NextFunction) => {
//   res.json({ message: "This is Vendor panel" });
// });

export { router as VendorRoute };
