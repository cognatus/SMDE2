# SMDE2

**An open-source school management platform designed to make essential educational and administrative tools more accessible to public schools.**

## Project Overview

SMDE2 is a full-stack educational management application originally developed using Angular 2, TypeScript, Node.js, Express, and MySQL.

The original prototype includes foundational components for academic administration, institutional information, users, subjects, schedules, profiles, messaging, and discussion forums.

I plan to modernize SMDE2 and develop it into an open-source school management platform focused on public schools and educational institutions with limited technology budgets.

The long-term vision is to provide accessible core school management functionality, with optional advanced capabilities and managed services for institutions requiring additional support.

## Target Users

- Public schools seeking affordable administrative software
- Teachers managing classes, schedules, and academic activities
- School administrators coordinating educational operations
- Educational institutions looking for a customizable, self-hosted solution

## Tech Stack

### Current Implementation

- **Frontend:** Angular 2, TypeScript, SystemJS, Bootstrap 3
- **Backend:** Node.js, Express 4
- **Database:** MySQL
- **Architecture:** Web application with REST API modules

The planned modernization will introduce supported dependencies, improved application structure, and a more maintainable development environment.

## Existing Implementation

The repository contains foundational frontend and backend modules for:

- Institutional and user administration
- Academic subjects and schedules
- User profiles
- Messaging
- Discussion forums
- Frontend-to-backend communication

Some modules remain incomplete or reference legacy paths that require restoration.

## Project Structure

- `angular/` — Angular frontend
- `api/` — Original backend modules
- `models/` — Application models
- `routes/` — Express routes
- `app.js` — Backend initialization
- `bin/` — Server entry point

## Local Development

The application currently relies on legacy Angular and Node.js dependencies.

### Backend

1. Clone the repository.
2. Install dependencies using `npm install`.
3. Configure a compatible MySQL instance.
4. Start the backend using `npm start`.

### Frontend

1. Navigate to the `angular/` directory.
2. Install dependencies using `npm install`.
3. Start the frontend using `npm start`.

Compatibility with current runtimes has not yet been verified. Restoring a reproducible development environment is part of the planned work.

## Planned Development Roadmap

### Phase 1 — Application Modernization

- [ ] Upgrade Angular and backend dependencies.
- [ ] Restore incomplete and missing application modules.
- [ ] Refactor database configuration and connection handling.
- [ ] Add database migrations and synthetic seed data.
- [ ] Introduce automated testing and CI workflows.

### Phase 2 — Core School Management

- [ ] Implement student, teacher, and administrator roles.
- [ ] Build class and subject management.
- [ ] Introduce attendance tracking.
- [ ] Implement academic calendars and scheduling.
- [ ] Add assignment management and grading workflows.
- [ ] Develop school-wide announcements and notifications.

### Phase 3 — Open-Source Platform

- [ ] Create a reproducible self-hosted installation process.
- [ ] Introduce multilingual support, beginning with Spanish and English.
- [ ] Improve mobile responsiveness and accessibility.
- [ ] Add configurable academic periods and institution settings.
- [ ] Write administration, installation, and contribution documentation.

### Phase 4 — Advanced Capabilities

- [ ] Implement advanced academic reporting and analytics.
- [ ] Build customizable institutional dashboards.
- [ ] Add automated report generation.
- [ ] Introduce integrations with external educational services.
- [ ] Develop optional managed hosting, backup, and support capabilities.

The core platform will remain open source, while advanced services and additional functionality may be offered separately.

## Current Status and Future Direction

SMDE2 is an independently developed educational management prototype that I plan to modernize and maintain as an open-source software project.

My primary goal is to provide public schools with accessible tools for managing academic and administrative operations without requiring expensive software licenses.

The next development stage will focus on restoring the existing application, modernizing its architecture, and implementing practical features such as student management, academic scheduling, attendance tracking, and role-based access control.

Over time, I intend to expand the platform with advanced reporting, integrations, and optional managed services while continuing to maintain its open-source foundation.

The project represents a substantial long-term development effort involving frontend modernization, backend engineering, feature development, automated testing, and deployment tooling.

Development and demonstrations will use synthetic educational records. Real student or institutional personal data will not be used during this development phase.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.
