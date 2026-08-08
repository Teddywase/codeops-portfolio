//Build a TeleBirr tip & split calculator
// Steps
// • Read bill and partySize; convert the bill with Number().
// • Add a 10% tip when the bill is over 300 ETB, else 5%.
// • Compute the total and the per-person amount.
// • Print a clear message with a template literal.
// • Use a switch to add a TeleBirr / CBE Birr service fee.


'use strict';

const billRaw = prompt("Enter bill");
const services = prompt("Enter method of service");
const service = services;
const bill = Number(billRaw);
const partySizeRaw = prompt("Enter party size");
const partySize = Number(partySizeRaw);
let fee;


const tip = bill > 300 ? bill * 0.10 : bill * 0.05;
let total = bill + tip;

switch (service) {
    case 'telebirr':
        fee = total * 0.005;
        break;
    case 'cbebirr':
        fee = total * 0.01;
        break;
    default:
        fee = total * 0.02;
}

total = total + fee;
const perPerson = total / partySize;

console.log(
    `Total ${total.toFixed(2)} ETB, ` +
    `${perPerson.toFixed(2)} ETB each`
);