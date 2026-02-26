export interface Option {
    id: string;
    text: string;
    score: number;
}

export interface Question {
    id: number;
    category: string;
    text: string;
    options: Option[];
}

export const questions: Question[] = [
    // Part 1: The Fortress Foundation (Protection Shield)
    {
        id: 1,
        category: 'Protection Shield',
        text: "The 'Corporate Handcuff' Test: If you left your job tomorrow (voluntarily or forced), what happens to your family's health insurance coverage?",
        options: [
            { id: '1a', text: "It vanishes immediately. (I rely 100% on my employer).", score: 1 },
            { id: '1b', text: "I have a small backup (under ₹5 Lakhs personal cover).", score: 3 },
            { id: '1c', text: "Sovereign. (I have a comprehensive personal policy of ₹25L+ that covers me regardless of employment).", score: 5 },
        ]
    },
    {
        id: 2,
        category: 'Protection Shield',
        text: "The 'Real Legacy' Test: If you were no longer around, how long would your current life insurance payout cover your family's current monthly expenses?",
        options: [
            { id: '2a', text: "Less than 3 years. (My policies are mostly for investment/tax, not protection).", score: 1 },
            { id: '2b', text: "5–10 years. (It helps, but lifestyle adjustments would be inevitable).", score: 3 },
            { id: '2c', text: "20+ years / Infinite. (I have a Term Plan that fully replaces my income).", score: 5 },
        ]
    },
    {
        id: 3,
        category: 'Protection Shield',
        text: "The 'Wealth Leak' Test: Do you have adequate insurance to protect your major assets (Home) and liabilities?",
        options: [
            { id: '3a', text: "Mandatory Only. (I just have car insurance; nothing for my home/flat).", score: 1 },
            { id: '3b', text: "Partial. (I have vehicle insurance, but no Home or Cyber insurance).", score: 3 },
            { id: '3c', text: "Fortified. (My home structure and contents are fully insured against fire/disaster).", score: 5 },
        ]
    },

    // Part 2: AI-Proof Score (Income Sovereignty)
    {
        id: 4,
        category: 'Income Sovereignty',
        text: "The Runway Reality Check: If AI restructuring caused you to lose your primary income tomorrow, how long could your family maintain their lifestyle without selling loss-making investments?",
        options: [
            { id: '4a', text: "Less than 3 months. (Panic mode).", score: 1 },
            { id: '4b', text: "3–6 months. (Uncomfortable).", score: 3 },
            { id: '4c', text: "12+ months. (Sovereign).", score: 5 },
        ]
    },
    {
        id: 5,
        category: 'Income Sovereignty',
        text: "Income Dependency: Does your retirement plan rely 100% on your ability to hold a high-paying tech role until age 58?",
        options: [
            { id: '5a', text: "Yes, absolutely.", score: 1 },
            { id: '5b', text: "Mostly, but I have some savings.", score: 3 },
            { id: '5c', text: "No, I have a system that works even if I earn less later.", score: 5 },
        ]
    },
    {
        id: 6,
        category: 'Income Sovereignty',
        text: "Skill & Systems: Do you have a 'Plan B' income source or a wealth system that grows independently of your daily log-in hours?",
        options: [
            { id: '6a', text: "No, just my salary.", score: 1 },
            { id: '6b', text: "I have some random investments.", score: 3 },
            { id: '6c', text: "Yes, my wealth grows on autopilot.", score: 5 },
        ]
    },

    // Part 3: Market-Proof Score (Volatility Defense)
    {
        id: 7,
        category: 'Volatility Defense',
        text: "The 'Red Portfolio' Reaction: When you see your portfolio drop 20% in a crash, what is your immediate instinct?",
        options: [
            { id: '7a', text: "Panic/Fear. ('I want to stop SIPs or sell to prevent loss').", score: 1 },
            { id: '7b', text: "Anxiety. ('I worry and start searching YouTube for advice').", score: 3 },
            { id: '7c', text: "Opportunity. ('I do nothing—my system handles the risk automatically').", score: 5 },
        ]
    },
    {
        id: 8,
        category: 'Volatility Defense',
        text: "The 'Ticker Addiction' Test: During periods of high market volatility, how often do you check your portfolio?",
        options: [
            { id: '8a', text: "Daily / Multiple times a day.", score: 1 },
            { id: '8b', text: "Weekly.", score: 3 },
            { id: '8c', text: "Rarely / Quarterly. (My system doesn't require monitoring).", score: 5 },
        ]
    },
    {
        id: 9,
        category: 'Volatility Defense',
        text: "The 'Lost Decade' Scenario: If the market stayed flat or went down for the next 3 years, how would it affect your life plans?",
        options: [
            { id: '9a', text: "Catastrophe. (I'd have to delay retirement).", score: 1 },
            { id: '9b', text: "Stressful. (I'd be very worried).", score: 3 },
            { id: '9c', text: "No Impact. (My 'Layer 1' guaranteed foundation covers my needs).", score: 5 },
        ]
    },

    // Part 4: Inflation-Proof Score (Purchasing Power)
    {
        id: 10,
        category: 'Purchasing Power',
        text: "The 'Real Inflation' Check: What inflation rate are you using to plan for your children's education and future medical costs?",
        options: [
            { id: '10a', text: "Standard (6%). (I use the general inflation number).", score: 1 },
            { id: '10b', text: "Aggressive (8-10%). (I know these costs rise faster).", score: 3 },
            { id: '10c', text: "Proofed. (My portfolio has a specific 'Layer 3' to beat lifestyle inflation).", score: 5 },
        ]
    },
    {
        id: 11,
        category: 'Purchasing Power',
        text: "The 'Lifestyle Creep' Test: To maintain your current lifestyle in 15 years, how much annual income do you think you will need?",
        options: [
            { id: '11a', text: "The same or slightly more. (₹35-40 Lakhs).", score: 1 },
            { id: '11b', text: "Double. (₹50-60 Lakhs).", score: 3 },
            { id: '11c', text: "The Scary Truth. (I know I'll need ₹75+ Lakhs, and I'm building for that).", score: 5 },
        ]
    },
    {
        id: 12,
        category: 'Purchasing Power',
        text: "The Medical Reality: If a major medical procedure costs ₹50 Lakhs in 20 years, are you relying solely on health insurance?",
        options: [
            { id: '12a', text: "Yes, my policy will cover it.", score: 1 },
            { id: '12b', text: "Partially, I have a top-up.", score: 3 },
            { id: '12c', text: "No, I have a dedicated 'healthcare inflation' corpus growing separately.", score: 5 },
        ]
    },

    // Part 5: Sovereignty Score (Freedom)
    {
        id: 13,
        category: 'Freedom',
        text: "The 'Permission' Test: If your boss demanded you cancel a family event for work, can you say 'No' without fear?",
        options: [
            { id: '13a', text: "No. (I need this job too much).", score: 1 },
            { id: '13b', text: "Maybe. (It would be stressful).", score: 3 },
            { id: '13c', text: "Yes. (I work because I choose to, not because I have to).", score: 5 },
        ]
    },
    {
        id: 14,
        category: 'Freedom',
        text: "The '2 AM' Test: How often do you lie awake worrying about your financial future?",
        options: [
            { id: '14a', text: "Frequently. (Constant low-grade anxiety).", score: 1 },
            { id: '14b', text: "Sometimes. (Usually after bad news).", score: 3 },
            { id: '14c', text: "Never. (I sleep peacefully).", score: 5 },
        ]
    },
    {
        id: 15,
        category: 'Freedom',
        text: "The 'Autopilot' Check: Does managing your money require constant attention?",
        options: [
            { id: '15a', text: "Yes. (I constantly check apps and read news).", score: 1 },
            { id: '15b', text: "Sort of. (I look at it monthly).", score: 3 },
            { id: '15c', text: "No. (My 'Triple-Proof' system works quietly while I live).", score: 5 },
        ]
    }
];

export const getArchetype = (score: number) => {
    // Max score is 75 (15 * 5). Min score is 15.
    if (score < 45) {
        return {
            title: "The Fragile High-Earner",
            description: "You are earning well, but your wealth is exposed. You lack a defensive foundation and a Triple-Proof system. One AI shift, one market crash, or a medical emergency could derail your future.",
            color: "text-red-500",
            bgAlert: "bg-red-50",
            cta: "You don't need more products; you need a Sovereign Architecture."
        };
    } else if (score < 65) {
        return {
            title: "The Vulnerable Builder",
            description: "You have a solid start and some protections in place, but your system is not completely decoupled from your time or immune to severe market/inflation shocks.",
            color: "text-amber-500",
            bgAlert: "bg-amber-50",
            cta: "You need to upgrade from random products to a cohesive Triple-Proof system."
        };
    } else {
        return {
            title: "The Sovereign Investor",
            description: "Congratulations. You are operating from a position of true financial sovereignty. Your wealth is decoupled from your time and protected against the major wealth killers.",
            color: "text-emerald-500",
            bgAlert: "bg-emerald-50",
            cta: "Continue to optimize and protect your Sovereign Architecture."
        };
    }
};
