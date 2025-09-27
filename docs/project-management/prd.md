# AI Scrum Master Product Requirements Document (PRD)

## Document Information
- **Version:** 1.0
- **Date:** September 27, 2025  
- **Author:** Mahad Saffi (Project Lead/Author)
- **Target Audience:** Frontend Developers (Primary), QA Engineers (Test cases), All team members (Requirements)
- **Phase Relevance:** Phase 1 (UI requirements), Phase 2 (User stories), Phase 4 (Training)
- **Reading Time:** 15 minutes

## Goals and Background Context

**Goals**

*   To validate the feasibility of an AI-driven project manager and prove its value in increasing team efficiency.
*   To deliver a functional MVP within a 3-month timeline that reduces manual project management tasks and context-switching for the development team.
*   To achieve 100% adoption from the internal team, who will use the tool as their primary task manager.
*   To create a foundational application that can be expanded upon with more advanced AI and integration features in the future.

**Background Context**

Software development teams are consistently burdened by the high operational overhead of project management. This leads to inefficiencies, missed deadlines, and reduced developer morale. Existing tools are passive record-keepers that require significant manual effort to maintain.

The AI Scrum Master project aims to solve this by creating an active, intelligent agent that automates the core loop of project execution. By parsing a project plan, assigning tasks according to a timeline, and proactively notifying team members of delays, the MVP will serve as a central, interactive hub for the team. This will reduce the administrative load on the Project Lead and allow the development team to focus on what they do best: building and testing software.

**Change Log**

| Date | Version | Description | Author |
| :--- | :--- | :--- | :--- |
| 2025-09-23 | 1.0 | Initial draft of PRD based on Project Brief. | John (PM) |

### Requirements

#### Functional

1.  **FR1: User Authentication:** Users must be able to log in to the web application using their GitHub account via OAuth.
2.  **FR2: Project Plan Ingestion:** The system must be able to parse a `YAML` file containing the project plan (tasks, roles, start/end dates) provided by the Project Lead.
3.  **FR3: Task Board Display:** The web application must display all tasks from the project plan on a central Task Board, showing at a minimum the task description, assigned user, and status (To Do, In Progress, Done).
4.  **FR4: Task Completion:** Users must be able to change the status of an assigned task to "Done" via a single action (e.g., clicking a "Mark as Complete" button) on the Task Board.
5.  **FR5: Timeline-Aware Task Assignment:** Upon a task's completion, the system must automatically assign the next task to the appropriate user based on their role and the task's scheduled `start_date` in the project plan.
6.  **FR6: Automated Delay Notification:** The system must perform a daily check and automatically send a notification to a user if their assigned task is past its `end_date` but is not yet "Done".
7.  **FR7: Issue Reporting (Triage):** Users must be able to submit an issue or blocker description via a text input in the application. The system will log this and notify the Project Lead for manual review and triage.
8.  **FR8: Real-time Chat:** The application must provide a real-time chat interface allowing for Direct Messages between users and a single Group channel for the entire team.

#### Non-Functional

1.  **NFR1: Local Deployment:** The entire application (frontend, backend, database) must be runnable on `localhost` without requiring external cloud services.
2.  **NFR2: Performance:** The main Task Board interface must load in under 2 seconds, and API responses should be under 500ms.
3.  **NFR3: Concurrency:** The system must support at least 4 concurrent users interacting with the application without database locking errors or significant performance degradation.

### User Interface Design Goals

#### Overall UX Vision

The user experience should be clean, efficient, and professional. It should feel like a command center for the development team, prioritizing clarity and focus. The interface should present information clearly, minimize clicks, and make the core loop (viewing tasks, completing tasks, reporting issues) as frictionless as possible. The AI's presence should feel helpful and intelligent, providing timely information without being intrusive.

#### Key Interaction Paradigms

*   **Main Task Board:** A central, dynamic view (likely a Kanban-style board or a structured list) that serves as the single source of truth for all project tasks.
*   **Persistent Chat Panel:** An integrated chat area, always accessible, allowing for easy switching between group conversation and direct messages.
*   **Simple Issue Reporting:** A straightforward modal or form for users to report blockers without navigating away from their current context.
*   **Non-intrusive Notifications:** A subtle system for alerting users to new task assignments or delays, perhaps via highlights in the UI or a dedicated notification area.

