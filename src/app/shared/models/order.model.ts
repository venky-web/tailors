export interface Order {
    orderId?: string;
    createdDate?: Date | string;
    updatedDate?: Date | string;
    deliveryDate?: Date | string;
    isOneTimeDelivery?: boolean;
    customerId?: number | string;
    customerName?: string;
    totalAmount?: number;
    items?: OrderItem[];
    status?: string;
    comments?: string;
}

export interface OrderItem {
    itemId?: number;
    type?: string;
    itemPrice?: number;
    quantity?: number;
    employeeId?: number | string;
    status?: string;
    deliveryDate?: Date | string;
    comments?: string;
}
