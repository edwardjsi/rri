const { DynamoDBClient } = require('@aws-sdk/client-dynamodb');
const { DynamoDBDocumentClient, PutCommand } = require('@aws-sdk/lib-dynamodb');
const { SESv2Client, SendEmailCommand } = require('@aws-sdk/client-sesv2');

const client = new DynamoDBClient({});
const docClient = DynamoDBDocumentClient.from(client);
const sesClient = new SESv2Client({ region: 'ap-south-1' });

// Admin email to notify - MUST BE VERIFIED IN SES
const ADMIN_EMAIL = 'edwardjsi@gmail.com';
const FROM_EMAIL = 'edwardjsi@gmail.com'; // Must be verified in SES

// Question map for answer labels
const QUESTIONS = [
    { id: 1, category: 'Protection Shield', text: "The 'Corporate Handcuff' Test: If you left your job tomorrow (voluntarily or forced), what happens to your family's health insurance coverage?" },
    { id: 2, category: 'Protection Shield', text: "The 'Real Legacy' Test: If you were no longer around, how long would your current life insurance payout cover your family's current monthly expenses?" },
    { id: 3, category: 'Protection Shield', text: "The 'Wealth Leak' Test: Do you have adequate insurance to protect your major assets (Home) and liabilities?" },
    { id: 4, category: 'Income Sovereignty', text: "The Runway Reality Check: If AI restructuring caused you to lose your primary income tomorrow, how long could your family maintain their lifestyle without selling loss-making investments?" },
    { id: 5, category: 'Income Sovereignty', text: "Income Dependency: Does your retirement plan rely 100% on your ability to hold a high-paying tech role until age 58?" },
    { id: 6, category: 'Income Sovereignty', text: "Skill & Systems: Do you have a 'Plan B' income source or a wealth system that grows independently of your daily log-in hours?" },
    { id: 7, category: 'Volatility Defense', text: "The 'Red Portfolio' Reaction: When you see your portfolio drop 20% in a crash, what is your immediate instinct?" },
    { id: 8, category: 'Volatility Defense', text: "The 'Ticker Addiction' Test: During periods of high market volatility, how often do you check your portfolio?" },
    { id: 9, category: 'Volatility Defense', text: "The 'Lost Decade' Scenario: If the market stayed flat or went down for the next 3 years, how would it affect your life plans?" },
    { id: 10, category: 'Purchasing Power', text: "The 'Real Inflation' Check: What inflation rate are you using to plan for your children's education and future medical costs?" },
    { id: 11, category: 'Purchasing Power', text: "The 'Lifestyle Creep' Test: To maintain your current lifestyle in 15 years, how much annual income do you think you will need?" },
    { id: 12, category: 'Purchasing Power', text: "The Medical Reality: If a major medical procedure costs ₹50 Lakhs in 20 years, are you relying solely on health insurance?" },
    { id: 13, category: 'Freedom', text: "The 'Permission' Test: If your boss demanded you cancel a family event for work, can you say 'No' without fear?" },
    { id: 14, category: 'Freedom', text: "The '2 AM' Test: How often do you lie awake worrying about your financial future?" },
    { id: 15, category: 'Freedom', text: "The 'Autopilot' Check: Does managing your money require constant attention?" }
];

function getOptionLabel(questionId, score) {
    if (score === 1) return 'Low resilience / Fragile';
    if (score === 3) return 'Moderate resilience / Vulnerable';
    if (score === 5) return 'High resilience / Sovereign';
    return `Score: ${score}`;
}

exports.handler = async (event) => {
    console.log('Event:', JSON.stringify(event));

    try {
        const { sessionId, name, email, phone, answers, score } = JSON.parse(event.body || '{}');

        if (!sessionId) {
            return { statusCode: 400, body: JSON.stringify({ message: 'Missing sessionId' }) };
        }

        // 1. Save to DynamoDB
        const putItemCmd = new PutCommand({
            TableName: process.env.TABLE_NAME,
            Item: {
                sessionId,
                name,
                email,
                phone,
                answers,
                score,
                createdAt: new Date().toISOString()
            },
        });

        await docClient.send(putItemCmd);
        console.log('Saved to DynamoDB successfully.');

        // 2. Add Subscriber to MailerLite (if email provided)
        if (email) {
            const mlApiKey = process.env.MAILERLITE_API_KEY;
            if (mlApiKey && mlApiKey !== 'dummy-key') {
                const mlPayload = {
                    email,
                    fields: {
                        name: name || '',
                        phone: phone || '',
                        rri_score: score || 0
                    }
                };

                const response = await fetch('https://connect.mailerlite.com/api/subscribers', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json',
                        'Authorization': `Bearer ${mlApiKey}`
                    },
                    body: JSON.stringify(mlPayload)
                });

                if (!response.ok) {
                    const mlError = await response.text();
                    console.error('MailerLite Error:', mlError);
                } else {
                    console.log('Successfully subscribed to MailerLite.');
                }
            } else {
                console.warn('MailerLite API Key is missing or invalid. Skipping MailerLite integration.');
            }
        }

        // 3. Send Admin Notification Email via SES
        await sendAdminNotificationSES({ sessionId, name, email, phone, score, answers });

        return {
            statusCode: 200,
            headers: {
                'Access-Control-Allow-Origin': '*',
            },
            body: JSON.stringify({ message: 'Assessment saved successfully.' }),
        };
    } catch (error) {
        console.error('Error processing request:', error);
        return {
            statusCode: 500,
            headers: {
                'Access-Control-Allow-Origin': '*',
            },
            body: JSON.stringify({ message: 'Internal Server Error' }),
        };
    }
};