#### Core Screens and Views

*   **Login Screen:** A simple page with a single "Login with GitHub" button.
*   **Main Dashboard:** The primary view containing the Task Board and the integrated Chat Panel.
*   **User Profile/Settings (Minimal):** A basic area for logout and viewing user information.

#### Accessibility: WCAG AA

To ensure the product is usable by everyone, we will target WCAG 2.1 AA as our accessibility standard.

#### Branding

No specific branding guidelines have been provided. The initial design should aim for a clean, modern, and professional aesthetic. A dark mode theme is recommended to reduce eye strain, common for developer-focused tools.

#### Target Device and Platforms: Web Responsive

The application will be a responsive web app, ensuring it is functional and usable across a range of screen sizes, from desktop monitors to tablets.

### Technical Assumptions

These are the guiding technical principles and decisions that will constrain the project's architecture.

#### Repository Structure: Monorepo

The project will use a **monorepo**, containing both the frontend and backend code in a single repository to simplify development and management.

#### Service Architecture: Monolith

The backend will be a **monolithic service**. This approach was chosen to maximize development speed and reduce operational complexity for the MVP.

#### Testing Requirements: Unit + Integration Testing

To ensure quality without overburdening the MVP timeline, the project will require both **unit tests** for individual components and **integration tests** to verify that the frontend, backend, and AI core work together correctly. This is a balanced approach that leverages our dedicated QA resource.

#### Additional Technical Assumptions and Requests

*   **Frontend:** The frontend will be built using **React**.
*   **Backend:** The backend API will be built using Python with the **FastAPI** framework.
*   **Database:** The project will use a **PostgreSQL** database.
*   **Hosting:** The MVP will be developed for and deployed only on **`localhost`**.
*   **Authentication:** User authentication will be handled via **OAuth with GitHub**.

### Epic List

*   **Epic 1: Foundational Infrastructure & "Hello World" Task**
    *   **Goal:** Establish the project's technical foundation, including the monorepo, basic app setup, and a complete, working user authentication system using GitHub OAuth.
*   **Epic 2: Dynamic Task Board from Project Plan**
    *   **Goal:** Enable the system to parse the project `YAML` file and display the full task board in the UI for logged-in users.
*   **Epic 3: Interactive Workflow & Notifications**
    *   **Goal:** Implement the core interactive loop, including task completion, timeline-aware re-assignment of the next task, and automated notifications for delayed tasks.
*   **Epic 4: Team Collaboration & Communication**
    *   **Goal:** Integrate the real-time chat system (DMs and group) and the "Admin Triage" issue reporting workflow.

### Epic 1: Foundation & User Authentication

**Goal:** This epic's primary goal is to establish a fully functional, end-to-end "slice" of the application. It will create the project structure and implement user authentication. By the end of this epic, we will have proven that the frontend can display data from the backend and send updates back, successfully de-risking the core technical architecture.

---

#### Story 1.1: Project Initialization
*As a Project Lead, I want the complete monorepo structure with basic "hello world" applications for the frontend and backend, so that the team has a clean, standardized foundation to start building from.*

**Acceptance Criteria:**
1.  A monorepo is created in GitHub containing `/frontend` and `/backend` directories.
2.  A basic React application is scaffolded in `/frontend`.
3.  A basic FastAPI application is scaffolded in `/backend`.
4.  A `docker-compose.yml` file is created at the root to run the frontend, backend, and a PostgreSQL database service.
5.  All services can be started successfully via `docker-compose up` and are accessible on `localhost`.

---

#### Story 1.2: User Authentication
*As a user, I want to log in to the application using my GitHub account, so that the system knows who I am and can show me relevant information.*

**Acceptance Criteria:**
1.  The application's landing page presents a "Login with GitHub" button.
2.  Clicking the button correctly initiates the GitHub OAuth authentication flow.
3.  After a successful authentication with GitHub, the user is redirected to the main application dashboard.
4.  A new user record, including the user's GitHub username and ID, is created in the PostgreSQL database.
5.  The user's session is managed so they remain logged in on subsequent visits.

---

