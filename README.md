# SmartRoute

AI-Powered Public Transport Intelligence Platform for **SIH 2026 Problem Statement 26205**.

## Problem
Public transportation systems often struggle with inefficient route planning, lack of real-time tracking, unpredictable ETAs, and suboptimal resource allocation.

## Solution
SmartRoute offers a comprehensive, AI-ready platform to Track, Predict, Recommend, and Optimize public transport operations, ensuring seamless experiences for both passengers and operators.

## Core Concept
Track → Predict → Recommend → Optimize

## Current Technology Stack

### Frontend:
* Next.js
* TypeScript
* Tailwind CSS

### Backend:
* Node.js
* Express
* TypeScript

### Database:
* MongoDB
* Mongoose

### Planned Realtime:
* Socket.IO

### Maps:
* Leaflet
* OpenStreetMap

### Authentication:
* JWT

### Machine Learning:
* Not implemented in the current version.
* ML will be considered as future scope for advanced prediction features.

## Project Structure
```text
SmartRoute/
├── client/ (Next.js Frontend)
└── server/ (Express/Node Backend)
```

## Setup Instructions
1. Clone the repository.
2. Install dependencies for both frontend and backend.
3. Configure environment variables.
4. Start both servers.

## Environment Variables
See `.env.example` in both `client/` and `server/` directories.
Do not commit actual `.env` files.

## Running the Project

### Frontend
```bash
cd client
npm install
npm run dev
```

### Backend
```bash
cd server
npm install
npm run dev
```

## Development Roadmap
- Phase 1: Project Setup (Completed)
- Phase 2: Core Authentication and User Management (Planned)
- Phase 3: Real-time Tracking and Socket.IO Integration (Planned)
- Phase 4: Maps and Geospatial Services (Planned)
- Phase 5: Machine Learning and AI Optimization (Planned)

## Future Scope
- Implementation of advanced predictive algorithms.
- Mobile application integrations.
- Advanced administrative dashboards with real-time analytics.
