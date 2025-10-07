# Atlas Product Requirements Document (PRD)

## 1. Introduction & Vision

### 1.1. Document Information
- **Version:** 3.0
- **Date:** 2025-10-07
- **Author:** Winston (Architect)
- **Status:** Revised Draft

### 1.2. Executive Summary
Atlas is an intelligent agent designed to both **generate and manage** software development projects. It initiates projects through a guided, conversational discovery session with project leaders, discussing scope, budget, and costs. The AI then suggests an optimal team structure before automatically generating a full project plan.

Post-planning, Atlas actively manages the project by assigning tasks, tracking progress, and facilitating communication, allowing the human team to focus on development and execution while the AI handles the cognitive and administrative overhead.

### 1.3. Problem Statement
Software development teams are consistently burdened by the high operational overhead of both project planning and management. This manifests as inefficient team coordination, reactive problem management, and a heavy administrative burden on leads. Existing tools are passive record-keepers, requiring constant manual effort for both planning and tracking.

### 1.4. Proposed Solution
The solution is an **active AI agent** that serves as a partner in the project lifecycle. The workflow is conversational and automated:
1.  **Conversational Discovery:** A Project Lead engages in a guided conversation with the AI, discussing high-level goals, budget, and constraints.
2.  **Team & Role Suggestion:** The AI analyzes available team members, their expertise, and suggests an optimal team composition and roles for the project.
3.  **Automated Plan Generation:** After the lead approves the plan, the AI automatically generates the full project scope, epics, user stories, and a task-level timeline.
4.  **Automated Execution:** The AI proceeds to manage the newly created plan, assigning tasks and managing the workflow as previously described.

This approach eliminates the need for manual plan creation (e.g., via YAML files) and makes the AI a core part of the strategic planning phase.

## 2. Goals & Success Metrics

### 2.1. Business Objectives
- To validate the feasibility of an AI generating a viable project plan from a high-level conversation.
- To deliver a functional MVP within a 3-month timeline that reduces both planning and management overhead.
- To achieve 100% adoption from the internal team.

### 2.2. Key Performance Indicators (KPIs)
- **Successful Plan Generation:** The AI can successfully generate a complete and coherent project plan from a conversational session in >90% of attempts.
- **Team Adoption Rate:** 100% of the team uses Atlas for task management by the end of month 1.
- **Reduced Manual Communication:** Reduce manual project status messages by 95%.
- **Automated Delay Alerts:** All delayed tasks are flagged and the user is notified within 24 hours.

## 3. Target Users

### 3.1. The Developer / QA Tester
- **Goals:** A single, centralized platform for viewing assigned tasks, reducing administrative check-ins and allowing more focus on development and testing.

### 3.2. The Project Lead / Director
- **Goals:** Automate the creation of project plans and the repetitive administrative tasks of management. Gain a high-level, real-time overview of project status, freeing up time for strategic work.

## 4. Requirements

### 4.1. Functional Requirements
1.  **FR1: User Authentication:** Users must be able to log in using their GitHub account via OAuth.
2.  **FR2: Conversational Project Generation:** The system must be able to generate a complete project scope, timeline, and task breakdown based on a guided conversational discovery session with a Project Lead.
3.  **FR3: Team & Role Suggestion:** During the discovery session, the AI must be able to analyze team member profiles and suggest appropriate roles.
4.  **FR4: Task Board Display:** A central Task Board must display all AI-generated tasks, showing description, assigned user, and status (To Do, In Progress, Done).
5.  **FR5: Task Completion:** Users must be able to mark a task as "Done" via a single action.
6.  **FR6: Timeline-Aware Task Assignment:** Upon task completion, the system must automatically assign the next task based on the user's role and the AI-generated timeline.
7.  **FR7: Automated Delay Notification:** The system must perform a daily check and notify users of any delayed tasks.
8.  **FR8: Issue Reporting (Triage):** Users must be able to submit an issue/blocker, which notifies the Project Lead for manual triage.
9.  **FR9: Real-time Chat:** The application must provide a real-time chat interface for DMs and a group channel.