#### Story 1.3: "Hello World" Task API Endpoint
*As a Frontend Developer, I want a backend API endpoint that returns a single, hard-coded task, so that I have data to display in the UI.*

**Acceptance Criteria:**
1.  A GET endpoint (e.g., `/api/tasks/sample`) is created in the backend.
2.  The endpoint is protected and can only be accessed by an authenticated user.
3.  When called, the endpoint returns a JSON object for a single, hard-coded sample task (including an ID, title, description, and status).

---

#### Story 1.4: Display "Hello World" Task
*As a user, I want to see my assigned task on the main dashboard, so that I know what I need to work on.*

**Acceptance Criteria:**
1.  After a user logs in, the main dashboard component calls the `/api/tasks/sample` endpoint.
2.  The task received from the API is clearly displayed on the page.
3.  The task display includes a "Mark as Complete" button.

---

#### Story 1.5: "Mark as Complete" Action
*As a user, I want to be able to mark my task as complete, so that the system knows I have finished my work.*

**Acceptance Criteria:**
1.  Clicking the "Mark as Complete" button sends a request to a backend endpoint (e.g., `POST /api/tasks/{task_id}/complete`).
2.  The backend receives the request and logs the completion event to the console (no database update needed for this story).
3.  The frontend UI updates to visually indicate the task is complete (e.g., the task is greyed out or a checkmark appears).

### Epic 2: Dynamic Task Board from Project Plan

**Goal:** The goal of this epic is to bring the project plan to life. It will replace the hard-coded sample task from Epic 1 with a dynamic system that ingests a full project plan from a `YAML` file, stores it in the database, and displays the correct tasks for each user on a real task board.

---

#### Story 2.1: Define Project Plan YAML Schema
*As a Project Lead, I want a clearly defined and documented schema for the `project.yaml` file, so that I can create project plans in a consistent and valid format.*

**Acceptance Criteria:**
1.  A markdown document (`YAML_SCHEMA.md`) is created that defines the structure of the `project.yaml` file.
2.  The schema specifies the structure for `team_members` (with roles), and `tasks` (each with an ID, title, description, assigned role, start date, and end date).
3.  An example `project.yaml` file that validates against the new schema is created and committed to the repository.

---

#### Story 2.2: Implement Plan Ingestion
*As a Project Lead, I want the system to parse the `project.yaml` file and populate the database, so that the project plan is loaded into the application.*

**Acceptance Criteria:**
1.  An admin-only API endpoint is created to trigger the ingestion of the `project.yaml` file.
2.  When triggered, the system correctly parses the file and populates the `tasks` table in the database with all tasks from the plan.
3.  The ingestion process is idempotent (running it multiple times with the same file does not create duplicate tasks).
4.  Appropriate error handling is in place for a malformed `YAML` file.

---

#### Story 2.3: Create Dynamic Task Board API
*As a Frontend Developer, I want a backend API endpoint that returns all tasks relevant to the currently authenticated user, so that I can build a dynamic task board.*

**Acceptance Criteria:**
1.  A GET endpoint (e.g., `/api/tasks`) is created that replaces the old sample endpoint.
2.  The endpoint queries the database and returns a JSON list of all tasks assigned to the role of the currently logged-in user.
3.  The endpoint is protected and requires user authentication.

---

#### Story 2.4: Build Dynamic Task Board UI
*As a user, I want to see all of my assigned tasks on a single board, so that I have a clear overview of my work.*

**Acceptance Criteria:**
1.  The main dashboard UI is updated to call the new `/api/tasks` endpoint.
2.  The UI dynamically renders a "card" for each task returned by the API.
3.  The task cards are organized into columns based on their status (e.g., "To Do", "In Progress", "Done").
4.  Each task card displays at least the task title and has a "Mark as Complete" button.

### Epic 3: Automated Workflow Engine

**Goal:** This epic will implement the core intelligence of the AI Scrum Master. It will transform the application from a passive task board into an active workflow engine that automates task progression and proactively identifies delays, delivering on the central promise of the product.

---

#### Story 3.1: Persist Task Status
*As a user, I want the system to save the updated status when I mark a task as complete, so that my progress is permanently recorded.*

