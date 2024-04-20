import mongoose, { Document, Schema } from "mongoose";

export interface foodDoc extends Document {
  vendorId: string;
  name: string;
  description: string;
  catagory: string;
  foodType: string;
  price: number;
  readyTime: number;
  images: [string];
  rating: number;
}

const foodSchema = new Schema(
  {
    vendorId: { type: String },
    name: { type: String, required: true },
    description: { type: String, required: true },
    catagory: { type: String },
    foodType: { type: String, required: true },
    price: { type: Number, required: true },
    readyTime: { type: Number },
    images: { type: [String] },
    rating: { type: Number },
  },
  {
    timestamps: true,
    toJSON: {
      transform(doc, ret) {
        delete ret.__v;
        delete ret.createdAt;
        delete ret.updatedAt;
      },
    },
  }
);

const Food = mongoose.model<foodDoc>("food", foodSchema);

export { Food };
