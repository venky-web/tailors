import { IAddress } from './employee.model';

export interface Customer {
  id?: string;
  name?: string;
  mobileNumber?: number | string;
  status?: string;
  customerImage?: string;
  gender?: string;
  address?: IAddress[];
  createdDate?: Date | string;
  updatedDate?: Date | string;
  createdBy?: string;
  updatedBy?: string;
}
