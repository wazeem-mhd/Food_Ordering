import { CustomerPayload } from "./CustomerDto";
import { vendorPyload } from "./VendorDto";

export type AuthPayload = vendorPyload | CustomerPayload;
