# Guide: Understanding Epics, Stories, and Backlog Items

This document explains the hierarchy of work in project management, using examples from the Atlas assignment.

### The Hierarchy

The relationship is simple:
- **Epics** are very large goals.
- **User Stories** are smaller features that help achieve the Epic.
- **Backlog Items** (or Tasks) are the specific technical jobs needed to build a User Story.

--- 

### 1. The Epic

*   **What it is:** An Epic is a large body of work or a major feature that is too big to be completed in a single development cycle (a "sprint"). It's a high-level placeholder.

*   **Our Example:**
    > **Epic 2: AI-Driven Project Generation**

*   **Why it's an Epic:** This is a huge feature. It involves a conversation with the user, complex AI logic for analysis, generating a plan, and saving that plan. It will take many smaller steps to achieve this big goal.

---

### 2. The User Story

*   **What it is:** A User Story describes a specific feature from an end-user's perspective. It focuses on the **who, what, and why**, not the technical details. It should be small enough to be completed in a single sprint.

*   **Our Example (from Epic 2):**
    > **As a** Project Lead, **I want** the AI to generate a project plan from our conversation, **so that** I can create a plan without manual data entry.

*   **Why it's a Story:** This is a specific, valuable piece of the larger Epic. It defines a single, testable feature that delivers value to the Project Lead.

---

### 3. The Backlog Item (Task)

*   **What it is:** A Backlog Item is a concrete, technical task that a developer or engineer needs to do. It describes the **"how."** Several Backlog Items are usually needed to complete one User Story.

*   **Our Examples (for the Story above):**
    *   `Task:` Build the conversational AI endpoint.
    *   `Task:` Develop prompts for the AI to generate a plan.
    *   `Task:` Save the AI-generated plan to the database.

*   **Why they are Tasks:** These are no longer user-facing features; they are the specific engineering jobs required to make the User Story functional.

---

### Visual Summary

Here is how they all relate to each other:

```
[EPIC: AI-Driven Project Generation]
   |
   +---- [STORY: Generate plan from conversation]
           |
           +---- [TASK: Build the conversational AI endpoint]
           +---- [TASK: Develop prompts for the AI to generate a plan]
           +---- [TASK: Save the AI-generated plan to the database]
```
