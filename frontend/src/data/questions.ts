export interface Option {
    id: string;
    text: string;
    score: number;
}

export interface Question {
    id: number;
    category: 'Protection' | 'Income' | 'Market' | 'Inflation';
    text: string;
    options: Option[];
}

export const questions: Question[] = [
    {
        id: 1,
        category: 'Protection',
        text: "If a market crash erased 30% of your portfolio tomorrow, how would it affect your retirement timeline?",
        options: [
            { id: '1a', text: "I'd have to delay retirement indefinitely", score: 1 },
            { id: '1b', text: "I'd have to work a few extra years", score: 3 },
            { id: '1c', text: "It wouldn't affect my timeline at all", score: 5 },
        ]
    },
    {
        id: 2,
        category: 'Income',
        text: "What percentage of your basic living expenses are covered by guaranteed lifetime income (like a pension or annuities)?",
        options: [
            { id: '2a', text: "Less than 25%", score: 1 },
            { id: '2b', text: "Between 25% and 75%", score: 3 },
            { id: '2c', text: "More than 75%", score: 5 },
        ]
    },
    {
        id: 3,
        category: 'Inflation',
        text: "How structured is your portfolio to combat long-term inflation?",
        options: [
            { id: '3a', text: "Mostly cash and low-yield bonds", score: 1 },
            { id: '3b', text: "A standard mix of stocks and bonds", score: 3 },
            { id: '3c', text: "Specifically holds inflation-hedged assets (Real Estate, TIPS, Equities)", score: 5 },
        ]
    },
    {
        id: 4,
        category: 'Market',
        text: "How do you actively manage risk as you approach or enter retirement?",
        options: [
            { id: '4a', text: "I don't; I just hope the market keeps going up", score: 1 },
            { id: '4b', text: "I shift to a generic 'conservative' mutual fund", score: 3 },
            { id: '4c', text: "I use a structured bucket strategy (short-term cash, long-term growth)", score: 5 },
        ]
    },
    {
        id: 5,
        category: 'Protection',
        text: "If you required long-term medical care, how would you fund it?",
        options: [
            { id: '5a', text: "I'd have to sell my home or deplete my investments", score: 1 },
            { id: '5b', text: "I have some savings set aside for emergencies", score: 3 },
            { id: '5c', text: "I have a dedicated long-term care policy or designated fund", score: 5 },
        ]
    },
    {
        id: 6,
        category: 'Income',
        text: "How much buffer do you have against unexpected tax rate increases?",
        options: [
            { id: '6a', text: "All my money is in pre-tax accounts (Traditional IRA/401k)", score: 1 },
            { id: '6b', text: "I have a mix, but mostly pre-tax", score: 3 },
            { id: '6c', text: "I have significant tax-free assets (Roth, HSA, Life Insurance)", score: 5 },
        ]
    },
    {
        id: 7,
        category: 'Market',
        text: "Are your investments heavily concentrated in your employer's stock or a single sector?",
        options: [
            { id: '7a', text: "Yes, more than 20% is in one stock/sector", score: 1 },
            { id: '7b', text: "Somewhat, maybe 10-20%", score: 3 },
            { id: '7c', text: "No, my portfolio is broadly diversified", score: 5 },
        ]
    },
    {
        id: 8,
        category: 'Inflation',
        text: "How often do you adjust your withdrawal rate based on market performance?",
        options: [
            { id: '8a', text: "I plan to take a fixed amount no matter what", score: 1 },
            { id: '8b', text: "I will adjust it slightly if the market crashes", score: 3 },
            { id: '8c', text: "I use a dynamic withdrawal strategy tied to portfolio health", score: 5 },
        ]
    },
    {
        id: 9,
        category: 'Protection',
        text: "Do you have an estate plan (Will, Trust, Power of Attorney) that is currently up to date?",
        options: [
            { id: '9a', text: "No, I haven't set that up yet", score: 1 },
            { id: '9b', text: "Yes, but it's over 10 years old", score: 3 },
            { id: '9c', text: "Yes, fully updated and regularly reviewed", score: 5 },
        ]
    },
    {
        id: 10,
        category: 'Income',
        text: "How clear is your strategy for claiming Social Security?",
        options: [
            { id: '10a', text: "I plan to just take it as soon as I retire", score: 1 },
            { id: '10b', text: "I have a rough idea of when I should take it", score: 3 },
            { id: '10c', text: "I have an optimized claiming strategy coordinated with my spouse", score: 5 },
        ]
    },
    {
        id: 11,
        category: 'Market',
        text: "How would you describe your emotional response to a 20% market drop?",
        options: [
            { id: '11a', text: "Panic. I'd likely sell to avoid further losses.", score: 1 },
            { id: '11b', text: "Stressed, but I would try to ride it out.", score: 3 },
            { id: '11c', text: "Calm. My near-term income is secure from market volatility.", score: 5 },
        ]
    },
    {
        id: 12,
        category: 'Inflation',
        text: "What are your expectations for healthcare costs in retirement?",
        options: [
            { id: '12a', text: "I assume Medicare will cover everything", score: 1 },
            { id: '12b', text: "I haven't really factored them into my budget", score: 3 },
            { id: '12c', text: "I have a specific budget line for rising healthcare and premiums", score: 5 },
        ]
    },
    {
        id: 13,
        category: 'Protection',
        text: "If you pass away prematurely, how secure is your spouse's financial future?",
        options: [
            { id: '13a', text: "They would likely struggle to maintain their lifestyle", score: 1 },
            { id: '13b', text: "They would be okay, but have to make budgetary cuts", score: 3 },
            { id: '13c', text: "Completely secure via life insurance and survivor benefits", score: 5 },
        ]
    },
    {
        id: 14,
        category: 'Income',
        text: "Do you know exactly how much net income your portfolio can safely generate each month?",
        options: [
            { id: '14a', text: "No, I am just guessing based on a rule of thumb", score: 1 },
            { id: '14b', text: "I have an estimate, but it lacks stress-testing", score: 3 },
            { id: '14c', text: "Yes, driven by a comprehensive financial plan", score: 5 },
        ]
    },
    {
        id: 15,
        category: 'Market',
        text: "How protected are your assets against a prolonged bear market (3+ years)?",
        options: [
            { id: '15a', text: "Not protected. I rely entirely on market returns to fund retirement.", score: 1 },
            { id: '15b', text: "I have 1-2 years of cash buffer.", score: 3 },
            { id: '15c', text: "I have 3-5+ years of safe assets to draw from so I never sell equities at a loss.", score: 5 },
        ]
    }
];

export const getArchetype = (score: number) => {
    if (score < 40) {
        return {
            title: "Highly Fragile",
            description: "Your retirement plan is highly exposed to market shocks, inflation, and unexpected events. A significant course correction is needed.",
            color: "text-red-500",
            bgAlert: "bg-red-50"
        };
    } else if (score < 60) {
        return {
            title: "Vulnerable",
            description: "You have a foundation, but there are structural weaknesses in your plan that could derail your retirement if a major economic event occurs.",
            color: "text-amber-500",
            bgAlert: "bg-amber-50"
        };
    } else {
        return {
            title: "Resilient (Sovereign)",
            description: "Congratulations. You have achieved true financial sovereignty. Your plan is bulletproofed against market volatility, inflation, and sequence of returns risk.",
            color: "text-emerald-500",
            bgAlert: "bg-emerald-50"
        };
    }
};
