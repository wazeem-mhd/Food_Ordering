export interface createVendorInput {
  name: string;
  ownerName: string;
  foodType: [string];
  pinCode: string;
  address: string;
  email: string;
  password: string;
  phone: string;
}

export interface vendorloginData {
  email: string;
  password: string;
}

export interface vendorUpdateInput {
  address: string;
  phone: string;
  foodType: [string];
  name: string;
}

export interface vendorPyload {
  _id: string;
  name: string;
  email: string;
  foodType: [string];
}
