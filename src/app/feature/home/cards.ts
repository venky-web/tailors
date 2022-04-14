export interface FeatureCard {
    name: string;
    iconUrl?: string;
    imageUrl?: string;
    routeUrl?: string;
    hasAccess?: boolean;
}

export const FEATURES_LIST: FeatureCard[] = [
    // {
    //     name: 'Orders',
    //     iconUrl: './assets/app-icons/orders.png',
    //     routeUrl: '/orders',
    //     hasAccess: true,
    // },
    // {
    //     name: 'Reports',
    //     iconUrl: './assets/app-icons/reports.png',
    //     routeUrl: '/reports'
    // },
    {
        name: 'Customers',
        iconUrl: './assets/app-icons/customers.png',
        routeUrl: '/customers',
        hasAccess: true,
    },
    {
        name: 'Employees',
        iconUrl: './assets/app-icons/employees.png',
        routeUrl: '/emp',
        hasAccess: true,
    },
    // {
    //     name: 'Vendors',
    //     iconUrl: './assets/app-icons/suppliers.png',
    //     routeUrl: '/vendors'
    // },
    {
        name: 'Requests',
        iconUrl: './assets/app-icons/add-user.png',
        routeUrl: '/requests',
        hasAccess: true,
    },
];
