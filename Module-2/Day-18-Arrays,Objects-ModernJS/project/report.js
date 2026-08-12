// report.js - Summary functions

export function totalByType(transactions, type) {
    return transactions
        .filter(t => t.type === type)
        .reduce((sum, { amount }) => sum + amount, 0);
}

export function formatReceipt({ customer, amount, id }) {
    return `Transaction #${id}: ${customer} - ${amount.toFixed(2)} ETB`;
}

export function formatAllReceipts(transactions) {
    return transactions.map(({ id, customer, amount, type }) => {
        const typeLabel = type === 'credit' ? 'CREDIT' : 'DEBIT';
        return `#${id} ${customer}: ${amount.toFixed(2)} ETB (${typeLabel})`;
    });
}

export function getSummary(transactions) {
    const totalCredit = totalByType(transactions, 'credit');
    const totalDebit = totalByType(transactions, 'debit');
    const netBalance = totalCredit - totalDebit;
    
    return {
        totalCredit,
        totalDebit,
        netBalance,
        totalTransactions: transactions.length,
        creditCount: transactions.filter(t => t.type === 'credit').length,
        debitCount: transactions.filter(t => t.type === 'debit').length
    };
}