export default async function handler(req, res) {
  // Allow requests from your GitHub Pages site
  res.setHeader('Access-Control-Allow-Origin', 'https://damorsumit2000-lab.github.io');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Handle preflight
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { message } = req.body;

    if (!message) {
      return res.status(400).json({ error: 'Message is required' });
    }

    const GROQ_API_KEY = process.env.GROQ_API_KEY; // stored safely in Vercel env vars

    const groqResponse = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${GROQ_API_KEY}`
      },
      body: JSON.stringify({
        model: 'llama-3.3-70b-versatile',
        messages: [
          {
            role: 'system',
            content: `You are an AI assistant on Sumit Damor's portfolio website. Answer questions about Sumit based ONLY on the CV data below. Keep answers SHORT (2-4 sentences), friendly, and professional. If asked something not in the CV, say "I don't have that information in Sumit's profile."

SUMIT'S CV:

CONTACT: Email: sumitrd22@nsb.edu.in | Phone: +91 82001-68197 | Location: Bangalore, India

SUMMARY: Operations professional at Groww with experience in corporate client management, subscription lifecycle handling, and revenue operations. MBA graduate with Economics background and strong data analysis skills.

WORK EXPERIENCE:
- Order Processing & Revenue Operations Associate, Groww Invest-Tech Pvt Ltd (July 2024 - Present, Bangalore)
  * Managed end-to-end corporate client tickets for Groww Cloud subscriptions
  * Supported brokers, companies, and proprietary traders across onboarding and operations
  * Validated corporate onboarding requests, documentation, and account verification
  * Primary support contact resolving execution issues, system errors, connectivity problems within SLA
  * Monitored subscription usage, renewals, cancellations; maintained dashboards
  * Tools: Groww Cloud, Freshdesk, Jira, Google Sheets, Internal OMS

EDUCATION:
- MBA (Marketing) - National School of Business, Bangalore (Aug 2022 - Jul 2024)
- BA Economics - Indira Gandhi National Open School, New Delhi (Aug 2019 - May 2022)

PROJECTS:
1. Website Quality Impact on Payment Modes & Compulsive Buying (Jan-Mar 2024)
2. Digital India Movement - Market Analysis with Tableau (Feb-Mar 2022)
3. MERN News Website using ReactJS, ExpressJS, NodeJS, deployed on Heroku (Nov-Dec 2021)

SKILLS: Excel, PowerPoint, Freshdesk, Email Marketing, Critical Thinking, Data Analysis, Market Research, Project Management, Customer Retention, Sales, Tableau, Jira, Google Sheets

ACHIEVEMENTS: Won AAGMAN Marketing Fest at NSB | Won Recycle Mania product design event | Led Annual College Fest team

CERTIFICATES: Digital Marketing (Curtin University) | CRM for Marketers (Curtin University) | Intro to Project Management

LANGUAGES: English (Professional) | Hindi (Native) | Gujarati (Native)

INTERESTS: Stocks, Investments, Fintech, Marketing`
          },
          {
            role: 'user',
            content: message
          }
        ],
        temperature: 0.7,
        max_tokens: 200
      })
    });

    if (!groqResponse.ok) {
      const err = await groqResponse.json();
      console.error('Groq error:', err);
      return res.status(500).json({ error: 'Groq API error', details: err });
    }

    const data = await groqResponse.json();
    const reply = data.choices[0].message.content.trim();

    return res.status(200).json({ reply });

  } catch (error) {
    console.error('Server error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
