# ENERGIZE — EBD Digitalization Platform
## Product Requirements Document

### 1. Overview
ENERGIZE is a Single Source of Truth (SSOT) platform for PT Bukit Asam's Energy Business Development (EBD) division. It centralizes energy project data into a virtual hub with standardized forms, document management, and dashboards.

### 2. Problem Statement
Project information is currently scattered across multiple documents, spreadsheets, and presentations. There is no centralized system to manage, track, and report on energy project data across the EBD portfolio.

### 3. Solution
A web-based platform with three core modules:
1. **Dashboard** — View-only project portfolio overview with status and key metrics
2. **Documents** — Centralized document repository with categorized access and download
3. **Input Data** — Standardized forms for entering and managing project data

### 4. Users
- EBD Division staff (data entry via Input Data)
- Management (view-only via Dashboard and Documents)
- Stakeholders (view-only access to reports and documents)

### 5. Features

#### 5.1 Dashboard
- Project cards grid with: project image, name, status badge, location, capacity
- Status types: On Progress, Planning, Completed, On Hold
- Click "Read More" navigates to project detail page
- Project detail shows: full overview, financial summary, timeline, risks, advantages

#### 5.2 Documents
Six document categories accessible via sub-tabs:
- Risk Money
- Pitch Deck
- Business Pitch Deck
- RMM (Risk Mitigation & Monitoring)
- BOL (Board of Letter)
- External Data

Each document shows: title, description, project name, file type, file size, last updated date, download button.

#### 5.3 Input Data
Project selector dropdown at top. Eight form tabs:

1. **Project Overview** — Project Name, Description, Capacity, Location, Project Image, Key Advantage, PLN Connection, Competitive Advantage, Background
2. **Indicative Timeline** — Editable table: Kegiatan, 12-month Gantt, Start Date, Stage & Activity, Stage, Estimate Period
3. **Indicative Financial** — Financial Note, NPV, IRR, Payback Period, WACC, CAPEX, Tariff, Main Criteria Indication
4. **Risk Management** — Editable table: Risk Score, Type, Risk Area, Control Status, Level Score, Impact Score, Risk Status, Risk Treatment
5. **Legal Aspect** — Two-column layout: Legal Aspect, Notariat, Material, Lingkungan, Keamanan, Perizinan | Labor, Keselamatan, Regulasi, Asuransi
6. **Action Plan** — Editable table: Kegiatan, Issues, Sample, Action Plan, Target Waktu
7. **Progress Monitoring** — Progress Report (rich text), Report (rich text)
8. **External Data** — Two sub-tabs:
   - Technical Study: Project Certification, Technical Report, Demand Analysis, Terminal Spin
   - Submission: PTBA Description, PTBA Goals, EBD Initiatives, Strategic

### 6. Technical Stack
- **Framework**: Next.js 14+ with App Router, TypeScript
- **Styling**: Tailwind CSS with PTBA brand tokens
- **Charts**: Recharts
- **Icons**: Lucide React
- **Font**: Plus Jakarta Sans

### 7. Brand Identity
- Primary Navy: #1B3A5C
- Primary Red: #C8102E
- Accent Gold: #F2A900
- Steel Blue: #2E75B6
- ENERGIZE wordmark with Zap icon
- PTBA logo in sidebar footer

### 8. Data Flow
```
Input Data (Forms) → Process (Categorize & Consolidate) → Output (Dashboard + Documents)
```

### 9. Non-Functional Requirements
- Responsive design (desktop-first, minimum 1024px)
- Type-safe with TypeScript strict mode
- Accessible form labels and keyboard navigation
- Smooth page transitions and animations

### 10. Future Considerations
- Backend API integration (replace mock data)
- User authentication and role-based access
- File upload for project images and documents
- Rich text editor for narrative fields
- Export to PDF/Excel functionality
- Real-time collaboration
