/*
    Mini-Project — Loyalty Points Module

Requirements
    • Use a closure to keep the points balance private — no outside code can read or change it
    directly.
    • Expose three operations: earn(amount), redeem(amount), and balance() (a getter that returns
    the current points).
    • earn should add points (e.g. 1 point per 10 ETB spent); redeem should subtract, but refuse to
    go below zero.
    • Use a higher-order function to apply an "earn rule" passed in — so a holiday rule (double
    points) can be swapped in without changing the module.
    • Keep the calculation functions pure; confine any console output to the edges.

*/

function createLoyalty(earnRule) {
    let points = 0;
    
    if (earnRule === undefined) {
        earnRule = function(etb) {
            return Math.floor(etb / 10);
        };
    }
    
    return {
        earn: function(etb) {
            const earnedPoints = earnRule(etb);
            points = points + earnedPoints;
            console.log(`Earned ${earnedPoints} points! Total: ${points}`);
            return earnedPoints;
        },
        
        redeem: function(amount) {
            if (amount > points) {
                console.log(`Not enough points! You have ${points}, trying to redeem ${amount}`);
                console.log(`You can redeem ${points} points max`);
                return false;
            }
            
            points = points - amount;
            console.log(`Redeemed ${amount} points! Remaining: ${points}`);
            return true;
        },
        
        balance: function() {
            console.log(`Current points: ${points}`);
            return points;
        }
    };
}

console.log("=== Regular Loyalty Card ===");
const regularCard = createLoyalty();

regularCard.earn(250);
regularCard.earn(100);
regularCard.balance();

regularCard.redeem(10);
regularCard.redeem(30);
regularCard.balance();

console.log("\n=== Holiday Card (Double Points) ===");
const holidayRule = function(etb) {
    return Math.floor(etb / 10) * 2;
};

const holidayCard = createLoyalty(holidayRule);

holidayCard.earn(250);
holidayCard.earn(100);
holidayCard.balance();

holidayCard.redeem(50);
console.log("--- Card 2 Balance ---");
holidayCard.balance();

console.log("\n=== Showing Independent Balances ===");
console.log("Regular card balance:");
regularCard.balance();
console.log("Holiday card balance:");
holidayCard.balance();