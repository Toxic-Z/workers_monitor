import { EmployeeAddress } from './employee-address';

export interface Employee {
  name: string;
  gender: string;
  contactInfo: {
    address: EmployeeAddress;
    email: string;
  };
  addDate: string;
  salary: number;
  position: string;
  __v?: number;
  _id?: string;
}
