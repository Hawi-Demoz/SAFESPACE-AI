# SafeSpace AI – Digital Violence Early-Warning & Survivor Support System

> UNiTE to End Digital Violence Against All Women & Girls

## 🎯 Overview

SafeSpace AI is a comprehensive hackathon project that provides real-time protection against online harassment, secure evidence collection, and instant access to survivor support resources. Built with a privacy-first approach, it combines AI-powered toxicity detection with encrypted storage to empower women and girls in the digital space.

## 🚀 Key Features

### 1. **Real-Time Harm Detection**
- Lightweight toxicity classifier running locally
- Detects harassment, threats, sexual coercion, hate speech, and manipulation
- Provides confidence scores and categorizes harmful content
- Live demo on homepage for testing

### 2. **Encrypted Evidence Locker**
- AES-256 client-side encryption before storage
- Secure storage of text logs and screenshots
- Zero-knowledge architecture - we cannot access your data
- Easy evidence retrieval with encryption key management

### 3. **ML Insights Dashboard**
- Weekly exposure tracking with visual charts
- Harm category breakdown
- Safety score calculation
- Real-time analytics updates

### 4. **Support Hub**
- Digital safety educational resources
- Regional support directory (NGOs, shelters, legal aid)
- Emergency hotline access
- Psychological support connections

### 5. **Browser Extension**
- Chrome/Firefox compatible (Manifest V3)
- Content script for real-time page scanning
- Quick action popup for reporting and evidence capture
- Minimal permissions, privacy-focused

## 🛠️ Tech Stack

### Frontend
- **React 19** with TypeScript
- **Tailwind CSS v4** for styling
- **Wouter** for routing
- **TanStack Query** for data fetching
- **Framer Motion** for animations
- **Recharts** for data visualization
- **Shadcn/UI** component library

### Backend
- **Express.js** server
- **PostgreSQL** database (Neon-backed)
- **Drizzle ORM** for type-safe queries
- **Zod** for validation
- Custom ML toxicity detector

### Extension
- **Manifest V3** compliant
- Vanilla JavaScript for content scripts
- Browser-native APIs

## 📦 Installation & Setup

### Prerequisites
- Node.js 20+
- PostgreSQL database

### Quick Start

1. **Install dependencies:**
```bash
npm install
```

2. **Set up database:**
```bash
npm run db:push
```

3. **Seed initial data:**
```bash
tsx server/seed.ts
```

4. **Run development server:**
```bash
npm run dev
```

The app will be available at `http://localhost:5000`

### Browser Extension Setup

1. Navigate to `client/public/extension/`
2. Open Chrome/Firefox extensions page
3. Enable "Developer mode"
4. Click "Load unpacked" and select the `extension` folder
5. The SafeSpace AI extension is now active

## 🧪 Testing the ML Model

### Try These Examples:

**Toxic Content:**
- "You're so stupid, nobody likes you"
- "I'm going to hurt you if you don't do what I say"
- "Send me pics or I'll tell everyone your secrets"

**Safe Content:**
- "Hey, how was your day? Hope you're doing well!"
- "Thanks for your help, I really appreciate it"

Visit the homepage and use the "Test the AI Protection" section to try the toxicity detector live.

## 📂 Project Structure

```
├── client/
│   ├── src/
│   │   ├── components/     # React components
│   │   ├── pages/          # Page components
│   │   ├── lib/            # Utilities and API client
│   │   └── App.tsx         # Main app component
│   └── public/
│       └── extension/      # Browser extension files
├── server/
│   ├── ml/                 # Toxicity detection model
│   ├── routes.ts           # API endpoints
│   ├── storage.ts          # Database interface
│   └── db.ts               # Database connection
├── shared/
│   └── schema.ts           # Drizzle schema definitions
└── README.md
```

## 🔐 Security & Privacy

- **Client-Side Encryption:** All evidence is encrypted in the browser before transmission
- **Zero-Knowledge Architecture:** Server never sees unencrypted data
- **Local ML Processing:** Toxicity detection runs locally when possible
- **No Data Collection:** We don't track or store user behavior
- **Secure Storage:** PostgreSQL with encrypted connections

## 🌐 API Endpoints

### Analysis
- `POST /api/analyze` - Analyze text for toxicity
  ```json
  { "text": "message to analyze" }
  ```

### Evidence
- `POST /api/evidence` - Save encrypted evidence
- `GET /api/evidence` - Retrieve all evidence

### Analytics
- `GET /api/analytics/weekly` - Get 7-day analytics data

### Resources
- `GET /api/resources` - Get all support resources
- `GET /api/resources?category=emergency` - Filter by category

## 📊 ML Model Details

The toxicity detector uses a hybrid approach:
- **Pattern Matching:** Keyword-based detection for common harmful phrases
- **Context Analysis:** Amplifier/mitigator detection
- **Confidence Scoring:** Multi-factor scoring system
- **Categories:** Harassment, Threats, Sexual Coercion, Hate, Identity Attacks, Manipulation

### Future Enhancements:
- Integration with HuggingFace `unitary/toxic-bert`
- DistilBERT fine-tuned models
- Multilingual support

## 🎨 Design Philosophy

**Calm & Empowering Aesthetic:**
- Dark mode default for reduced eye strain
- Soft purple/lilac gradients for trust and safety
- Glassmorphism for modern, approachable UI
- Big typography for accessibility
- Mobile-first responsive design

## 🏆 Hackathon Scoring Alignment

### Innovation (25%)
- ✅ Real-time ML detection running locally
- ✅ Browser extension with content scanning
- ✅ Encrypted evidence locker with zero-knowledge architecture

### Security (15%)
- ✅ Client-side AES encryption
- ✅ Privacy-first design
- ✅ Secure API endpoints with validation

### Performance (20%)
- ✅ Lightweight detection model
- ✅ Optimized React with code splitting
- ✅ Fast Express backend

### Development Process (25%)
- ✅ Clean, documented codebase
- ✅ Full-stack architecture
- ✅ Type-safe with TypeScript

### Testing (15%)
- ✅ Live demo for interactive testing
- ✅ API validation with Zod
- ✅ Error handling throughout

## 🤝 Contributing

This project was built for the "UNiTE to End Digital Violence" hackathon. Contributions, suggestions, and feedback are welcome!

## 📝 License

MIT License - Built with care for survivor safety and empowerment.

## 🆘 Emergency Resources

If you are in immediate danger, please contact local authorities:
- **UNHCR toll-free help line:** 1517
- **Healthcare Assistance Kenya (HAK):** 1195
- **Coalition on Violence Against Women (COVAW)** 0800 720 553
- **Kenya police emergency hotline:** 999/112
- **Center for Victims of Torture (CVT):** 0790781359

For digital violence support:
- [National Domestic Violence Hotline](https://www.thehotline.org/)
- [Cyber Civil Rights Initiative](https://www.cybercivilrights.org/)

---

Built with ❤️ to end digital violence against women and girls.
