AI RFP Management System

A full-stack application that automates the creation, management, and evaluation of RFPs (Request for Proposals) using AI.
The system allows users to create RFPs from text, send them to vendors, receive proposals, extract structured data from proposals, compare them using scoring logic, and generate an AI-based recommendation.

This README includes all required details as per the assignment document.

1. Features Overview (Phases Covered)


Phase 1: Project Setup
Backend with Express, MongoDB, Mongoose.
Frontend with React + Vite.
Email and AI utilities configured.

Phase 2: Create RFP Manually
Route to create RFP, stored in MongoDB.


Phase 3: Create RFP From Text (AI Extraction)
User enters raw RFP text.
AI extracts title, description, budget, requirements.
Structured RFP is saved to DB.


Phase 4: Vendor Management
Create vendor
List vendors
Store vendor name and email


Phase 5: Send RFP to Vendors
Send email containing RFP details.
Supports multiple vendors.
Stores vendorId + sentAt inside RFP.


Phase 6: Receive Vendor Proposals
Manual endpoint to paste proposal email content.
Store subject, email sender, raw email text.


Phase 7: Parse Proposal Using AI
AI extracts price, deliveryDays, warranty.
Saved to parsedFields in Proposal.


Phase 8: Compare Proposals
Score proposals based on structured fields.
The backend returns a sorted and scored list.


Phase 9: AI Recommendation
AI analyzes proposals and provides one final recommendation.


Phase 10: Frontend UI
Dashboard
RFP details page
Vendor selection
Send RFP
Add Proposal
Compare proposals
View recommendation
Simple and easy-to-understand UI


Phase 11: Attachments (Design Only)
Proposal model includes attachments[].
Parsing not implemented but supported in schema.


Phase 12: Logging and UX polish
Backend routes log essential operations.
Frontend includes loading states and inline error messages.


Phase 13: Seed Script
npm run seed populates demo vendors, an RFP, and proposals.



2. Tech Stack

Backend: Node.js, Express
Frontend: React, Vite
Database: MongoDB + Mongoose
AI: OpenAI API
Email: Nodemailer (Gmail SMTP)



3. Installation


Backend Setup

Navigate to backend folder: cd backend
Install dependencies: npm install
Start the backend: npm run dev

Create .env file in backend root:

MONGODB_URI=your-mongo-url
PORT=3004

OPENAI_API_KEY=your-key
OPENAI_MODEL=gpt-3.5-turbo

SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email
SMTP_PASS=your-app-password
EMAIL_FROM="RFP Bot <your-email>"


Frontend Setup

Navigate to frontend folder: cd frontend
Install dependencies: npm install
Start the frontend: Start the frontend:

Create .env file:
REACT_APP_BACKEND_BASE_URL=http://localhost:3004


4. Seed Data (Demo Setup)

Run the following inside the backend folder: npm run seed


This script will:

* Clear old collections
* Insert 3 vendors
* Insert 1 sample RFP
* Insert 2 sample proposals

After running seeds, the frontend dashboard will show data instantly.



5. Folder Structure
    backend/
  src/
    models/
    controllers/
    routes/
    utils/
    server.js
  seed.js

frontend/
  src/
    pages/
    api/
    App.js
    index.js



6. API Endpoints
   RFP:

    POST /rfps
    POST /rfps/from-text
    GET /rfps
    GET /rfps/:id
    PUT /rfps/:id
    DELETE /rfps/:id
    POST /rfps/:id/send
    GET /rfps/:id/compare

    Vendors:

    POST /vendors
    GET /vendors

    Proposals:
    POST /proposals/manual
    GET /proposals/rfp/:id


7. Scoring Logic (Proposal Comparison)

Proposals are scored based on:

* Price (lower is better)
* Delivery time (faster is better)
* Warranty (longer is better)

Weighted score is calculated and used to rank proposals.


8. AI Usage
AI Extracts

* RFP details from text
* Proposal fields (price, delivery days, warranty)
* Final recommendation based on all proposals

9. Limitations (As per assignment)

* No real email inbox integration.
* Attachments stored only as placeholders.
* AI extraction depends on text quality.

10. How to Run the Full System

 1. Start backend
 2. Start frontend
 3. Seed data (optional but recommended)
 4. Open the browser
 5. Interact with dashboard, RFPs, vendors, proposals, comparison, and recommendation


11. Submission Notes

This project implements all required phases from the assignment document, including AI extraction, proposal comparison, vendor management, RFP workflow, email sending, and frontend interface.

The system is kept intentionally simple, clean, and easy to understand, without unnecessary complexity.