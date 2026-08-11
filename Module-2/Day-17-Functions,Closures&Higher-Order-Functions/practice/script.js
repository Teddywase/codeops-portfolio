"use strict";
// Exercises
// Question 1. Write a vat(amount, rate = 0.15) function using a default parameter, then write the same logic
// as an arrow function with an implicit return.

function vat(amount, rate = 0.15) {
    return amount * (1 + rate);
}

const vatArrow = (amount, rate = 0.15) => amount * (1 + rate);

console.log("Question 1");
console.log("vat(100):", vat(100));
console.log("vat(100, 0.20):", vat(100, 0.20));
console.log("vatArrow(100):", vatArrow(100));
console.log("vatArrow(100, 0.20):", vatArrow(100, 0.20));

// Question 2. Write a makeCounter closure that returns a function incrementing a private count. Call it several
// times and, in a comment, explain why count stays private.
function makeCounter() {
    let count = 0;
    return function () {
        count++;
        return count;
    };
}

console.log("\n Question 2");
const counter = makeCounter();
console.log("counter():", counter());
console.log("counter():", counter());
console.log("counter():", counter());

// Question 3. Write a discountBy(rate) factory and create memberPrice (10%) and salePrice (30%) from it.
// Apply both to a price of 1000 ETB.

function discountBy(rate) {
    return function (price) {
        return price * (1 - rate);
    };
}

console.log("\n Question 3");
const memberPrice = discountBy(0.10);
const salePrice = discountBy(0.30);
const price = 1000;
console.log(`Original: ${price} ETB`);
console.log(`Member (10%): ${memberPrice(price)} ETB`);
console.log(`Sale (30%): ${salePrice(price)} ETB`);

// Question 4. Write a higher-order applyToAll(list, fn) that runs fn over every item and returns the results, then
// use it to add VAT to an array of prices.

function applyToAll(list, fn) {
    const result = [];
    for (let i = 0; i < list.length; i++) {
        result.push(fn(list[i]));
    }
    return result;
}

console.log("\n Question 4");
const prices = [100, 200, 300, 400, 500];
const withVAT = applyToAll(prices, p => p * 1.15);
console.log("Prices with VAT:", withVAT);

// Question 5. Use forEach (a callback) to print each Ethiopian city in an array with its index, e.g. "1. Addis
// Ababa"
console.log("\n Question 5");
const cities = ["Addis Ababa", "Dire Dawa", "Mekelle", "Gondar", "Bahir Dar"];
cities.forEach((city, i) => console.log(`${i + 1}. ${city}`));