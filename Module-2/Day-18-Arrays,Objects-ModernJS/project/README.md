# TeleBirr Transaction Report

## Overview

A JavaScript module that processes transaction data for a TeleBirr shop in Addis Ababa, Ethiopia. Demonstrates array methods, destructuring, spread operator, and ES6 modules.

## Modules

### transactions.js
Exports the transaction data array. Each transaction is an object with:
- `id`: Unique transaction ID
- `customer`: Customer name
- `amount`: Transaction amount in ETB
- `type`: "credit" or "debit"

### report.js
Exports summary functions:
- `totalByType(transactions, type)`: Returns total for a transaction type
- `formatReceipt(transaction)`: Formats a single receipt string
- `formatAllReceipts(transactions)`: Formats all receipts
- `getSummary(transactions)`: Returns complete summary object

### app.js
Main application that:
- Imports data and functions
- Generates and displays the report
- Demonstrates all array methods and modern JS features

## Features

- Filter transactions by type
- Calculate totals by type
- Format receipt strings
- Generate complete summary
- Immutable updates using spread
- Destructuring in callbacks

## Usage

1. Open in browser with a server
2. Check console (F12) for output
3. View the HTML page for summary

## Expected Output
