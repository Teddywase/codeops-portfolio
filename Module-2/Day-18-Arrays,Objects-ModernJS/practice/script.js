// Exercises
// Question 1. Given an array of ETB prices, use map to add 15% VAT, filter to keep those under 1000, and
// reduce to a grand total.

document.addEventListener('DOMContentLoaded', function () {

    const prices = [250, 600, 180, 900, 1200, 450, 780, 1500];

    const pricesWithVAT = prices.map(price => price * 1.15);
    const under1000 = pricesWithVAT.filter(price => price < 1000);
    const grandTotal = under1000.reduce((sum, price) => sum + price, 0);

    const totalUnder1000 = prices
        .map(price => price * 1.15)
        .filter(price => price < 1000)
        .reduce((sum, price) => sum + price, 0);

    const ex1Output = document.getElementById('ex1-output');
    if (ex1Output) {
        ex1Output.innerHTML =
            'Prices: ' + prices.join(', ') + '\n' +
            'VAT Rate: 15%\n' +
            '\n--- Step by Step ---\n' +
            'After VAT: ' + pricesWithVAT.map(p => p.toFixed(2)).join(', ') + '\n' +
            'Under 1000: ' + under1000.map(p => p.toFixed(2)).join(', ') + '\n' +
            'Grand Total: ' + grandTotal.toFixed(2) + ' ETB\n' +
            '\n--- Chained Result ---\n' +
            'Total: ' + totalUnder1000.toFixed(2) + ' ETB';
    }

// Question 2. Build a customer object with name, city and balance, then log every key and value using
// Object.entries in a for...of loop.

    const customer = {
        name: "Almaz Bekele",
        city: "Addis Ababa",
        balance: 1500
    };

    let customerOutput = 'Customer Object:\n';
    customerOutput += JSON.stringify(customer, null, 2) + '\n\n';
    customerOutput += '--- Object.entries with for...of ---\n';

    for (const [key, value] of Object.entries(customer)) {
        customerOutput += key + ': ' + value + '\n';
    }

    customer.getBalance = function () {
        return this.balance + ' ETB';
    };

    customerOutput += '\n--- With Method ---\n';
    customerOutput += 'Balance: ' + customer.getBalance() + '\n';

    const ex2Output = document.getElementById('ex2-output');
    if (ex2Output) {
        ex2Output.textContent = customerOutput;
    }

// Question 3. Destructure name and city from a customer in one line, then write a function greet({ name })
// that uses parameter destructuring.

    const customer3 = {
        name: "Dawit Tadesse",
        city: "Gondar",
        balance: 2000,
        phone: "0912345678"
    };

    const { name, city } = customer3;
    const { balance = 0, member = false } = customer3;
    const { name: fullName, city: town } = customer3;

    const order = {
        id: 123,
        customer: {
            name: "Tigist",
            city: "Bahir Dar"
        },
        items: ['Tibs', 'Shiro']
    };

    const { customer: { name: customerName, city: customerCity } } = order;

    function greet({ name, city = "Addis" }) {
        return 'Selam ' + name + ' from ' + city + '!';
    }

    let destructureOutput = '--- Basic Destructuring ---\n';
    destructureOutput += 'Name: ' + name + '\n';
    destructureOutput += 'City: ' + city + '\n\n';

    destructureOutput += '--- Destructuring with Defaults ---\n';
    destructureOutput += 'Balance: ' + balance + '\n';
    destructureOutput += 'Member: ' + member + '\n\n';

    destructureOutput += '--- Destructuring with Renaming ---\n';
    destructureOutput += 'Full Name: ' + fullName + '\n';
    destructureOutput += 'Town: ' + town + '\n\n';

    destructureOutput += '--- Nested Destructuring ---\n';
    destructureOutput += 'Customer Name: ' + customerName + '\n';
    destructureOutput += 'Customer City: ' + customerCity + '\n\n';

    destructureOutput += '--- Function with Parameter Destructuring ---\n';
    destructureOutput += 'Greeting: ' + greet(customer3) + '\n';

    const ex3Output = document.getElementById('ex3-output');
    if (ex3Output) {
        ex3Output.textContent = destructureOutput;
    }

// Question 4. Take a customer object and produce an updated copy with spread that changes the city and
// adds a phone field — without mutating the original.

    const originalCustomer = {
        name: "Henok Ayele",
        city: "Addis Ababa",
        balance: 1200
    };

    const updatedCustomer = {
        ...originalCustomer,
        city: "Mekelle",
        phone: "0912345678"
    };

    const premiumCustomer = {
        ...originalCustomer,
        city: "Hawassa",
        balance: 2000,
        isPremium: true,
        discount: 0.15
    };

    const menu = ['Tibs', 'Shiro', 'Doro Wat'];
    const extendedMenu = [...menu, 'Kitfo', 'Buna'];

    const address = { city: "Addis Ababa", zone: "Bole", woreda: 2 };
    const contact = { phone: "0912345678", email: "henok@example.com" };
    const complete = { ...originalCustomer, ...address, ...contact };

    let spreadOutput = '--- Original Object ---\n';
    spreadOutput += JSON.stringify(originalCustomer, null, 2) + '\n\n';

    spreadOutput += '--- Updated Copy (Spread) ---\n';
    spreadOutput += JSON.stringify(updatedCustomer, null, 2) + '\n\n';

    spreadOutput += '--- Original Unchanged ---\n';
    spreadOutput += JSON.stringify(originalCustomer, null, 2) + '\n\n';

    spreadOutput += '--- Premium Customer ---\n';
    spreadOutput += JSON.stringify(premiumCustomer, null, 2) + '\n\n';

    spreadOutput += '--- Array Spread ---\n';
    spreadOutput += 'Original: [' + menu.join(', ') + ']\n';
    spreadOutput += 'Extended: [' + extendedMenu.join(', ') + ']\n\n';

    spreadOutput += '--- Merged Objects ---\n';
    spreadOutput += JSON.stringify(complete, null, 2) + '\n';

    const ex4Output = document.getElementById('ex4-output');
    if (ex4Output) {
        ex4Output.textContent = spreadOutput;
    }

// Question 5. Split a tiny program into two files: a money.js module that exports addVat and VAT, and an
// app.js that imports and uses them.

    const VAT = 0.15;

    function addVat(amount) {
        return amount * (1 + VAT);
    }

    function formatMoney(amount) {
        return amount.toFixed(2) + ' ETB';
    }

    function calculateDiscount(amount, discount = 0.10) {
        return amount * (1 - discount);
    }

    const samplePrices = [250, 600, 180];

    let moduleOutput = '--- Money Module Demo ---\n';
    moduleOutput += 'VAT Rate: ' + (VAT * 100) + '%\n\n';

    samplePrices.forEach(price => {
        const withVat = addVat(price);
        const discounted = calculateDiscount(price);
        const discountedWithVat = addVat(discounted);

        moduleOutput += 'Original: ' + formatMoney(price) + '\n';
        moduleOutput += 'With VAT: ' + formatMoney(withVat) + '\n';
        moduleOutput += 'Discounted: ' + formatMoney(discounted) + '\n';
        moduleOutput += 'Discounted + VAT: ' + formatMoney(discountedWithVat) + '\n';
        moduleOutput += '---\n';
    });

    const total = samplePrices.reduce((sum, p) => sum + p, 0);
    const totalWithVat = addVat(total);

    moduleOutput += '\nTotal: ' + formatMoney(total) + '\n';
    moduleOutput += 'Total with VAT: ' + formatMoney(totalWithVat) + '\n\n';

    moduleOutput += '--- Discount Examples ---\n';
    moduleOutput += '10% Discount on 1000 ETB: ' + formatMoney(calculateDiscount(1000)) + '\n';
    moduleOutput += '20% Discount on 1000 ETB: ' + formatMoney(calculateDiscount(1000, 0.20)) + '\n';

    moduleOutput += '\n--- Module Structure ---\n';
    moduleOutput += '// money.js (exports)\n';
    moduleOutput += 'export const VAT = 0.15;\n';
    moduleOutput += 'export function addVat(amount) { return amount * (1 + VAT); }\n';
    moduleOutput += 'export function formatMoney(amount) { return amount.toFixed(2) + " ETB"; }\n';
    moduleOutput += 'export default function calculateDiscount(amount, discount = 0.10) { ... }\n\n';
    moduleOutput += '// app.js (imports)\n';
    moduleOutput += 'import calculateDiscount, { VAT, addVat, formatMoney } from "./money.js";';

    const ex5Output = document.getElementById('ex5-output');
    if (ex5Output) {
        ex5Output.textContent = moduleOutput;
    }

    // ============================================================
    // CONSOLE OUTPUT
    // ============================================================


    console.log('\n--- EXERCISE 1: VAT Calculation ---');
    console.log('Prices:', prices);
    console.log('After VAT:', pricesWithVAT.map(p => p.toFixed(2)));
    console.log('Under 1000:', under1000.map(p => p.toFixed(2)));
    console.log('Grand Total:', grandTotal.toFixed(2), 'ETB');
    console.log('Chained Result:', totalUnder1000.toFixed(2), 'ETB');

    console.log('\n--- EXERCISE 2: Object Iteration ---');
    console.log('Customer:', customer);
    console.log('Object.entries:');
    for (const [key, value] of Object.entries(customer)) {
        if (typeof value !== 'function') {
            console.log('  ' + key + ':', value);
        }
    }
    console.log('Balance Method:', customer.getBalance());

    console.log('\n--- EXERCISE 3: Destructuring ---');
    console.log('Name:', name);
    console.log('City:', city);
    console.log('Balance:', balance);
    console.log('Greeting:', greet(customer3));
    console.log('Nested Customer:', customerName, 'from', customerCity);

    console.log('\n--- EXERCISE 4: Spread Operator ---');
    console.log('Original:', originalCustomer);
    console.log('Updated:', updatedCustomer);
    console.log('Original Unchanged:', originalCustomer);
    console.log('Merged Object:', complete);

    console.log('\n--- EXERCISE 5: ES Modules (Simulated) ---');
    console.log('VAT Rate:', (VAT * 100) + '%');
    console.log('Total with VAT:', formatMoney(totalWithVat));
    console.log('Discount 10% on 1000:', formatMoney(calculateDiscount(1000)));
    console.log('Discount 20% on 1000:', formatMoney(calculateDiscount(1000, 0.20)));


});