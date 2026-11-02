export const courses = [
  {
    slug: "forex-trading-mastery",
    title: "Forex Trading Mastery",
    fee: 29999,
    original: 49999,
    duration: "6 Weeks",
    level: "Beginner to Advanced",
    badge: "POPULAR",

    image:
      "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?auto=format&fit=crop&w=1200&q=85",
    imageAlt: "Forex currency trading charts",

    description:
      "Learn Forex trading, currency pairs, technical analysis, price action and professional risk management.",

    outcomes: [
      "Understand the Forex market",
      "Learn currency pairs and pips",
      "Master technical analysis",
      "Understand support and resistance",
      "Develop risk management skills",
      "Learn trading psychology",
    ],

    syllabus: [
      "Introduction to Forex",
      "Currency Pairs",
      "MT4 / MT5",
      "Technical Analysis",
      "Support & Resistance",
      "Price Action",
      "Risk Management",
      "Trading Psychology",
      "Live Trading Sessions",
    ],
  },

  {
    slug: "crypto-trading-course",
    title: "Crypto Trading Course",
    fee: 19999,
    original: 0,
    duration: "4 Weeks",
    level: "Beginner",

    image:
      "https://images.unsplash.com/photo-1621761191319-c6fb62004040?auto=format&fit=crop&w=1200&q=85",
    imageAlt: "Cryptocurrency and Bitcoin trading",

    description:
      "Explore cryptocurrency markets, Bitcoin, blockchain technology, spot trading and futures trading.",

    outcomes: [
      "Understand blockchain fundamentals",
      "Learn cryptocurrency exchanges",
      "Understand spot trading",
      "Learn futures trading",
      "Understand leverage and risk",
      "Develop crypto trading strategies",
    ],

    syllabus: [
      "Blockchain Fundamentals",
      "Binance Platform",
      "Spot Trading",
      "Futures Trading",
      "Leverage & Risk",
      "Memecoins",
      "On-chain Analysis",
      "Crypto Risk Management",
    ],
  },

  {
    slug: "xauusd-gold-king",
    title: "XAUUSD / Gold King",
    fee: 34999,
    original: 0,
    duration: "5 Weeks",
    level: "Intermediate",
    badge: "MOST POPULAR",

    image:
      "https://images.unsplash.com/photo-1610375461246-83df859d849d?auto=format&fit=crop&w=1200&q=85",
    imageAlt: "Gold bars and gold market",

    description:
      "Learn gold market analysis, XAUUSD price action, trading sessions, news analysis and risk management.",

    outcomes: [
      "Understand the gold market",
      "Analyze XAUUSD price movements",
      "Learn London and New York sessions",
      "Understand gold scalping",
      "Learn news trading",
      "Apply gold risk management",
    ],

    syllabus: [
      "Gold Market Fundamentals",
      "XAUUSD Psychology",
      "London Session",
      "New York Session",
      "Gold Scalping",
      "News Trading",
      "Advanced Price Action",
      "Gold Risk Management",
    ],
  },

  {
    slug: "vip-lifetime-mentorship",
    title: "VIP Lifetime Mentorship",
    fee: 59999,
    original: 0,
    duration: "Lifetime Access",
    level: "All levels",
    badge: "VIP PREMIUM",

    image:
      "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1200&q=85",
    imageAlt: "Premium financial trading analytics dashboard",

    description:
      "A premium educational membership with lifetime learning access, mentorship and private community benefits.",

    outcomes: [
      "Lifetime access to included courses",
      "VIP educational signals",
      "Private VIP community",
      "One-on-one mentorship",
      "Live educational trading room",
      "Advanced market analysis",
    ],

    syllabus: [
      "All Three Trading Courses",
      "Lifetime Learning Access",
      "VIP Educational Signals",
      "One-on-One Mentorship",
      "Private VIP Group",
      "Live Trading Room",
      "Advanced Strategies",
      "Priority Support",
    ],
  },
];

export const pkr = (n) => "Rs. " + Number(n || 0).toLocaleString("en-PK");
