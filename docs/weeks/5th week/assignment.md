# Assignment 3: Atlas Project Backlog (Concise & Consistent)

---

### Slide 1: Core User Stories (INVEST)

1.  **As a** Project Lead, **I want** to conversationally define a project with an AI, **so that** I can create a complete plan without manual data entry.
2.  **As a** Developer, **I want** my next task automatically assigned upon completion, **so that** I can maintain focus and momentum.
3.  **As a** Project Lead, **I want** the AI to automatically flag delayed tasks, **so that** I can identify and manage project risks proactively.

---

### Slide 2: Epic-to-Backlog Breakdown (Concise)

**Epic 1: Foundation & User Authentication**
*   **User Story:** As a user, I want to log in with GitHub so the system can identify me.
*   **Backlog Tasks:**
    *   `Task:` Configure Docker Compose for all services.
    *   `Task:` Implement User Authentication End-to-End.
    *   `Task:` Create User table in Database.

**Epic 2: AI-Driven Project Generation**
*   **User Story:** As a Project Lead, I want the AI to generate a project plan from our conversation.
*   **Backlog Tasks:**
    *   `Task:` Build the conversational AI endpoint.
    *   `Task:` Develop prompts for the AI to generate a plan.
    *   `Task:` Save the AI-generated plan to the database.

**Epic 3: Automated Workflow Engine**
*   **User Story:** As a Developer, I want to mark tasks as 'Done' to trigger the next automated assignment.
*   **Backlog Tasks:**
    *   `Task:` Display the AI-generated tasks on a UI Task Board.
    *   `Task:` Implement the "Mark as Complete" endpoint.
    *   `Task:` Implement the automated next-task assignment logic.

---

### Slide 3: Prioritized Backlog Items

*   **Priority 1 (Foundation):**
    *   `Task:` Configure Docker Compose for all services.
    *   `Task:` Implement User Authentication End-to-End.
    *   `Task:` Create User table in Database.

*   **Priority 2 (Core AI Feature):**
    *   `Task:` Build the conversational AI endpoint.
    *   `Task:` Develop prompts for the AI to generate a plan.
    *   `Task:` Save the AI-generated plan to the database.

*   **Priority 3 (Execution Workflow):**
    *   `Task:` Display the AI-generated tasks on a UI Task Board.
    *   `Task:` Implement the "Mark as Complete" endpoint.
    *   `Task:` Implement the automated next-task assignment logic.

---

### Slide 4: Example Backlog Board (Trello/Jira Layout)

| User Stories | Backlog Tasks | Priority |
| :--- | :--- | :--- |
| **Story:** User Authentication | `Task: Implement User Authentication` | P1 |
| | `Task: Configure Docker Compose` | P1 |
| **Story:** AI Plan Generation | `Task: Build AI Discovery Endpoint` | P2 |
| | `Task: Develop Plan Generation Prompt` | P2 |
| | `Task: Save Plan to DB` | P2 |
| **Story:** View & Complete Tasks | `Task: Create Task Board UI` | P3 |
| | `Task: Implement "Complete Task" API`| P3 |

