// app.js - Main application

import { transactions } from './transactions.js';
import { 
    totalByType, 
    formatReceipt, 
    formatAllReceipts, 
    getSummary 
} from './report.js';

console.log('=== TeleBirr Transaction Report ===');
console.log('');

// 1. Format all receipts
console.log('--- All Transactions ---');
const receipts = formatAllReceipts(transactions);
receipts.forEach(receipt => console.log(receipt));

console.log('');

// 2. Show totals by type
const totalCredit = totalByType(transactions, 'credit');
const totalDebit = totalByType(transactions, 'debit');

console.log('--- Totals by Type ---');
console.log('Total Credit: ' + totalCredit.toFixed(2) + ' ETB');
console.log('Total Debit: ' + totalDebit.toFixed(2) + ' ETB');

console.log('');

// 3. Show summary
const summary = getSummary(transactions);
console.log('--- Summary ---');
console.log('Total Transactions: ' + summary.totalTransactions);
console.log('Credit Transactions: ' + summary.creditCount);
console.log('Debit Transactions: ' + summary.debitCount);
console.log('Net Balance: ' + summary.netBalance.toFixed(2) + ' ETB');

console.log('');

// 4. Format individual receipts using destructuring
console.log('--- Individual Receipts ---');
transactions.forEach(transaction => {
    console.log(formatReceipt(transaction));
});

console.log('');

// 5. Demonstrate spread - update a transaction without mutating
console.log('--- Spread Demonstration ---');
const originalTransaction = transactions[0];
console.log('Original:');
console.log(formatReceipt(originalTransaction));

// Create updated copy using spread
const updatedTransaction = {
    ...originalTransaction,
    amount: 300,
    customer: 'Almaz (Corrected)'
};

console.log('Updated Copy:');
console.log(formatReceipt(updatedTransaction));

// Verify original is unchanged
console.log('Original Unchanged:');
console.log(formatReceipt(originalTransaction));

console.log('');

// 6. Demonstrate filter for high-value transactions
console.log('--- High Value Transactions (>= 500 ETB) ---');
const highValue = transactions
    .filter(t => t.amount >= 500)
    .map(({ id, customer, amount }) => 
        `#${id} ${customer}: ${amount.toFixed(2)} ETB`
    );

highValue.forEach(item => console.log(item));

console.log('');

// 7. Demonstrate reduce for custom summary
console.log('--- Custom Reduce Summary ---');
const transactionSummary = transactions.reduce((acc, { type, amount }) => {
    if (type === 'credit') {
        acc.creditTotal += amount;
        acc.creditCount++;
    } else {
        acc.debitTotal += amount;
        acc.debitCount++;
    }
    return acc;
}, { creditTotal: 0, creditCount: 0, debitTotal: 0, debitCount: 0 });

console.log('Credit Total: ' + transactionSummary.creditTotal.toFixed(2) + ' ETB');
console.log('Debit Total: ' + transactionSummary.debitTotal.toFixed(2) + ' ETB');
console.log('Credit Count: ' + transactionSummary.creditCount);
console.log('Debit Count: ' + transactionSummary.debitCount);