export interface Order {
    orderId?: number | string;
    createdDate?: Date | string;
    updatedDate?: Date | string;
    delivaryDate?: Date | string;
    customerId?: number | string;
    customerName?: string;
    totalAmount?: number;
    items?: OrderItem[];
    status?: string;
    comments?: string;
}

export interface OrderItem {
    type?: string;
    itemPrice?: number;
    quantity?: number;
    employeeId?: number | string;
    status?: string;
}
