export interface FeatureCard {
    name: string;
    iconUrl?: string;
    imageUrl?: string;
    routeUrl?: string;
}

export const FEATURES_LIST: FeatureCard[] = [
    {
        name: 'Orders',
        iconUrl: './assets/app-icons/orders.png',
        routeUrl: '/orders'
    },
    // {
    //     name: 'Reports',
    //     iconUrl: './assets/app-icons/reports.png',
    //     routeUrl: '/reports'
    // },
    {
        name: 'Customers',
        iconUrl: './assets/app-icons/customers.png',
        routeUrl: '/customers'
    },
    {
        name: 'Employees',
        iconUrl: './assets/app-icons/employees.png',
        routeUrl: '/emp'
    },
    // {
    //     name: 'Vendors',
    //     iconUrl: './assets/app-icons/suppliers.png',
    //     routeUrl: '/vendors'
    // },
];
