import express from "express";
import {
  GetFoodAvailability,
  GetFoodIn30Min,
  GetResturentById,
  GetTopResturent,
  SearchFood,
} from "../controller";

const router = express.Router();

/**--------------------- Food Availbility --------------------- */
router.get("/:pincode", GetFoodAvailability);

/**--------------------- Top Resturent --------------------- */

router.get("/top-resturent/:pincode", GetTopResturent);

/**--------------------- Food Availble in 30 min --------------------- */

router.get("/food-in-30-min/:pincode", GetFoodIn30Min);

/**--------------------- Search Foods --------------------- */

router.get("/search/:pincode", SearchFood);

/**--------------------- Find Resturent By Id --------------------- */

router.get("/Resturent/:id", GetResturentById);

export { router as ShoppingRoute };
