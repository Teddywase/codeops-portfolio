// orders.js - Sample order data

export const orders = [
    {
        id: 1,
        customer: "Almaz Bekele",
        vip: true,
        items: [
            { name: "Tibs", price: 200, qty: 2 },
            { name: "Shiro", price: 120, qty: 1 },
            { name: "Injera", price: 50, qty: 4 }
        ]
    },
    {
        id: 2,
        customer: "Dawit Tadesse",
        vip: false,
        items: [
            { name: "Doro Wat", price: 250, qty: 1 },
            { name: "Firfir", price: 150, qty: 1 }
        ]
    },
    {
        id: 3,
        customer: "Tigist Mengistu",
        vip: true,
        items: [
            { name: "Kitfo", price: 300, qty: 1 },
            { name: "Ayib", price: 80, qty: 2 },
            { name: "Buna", price: 40, qty: 3 }
        ]
    },
    {
        id: 4,
        customer: "Henok Ayele",
        vip: false,
        items: [
            { name: "Shiro", price: 120, qty: 2 },
            { name: "Misir Wat", price: 110, qty: 2 },
            { name: "Injera", price: 50, qty: 6 }
        ]
    },
    {
        id: 5,
        customer: "Sami Ababa",
        vip: true,
        items: [
            { name: "Special Tibs", price: 350, qty: 1 },
            { name: "Salad", price: 60, qty: 2 }
        ]
    }
];