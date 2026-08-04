# ✦ TechMorph Pvt. Ltd. — Official Company Website

[![TechMorph](https://img.shields.io/badge/TechMorph-Pvt._Ltd.-00F2FE?style=for-the-badge&logo=codefactor&logoColor=black)](https://techmorphpvt.com)
[![Node.js](https://img.shields.io/badge/Node.js-v18%2B-339933?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org)
[![Express](https://img.shields.io/badge/Express.js-5.x-000000?style=for-the-badge&logo=express&logoColor=white)](https://expressjs.com)
[![Vercel](https://img.shields.io/badge/Vercel-Serverless-000000?style=for-the-badge&logo=vercel&logoColor=white)](https://vercel.com)
[![Resend](https://img.shields.io/badge/Resend-Email_API-black?style=for-the-badge&logo=resend&logoColor=white)](https://resend.com)

Welcome to the official repository for **TechMorph Pvt. Ltd.** — a premium digital solutions engineering firm specializing in full-stack web & mobile app development, custom software engineering, and UI/UX design.

This repository powers the official corporate landing page, interactive project estimation engine, client portfolio showcase, and serverless backend API integrations.

---

## 🌟 Key Features

- **Modern Dynamic Design System**: Custom Vanilla CSS design system with glassmorphism, gradient accents, floating ambient cards, and micro-interactions.
- **Dual Theme Engine**: Seamless toggle between Dark Mode and Light Mode with system preference detection and `localStorage` persistence.
- **Interactive Project Estimator**: Real-time project cost calculator allowing clients to select services, scale project scope, and receive instant estimated quotes.
- **Serverless & Express Contact API**: Integrated email processing handler supporting both Node.js Express server environments and Vercel Serverless Functions.
- **Transactional Email Automation (Resend)**:
  - Instant internal notifications for incoming client project inquiries.
  - Automated HTML receipt & confirmation emails dispatched directly to inquiring clients.
- **Enterprise Security & Anti-Spam**:
  - In-memory rate limiting (max 5 submissions per 10-minute window per IP).
  - Invisible honeypot traps (`honeypot`, `b_website`) to silently reject automated bot spam.
  - Strict input sanitization (`escapeHtml`) to prevent injection vulnerabilities.
- **Responsive Navigation & Modals**: Smooth navigation drawer, active scroll progress indicator, splash curtain loader, and interactive project modal dialogs.

---

## 🛠️ Technology Stack

| Category                  | Technology                   | Description                                                              |
| :------------------------ | :--------------------------- | :----------------------------------------------------------------------- |
| **Frontend Framework**    | HTML5 / ES6 JavaScript       | Clean semantic markup & modern vanilla JavaScript logic                  |
| **Styling & Design**      | Vanilla CSS3                 | Custom design system (`css/styles.css`) with CSS custom properties       |
| **Backend Runtime**       | Node.js (ES Modules)         | High-performance JavaScript runtime                                      |
| **Server / Routing**      | Express.js `v5`              | Lightweight server hosting static assets & routing `/api/contact`        |
| **Serverless Deployment** | Vercel Serverless Functions  | Serverless handler located at `/api/contact.js`                          |
| **Email Delivery**        | Resend API                   | Transactional email provider for admin notifications and client receipts |
| **Typography & Icons**    | Google Fonts & FontAwesome 6 | Outfit, Inter, Anton font families and vector iconography                |

---

## 📁 Repository Structure

```text
techmorphpvt/
├── api/
│   └── contact.js         # Contact form handler (Express route & Vercel Serverless Function)
├── css/
│   └── styles.css         # Main stylesheet, variables, dark/light themes, animations
├── js/
│   └── main.js            # Frontend interactivity, project calculator, theme logic & form handling
├── images/                # Visual assets, logos, and portfolio screenshots
│   ├── ecommerce-app.jpg
│   ├── fintech-dash.jpg
│   ├── hero-base.png
│   ├── hero-reveal.png
│   └── travel-app.jpg
├── .env.example           # Environment variables configuration template
├── index.html             # Main corporate website landing page
├── package.json           # Project manifest and npm scripts
├── server.js              # Local Node.js Express development server
└── README.md              # Project documentation
```

---

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v18.0.0 or higher recommended)
- `npm` (v9.0.0 or higher)
- A free [Resend](https://resend.com) account for email notifications

### Installation & Setup

1. **Clone the repository**:

   ```bash
   git clone https://github.com/ChinmayGawad/techmorphpvt.git
   cd techmorphpvt
   ```

2. **Install dependencies**:

   ```bash
   npm install
   ```

3. **Configure Environment Variables**:
   Copy `.env.example` to create your local `.env` file:

   ```bash
   cp .env.example .env
   ```

4. **Update `.env` values**:

   ```env
   # Required: Resend API key from https://resend.com/api-keys
   RESEND_API_KEY=re_xxxxxxxxxxxxxxxxxxxxxxxx

   # Verified sender address in Resend (use onboarding@resend.dev during testing)
   RESEND_FROM_EMAIL=TechMorph Contact <onboarding@resend.dev>

   # Destination inbox for incoming inquiries
   CONTACT_TO_EMAIL=techmorphpvt@gmail.com

   # Server port (default: 3000)
   PORT=3000
   ```

5. **Start the local server**:
   ```bash
   npm start
   ```
   Open your browser and navigate to `http://localhost:3000`.

---

## 📡 API Reference

### Contact Inquiry Endpoint

**Endpoint**: `POST /api/contact`  
**Headers**: `Content-Type: application/json`

#### Request Body

```json
{
  "name": "Jane Doe",
  "email": "jane@example.com",
  "services": ["web", "uiux"],
  "details": "We need a custom full-stack web application with responsive UI/UX.",
  "honeypot": ""
}
```

#### Response Format

- **Success (`200 OK`)**:

  ```json
  {
    "success": true,
    "id": "resend_email_id_12345"
  }
  ```

- **Validation Error (`400 Bad Request`)**:

  ```json
  {
    "error": "Name and email are required"
  }
  ```

- **Rate Limit Exceeded (`429 Too Many Requests`)**:
  ```json
  {
    "error": "Too many requests. Please try again later."
  }
  ```

---

## 🌐 Deployment Guide

### Deploying on Vercel (Recommended)

1. Push your code to your GitHub repository.
2. Import the project into [Vercel](https://vercel.com).
3. Add the following **Environment Variables** in your Vercel project settings:
   - `RESEND_API_KEY`
   - `RESEND_FROM_EMAIL`
   - `CONTACT_TO_EMAIL`
4. Click **Deploy**. Vercel will automatically detect `/api/contact.js` as a serverless function and serve `index.html` as the root document.

### Deploying on Node.js Hosts (Render / Railway / VPS)

1. Set the start script command to `npm start` (runs `node server.js`).
2. Provide environment variables via host dashboard or system env.
3. Ensure port binding matches `process.env.PORT`.

---

## 🤝 Contact & Support

For business inquiries or custom software solutions, get in touch with **TechMorph Pvt. Ltd.**:

- 🌐 **Website**: [techmorphpvt.vercel.app](https://techmorphpvt.vercel.app/)
- 📧 **Email**: [techmorphpvt@gmail.com](mailto:techmorphpvt@gmail.com)

---

&copy; 2026 **TechMorph Pvt. Ltd.** All rights reserved.
