
function statement (invoice, plays) {
    let totalAmount = 0;
    let volumeCredits = 0;
    let result = `Statement for ${invoice.customer}\n`;
    const format = new Intl.NumberFormat("en-US",
        { style: "currency", currency: "USD",
            minimumFractionDigits: 2 }).format;

    for (let perf of invoice.performances) {
        const play = plays[perf.playID];
        let thisAmount = getEventCost(play.type, perf.audience);
        // add volume credits
        volumeCredits += Math.max(perf.audience - 30, 0);
        // add extra credit for every ten comedy attendees
        if ("comedy" === play.type) volumeCredits += Math.floor(perf.audience / 5);
        // print line for this order
        result += ` ${play.name}: ${format(thisAmount/100)} (${perf.audience} seats)\n`;
        totalAmount += thisAmount;
    }
    result += `Amount owed is ${format(totalAmount/100)}\n`;
    result += `You earned ${volumeCredits} credits\n`;
    return result;
}

function getEventCost(playType, totalAudience) {
    let eventCost = 0;
    switch (playType) {
        case "tragedy":
            eventCost = 40000;
            if (totalAudience > 30) {
                eventCost += 1000 * (totalAudience - 30);
            }
            break;
        case "comedy":
            eventCost = 30000;
            if (totalAudience > 20) {
                eventCost += 10000 + 500 * (totalAudience - 20);
            }
            eventCost += 300 * totalAudience;
            break;
        default:
            throw new Error(`unknown type: ${playType}`);
    }
    return eventCost;
}

module.exports = statement;