**Acceptance Criteria:**
1.  The `POST /api/tasks/{task_id}/complete` endpoint is updated to modify the database.
2.  When called, the endpoint changes the status of the specified task in the `tasks` table to "Done".
3.  The Task Board UI accurately reflects the updated status from the backend after the action is performed.

---

#### Story 3.2: Implement Automated Task Assignment
*As a user, I want the system to automatically assign me a new task when I complete my current one, so that I don't have to wait for instructions.*

**Acceptance Criteria:**
1.  When a task's status is successfully changed to "Done", a backend process is triggered to find the next task for that user.
2.  The logic identifies the next available task for the user's role based on the earliest `start_date` from the project plan.
3.  The status of this new task is updated to "In Progress" in the database.
4.  The user who completed the previous task is notified of their new assignment.

---

#### Story 3.3: Implement Delay Detection
*As a Project Lead, I want the system to automatically detect when tasks are running late, so that I can be aware of project risks without manually checking dates.*

**Acceptance Criteria:**
1.  A scheduled process is created that runs automatically once per day.
2.  The process scans all tasks that are not in "Done" status.
3.  If a task's `end_date` is in the past, a "Delayed" flag is set on that task in the database.
4.  A notification is generated for the user assigned to the delayed task.

---

#### Story 3.4: Backend Notification Service
*As a developer, I want a centralized backend service for creating and retrieving notifications, so that different parts of the system can alert users consistently.*

**Acceptance Criteria:**
1.  A `notifications` table is created in the database.
2.  An internal service is created that allows other backend processes (like assignment and delay detection) to create a notification record for a specific user.
3.  A protected API endpoint (e.g., `GET /api/notifications`) is created for a user to fetch their own unread notifications.

---

#### Story 3.5: Display Notifications in UI
*As a user, I want to be notified within the app about important events like new assignments or delays, so that I am always up to date.*

**Acceptance Criteria:**
1.  The main UI includes a notification indicator (e.g., a bell icon with a count).
2.  The application frontend periodically fetches data from the `/api/notifications` endpoint.
3.  New notifications are displayed to the user in a clear, accessible list.
4.  A mechanism exists for the user to mark notifications as "read".

### Epic 4: Team Collaboration & Communication

**Goal:** This epic focuses on making the application a true collaborative hub. It will introduce a real-time chat for seamless team communication and implement the workflow for users to report blockers directly to the system, ensuring the Project Lead is always aware of emerging issues.

---

#### Story 4.1: Backend Chat Service
*As a user, I want a real-time connection to the server, so that I can send and receive chat messages instantly.*

**Acceptance Criteria:**
1.  A WebSocket endpoint is implemented in the FastAPI backend to manage persistent client connections.
2.  The service can handle receiving a message from one client and broadcasting it to other clients.
3.  The backend logic supports routing messages to a specific user (for DMs) or to all users (for a group channel).
4.  Received chat messages are persisted to the database.

---

#### Story 4.2: Frontend Chat Interface
*As a user, I want a chat interface within the application, so that I can communicate with my team without switching to another app.*

**Acceptance Criteria:**
1.  A chat panel is integrated into the main application UI.
2.  The UI allows users to select a specific team member to Direct Message or select a general "Team" channel.
3.  Users can type and send messages through the WebSocket connection.
4.  Incoming messages are displayed in real-time in the correct conversation window.
5.  Chat history for the selected conversation is loaded from the backend.

---

#### Story 4.3: Issue Reporting Form
*As a user, I want a simple form to report a blocker or an issue I've found, so that I can quickly inform the Project Lead of problems.*

**Acceptance Criteria:**
1.  A "Report Issue" button is clearly visible in the main UI.
2.  Clicking the button opens a modal window containing a text area for the issue description.
3.  The form has a "Submit" button to send the report.

---

#### Story 4.4: Issue Triage Endpoint
*As a developer, I want a backend endpoint to submit reported issues, so that they can be logged for admin review.*

**Acceptance Criteria:**
1.  A `POST /api/issues/report` endpoint is created.
2.  The endpoint accepts an issue description from the authenticated user.
3.  A new record is created in a `triage_items` table in the database, storing the issue description, the reporter's ID, and a status of "Pending Review".
4.  Upon successful submission, a notification is generated for the Project Lead.
