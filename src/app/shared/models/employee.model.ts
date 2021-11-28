export interface IEmployee {
    name?: string;
    employeeId?: string | number;
    maritalStatus?: string;
    gender?: string;
    status?: string;
    joinedDate?: Date | string;
    exitDate?: Date | string;
    address?: IAddress;
    mobileNumber?: string | number;
    compensation?: ICompensation[];
}

export interface IAddress {
    doorNo?: string;
    streetName?: string;
    area?: string;
    city?: string;
    state?: string;
    zipcode?: number | string;
    isDefault?: boolean;
}

export interface ICompensation {
    taskId?: number | string;
    taskName?: string;
    amount?: string | number;
}