async function sendAdminNotificationSES(data) {
    const { sessionId, name, email, phone, score, answers } = data;
    const archetype = getArchetype(score);
    const maxScore = 75;
    const scorePercentage = Math.round((score / maxScore) * 100);

    const subject = `🎯 New RRI Assessment: ${name} - ${archetype.title} (${scorePercentage}%)`;
    const htmlBody = generateAdminEmailHtml(data, archetype, scorePercentage);
    const textBody = generateAdminEmailText(data, archetype, scorePercentage);

    const command = new SendEmailCommand({
        FromEmailAddress: FROM_EMAIL,
        Destination: {
            ToAddresses: [ADMIN_EMAIL]
        },
        Content: {
            Simple: {
                Subject: { Data: subject, Charset: 'UTF-8' },
                Body: {
                    Html: { Data: htmlBody, Charset: 'UTF-8' },
                    Text: { Data: textBody, Charset: 'UTF-8' }
                }
            }
        }
    });

    try {
        const response = await sesClient.send(command);
        console.log('Admin notification email sent via SES:', response.MessageId);
    } catch (error) {
        console.error('SES Email Error:', error);
        // Fallback log
        console.log('ADMIN NOTIFICATION (fallback log):', JSON.stringify({
            to: ADMIN_EMAIL,
            subject,
            name,
            email,
            phone,
            score,
            archetype: archetype.title
        }, null, 2));
    }
}

function getArchetype(score) {
    if (score < 45) {
        return { title: "The Fragile High-Earner", color: "red" };
    } else if (score < 65) {
        return { title: "The Vulnerable Builder", color: "amber" };
    } else {
        return { title: "The Sovereign Investor", color: "emerald" };
    }
}