### 4.2. Non-Functional Requirements
1.  **NFR1: Local Deployment:** The entire application stack must be runnable on `localhost`.
2.  **NFR2: Performance:** The main Task Board must load in < 2 seconds, and API responses should be < 500ms.
3.  **NFR3: Concurrency:** The system must support at least 4 concurrent users without significant performance degradation.

## 5. MVP Scope & Epics

### 5.1. In Scope for MVP
- Conversational project discovery and plan generation.
- AI-driven team and role suggestions.
- Web-Based Task Board for AI-generated tasks.
- One-Click Task Completion.
- Automated Delay Notifications.
- Issue Reporting with Admin Triage.
- Real-time Chat (DMs and Group).

### 5.2. Out of Scope for MVP
- Manual creation or editing of project plans (AI-generated only).
- Automated calendar or meeting integration.
- Deep Git/Jira integration for progress tracking.
- Predictive risk analysis.

### 5.3. Epic & Story Breakdown

#### Epic 1: Foundation & User Authentication
*Goal: Establish a fully functional, end-to-end "slice" of the application, including project structure and user authentication, to de-risk the core technical architecture.*
- **Story 1.1: Project Initialization:** Set up the monorepo and Docker Compose for all services.
- **Story 1.2: User Authentication:** Implement GitHub OAuth login and session management.
- **Story 1.3: Basic Chat Interface:** Create a minimal, functional chat UI and backend WebSocket connection to prove real-time communication.

#### Epic 2: AI-Driven Project Generation
*Goal: Implement the core conversational AI that can understand a project leader's goals and generate a complete, actionable project plan.*
- **Story 2.1: Conversational Discovery UI:** As a Project Lead, I want a chat-like interface to engage in a guided conversation with the AI to define project goals, budget, and constraints.
- **Story 2.2: Team & Role Analysis:** As a Project Lead, I want the AI to analyze available team members and suggest appropriate roles for the project based on their expertise.
- **Story 2.3: Automated Scope Generation:** As a Project Lead, after I approve the AI's suggestions, I want the AI to automatically generate the full project plan, including epics, stories, and tasks.
- **Story 2.4: Plan Persistence:** As a developer, I want the AI-generated plan to be saved to the database so it can be used by the workflow engine.

#### Epic 3: Automated Workflow Engine
*Goal: Execute the AI-generated plan by automating task progression and proactively identifying delays.*
- **Story 3.1: Dynamic Task Board:** The Task Board UI should now display tasks generated by the AI from the database.
- **Story 3.2: Persist Task Status:** Update the task completion endpoint to save the "Done" status to the database.
- **Story 3.3: Implement Automated Task Assignment:** When a task is completed, trigger a backend process to find and assign the next available task from the AI-generated plan.
- **Story 3.4: Implement Delay Detection:** Create a daily scheduled job to scan for tasks past their `end_date` and flag them as "Delayed".
- **Story 3.5: Notification System:** Build the backend service and UI components to notify users of new assignments and delays.

#### Epic 4: Team Collaboration
*Goal: Integrate communication and issue reporting to make the application a true collaborative hub.*
- **Story 4.1: Full Chat Implementation:** Enhance the basic chat to support DMs, group chat, and message history.
- **Story 4.2: Issue Reporting & Triage:** Implement the UI and backend for a user to report a blocker and for a Project Lead to be notified for triage.

## 6. Post-MVP Vision

- **Phase 2 Priorities:**
    - **Deep Git Integration:** Automatically track progress from pull requests and merges.
    - **Smarter Task Assignment:** Consider individual workloads, skills, and historical performance.
- **Long-term Vision (1-2 Years):**
    - **Predictive Risk Analysis:** Run simulations to predict future bottlenecks and suggest mitigation strategies.
    - **Portfolio-Level Management:** Oversee an entire portfolio of projects, dynamically allocating resources between them.