function generateAdminEmailHtml(data, archetype, scorePercentage) {
    const { name, email, phone, score, sessionId, createdAt, answers } = data;
    
    let answersHtml = '';
    if (answers && Object.keys(answers).length > 0) {
        answersHtml = '<div style="background: white; padding: 24px; border-radius: 8px; border-left: 4px solid #6b7280;">\n            <h2 style="margin: 0 0 16px 0; color: #1f2937; font-size: 20px;">All Answers</h2>\n            <table style="width: 100%; border-collapse: collapse; font-size: 13px;">\n                <thead>\n                    <tr style="background: #f9fafb;">\n                        <th style="padding: 10px 8px; text-align: left; font-weight: 600; color: #6b7280; border-bottom: 1px solid #e5e7eb; width: 5%;">#</th>\n                        <th style="padding: 10px 8px; text-align: left; font-weight: 600; color: #6b7280; border-bottom: 1px solid #e5e7eb; width: 25%;">Category</th>\n                        <th style="padding: 10px 8px; text-align: left; font-weight: 600; color: #6b7280; border-bottom: 1px solid #e5e7eb; width: 50%;">Question</th>\n                        <th style="padding: 10px 8px; text-align: left; font-weight: 600; color: #6b7280; border-bottom: 1px solid #e5e7eb; width: 20%;">Answer</th>\n                    </tr>\n                </thead>\n                <tbody>';
        
        QUESTIONS.forEach((q, idx) => {
            const userScore = answers[q.id];
            if (userScore !== undefined) {
                const label = getOptionLabel(q.id, userScore);
                const scoreColor = userScore === 5 ? '#059669' : userScore === 3 ? '#d97706' : '#dc2626';
                const bgColor = idx % 2 === 0 ? '#f9fafb' : 'white';
                answersHtml += `\n                    <tr style="background: ${bgColor};">\n                        <td style="padding: 10px 8px; color: #6b7280; font-weight: 600; border-bottom: 1px solid #f3f4f6;">${q.id}</td>\n                        <td style="padding: 10px 8px; color: #374151; font-size: 12px; font-weight: 500; border-bottom: 1px solid #f3f4f6;">${q.category}</td>\n                        <td style="padding: 10px 8px; color: #1f2937; border-bottom: 1px solid #f3f4f6;">${q.text}</td>\n                        <td style="padding: 10px 8px; border-bottom: 1px solid #f3f4f6;">\n                            <span style="display: inline-block; padding: 4px 8px; border-radius: 4px; font-weight: 600; font-size: 12px; background: ${scoreColor}15; color: ${scoreColor};">${label} (${userScore}/5)</span>\n                        </td>\n                    </tr>`;
            }
        });
        
        answersHtml += '\n                </tbody>\n            </table>\n        </div>';
    }
    
    const archetypeColors = {
        red: { bg: '#fef2f2', text: '#dc2626', border: '#ef4444' },
        amber: { bg: '#fffbeb', text: '#d97706', border: '#f59e0b' },
        emerald: { bg: '#ecfdf5', text: '#059669', border: '#10b981' }
    };
    const colors = archetypeColors[archetype.color] || archetypeColors.amber;

    return `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #1f2937; max-width: 700px; margin: 0 auto; padding: 20px;">
    <div style="background: linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%); padding: 30px; border-radius: 12px 12px 0 0; text-align: center;">
        <h1 style="color: white; margin: 0; font-size: 24px;">🎯 New RRI Assessment Complete</h1>
    </div>
    
    <div style="background: #f9fafb; padding: 30px; border-radius: 0 0 12px 12px; border: 1px solid #e5e7eb;">
        <div style="background: white; padding: 24px; border-radius: 8px; margin-bottom: 24px; border-left: 4px solid #3b82f6;">
            <h2 style="margin: 0 0 16px 0; color: #1f2937; font-size: 20px;">Lead Details</h2>
            <table style="width: 100%; border-collapse: collapse;">
                <tr>
                    <td style="padding: 8px 0; font-weight: 600; color: #6b7280; width: 120px;">Name:</td>
                    <td style="padding: 8px 0; color: #1f2937;">${name}</td>
                </tr>
                <tr>
                    <td style="padding: 8px 0; font-weight: 600; color: #6b7280;">Email:</td>
                    <td style="padding: 8px 0; color: #1f2937;"><a href="mailto:${email}" style="color: #3b82f6;">${email}</a></td>
                </tr>
                <tr>
                    <td style="padding: 8px 0; font-weight: 600; color: #6b7280;">Phone:</td>
                    <td style="padding: 8px 0; color: #1f2937;">${phone || 'Not provided'}</td>
                </tr>
                <tr>
                    <td style="padding: 8px 0; font-weight: 600; color: #6b7280;">Session ID:</td>
                    <td style="padding: 8px 0; color: #1f2937; font-family: monospace; font-size: 12px;">${sessionId}</td>
                </tr>
                <tr>
                    <td style="padding: 8px 0; font-weight: 600; color: #6b7280;">Submitted:</td>
                    <td style="padding: 8px 0; color: #1f2937;">${new Date(createdAt).toLocaleString()}</td>
                </tr>
            </table>
        </div>

        <div style="background: white; padding: 24px; border-radius: 8px; margin-bottom: 24px; border-left: 4px solid ${colors.border};">
            <h2 style="margin: 0 0 16px 0; color: #1f2937; font-size: 20px;">Assessment Results</h2>
            <table style="width: 100%; border-collapse: collapse;">
                <tr>
                    <td style="padding: 8px 0; font-weight: 600; color: #6b7280; width: 140px;">Archetype:</td>
                    <td style="padding: 8px 0; color: #1f2937;">
                        <span style="display: inline-block; padding: 4px 12px; border-radius: 20px; font-weight: 600; font-size: 14px; background: ${colors.bg}; color: ${colors.text};">
                            ${archetype.title}
                        </span>
                    </td>
                </tr>
                <tr>
                    <td style="padding: 8px 0; font-weight: 600; color: #6b7280;">Fragility Score:</td>
                    <td style="padding: 8px 0; color: #1f2937; font-size: 24px; font-weight: 700;">${scorePercentage}% (${score}/75)</td>
                </tr>
            </table>
        </div>

        ${answersHtml}

        <div style="text-align: center; padding-top: 20px; border-top: 1px solid #e5e7eb;">
            <p style="margin: 0 0 16px 0; color: #6b7280; font-size: 14px;">This lead completed the Sovereign Retirement Reality Check™ assessment.</p>
            <a href="https://d1q5pec0g09arc.cloudfront.net" style="display: inline-block; background: #3b82f6; color: white; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: 600;">View Live App</a>
        </div>
    </div>
</body>
</html>`;
}

function generateAdminEmailText(data, archetype, scorePercentage) {
    const { name, email, phone, score, sessionId, createdAt, answers } = data;
    
    let answersText = '';
    if (answers && Object.keys(answers).length > 0) {
        answersText = '\n\nAll Answers:\n' + '='.repeat(50) + '\n';
        QUESTIONS.forEach((q) => {
            const userScore = answers[q.id];
            if (userScore !== undefined) {
                const label = getOptionLabel(q.id, userScore);
                answersText += `\n${q.id}. [${q.category}] ${q.text}\n   Answer: ${label} (${userScore}/5)\n`;
            }
        });
    }
    
    return `
New RRI Assessment Complete

Lead Details:
- Name: ${name}
- Email: ${email}
- Phone: ${phone || 'Not provided'}
- Session ID: ${sessionId}
- Submitted: ${new Date(createdAt).toLocaleString()}

Assessment Results:
- Archetype: ${archetype.title}
- Fragility Score: ${scorePercentage}% (${score}/75)${answersText}

View Live App: https://d1q5pec0g09arc.cloudfront.net
`;
}