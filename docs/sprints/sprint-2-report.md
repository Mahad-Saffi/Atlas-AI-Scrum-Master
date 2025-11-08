# Sprint 2 Report: Basic Conversational AI

---

## Sprint Schedule

| Day | Activity | Who | Details |
| :--- | :--- | :--- | :--- |
| **Monday** | **Sprint Planning** | All Team | **Goal:** Implement the initial conversational AI for project creation. <br/> **Priority Task:** Omer to fix the flaky authentication test from Sprint 1. <br/> **Assignments:** Omer: `/discover` endpoint & LangChain integration. Hassaan: Chat UI on the "New Project" page. Salman: Test plan for the conversational AI. |
| **Tuesday** | **Daily Standup** | All Team | **Progress:** Omer reports the Sprint 1 auth test is now fixed and all tests are passing. He is starting the `/discover` endpoint. Hassaan has the basic UI for the chat window. Salman is defining acceptance criteria for the AI conversation. **No blockers.** |
| **Wednesday**| **Daily Standup** | All Team | **Progress:** Omer has a basic `/discover` endpoint that can receive a message and respond. Hassaan is connecting the UI to the endpoint. Mahad has enabled the "fail on test failure" gate in the CI pipeline. **No blockers.** |
| **Thursday** | **Daily Standup** | All Team | **Progress:** Omer has integrated the first LangChain prompt, allowing the AI to ask a question. Hassaan is displaying the AI's response in the chat UI. They are collaborating to ensure the data format matches. |
| **Friday** | **Sprint Review** | All Team | Demonstrate the new "Create Project" page where a user can have a basic, two-step conversation with the AI. Show that the interaction is happening live and the AI's response is successfully displayed. |

---

## Sprint Review

| Time | Duration | Activity | Description | Presenter |
| :--- | :--- | :--- | :--- | :--- |
| 8:00 | 5 min | **Introduction** | Overview of Sprint 2's goal: To bring the AI to life by building its first user-facing conversational feature, the foundation of our project generation engine. | Atlas (AI Agent) |
| 8:05 | 5 min | **Sprint Goals** | **Goal 1:** Implement the initial conversational AI interface for project creation. <br/> **Goal 2:** Ensure the AI can successfully receive a user's project goal and respond with a clarifying question. <br/> **Impact:** This is the first tangible AI feature and proves the core concept of conversational project management is viable. | Atlas (AI Agent) |
| 8:10 | 15 min | **Status & Demo** | **Completed:** The flaky authentication test from Sprint 1 is fixed. A new "Create Project" page is live. The backend `/discover` endpoint is fully functional with a basic LangChain prompt chain integrated. <br/> **Live Demo:** Show a user navigating to the "Create Project" page, typing in a project goal (e.g., "Build a new mobile app"), and receiving a specific clarifying question back from the AI in the chat interface. | Omer & Hassaan |
| 8:25 | 5 min | **Metrics** | **Velocity:** Planned 8 story points, Completed 8 (100%). <br/> **Trend:** The team successfully addressed the technical debt from Sprint 1 and delivered the full sprint commitment. This shows an improvement in our estimation and execution process. | Salman |
| 8:30 | 5 min | **Blockers** | No blockers occurred this sprint. The main challenge was designing the initial LangChain prompt, but this was resolved within the planned time. | Salman |

---

## Sprint Retrospective

### What worked well this sprint?

- **Process Improvement:** Prioritizing and fixing the leftover testing issue from Sprint 1 at the very beginning of this sprint was a great success. It unblocked our CI/CD pipeline and restored the team's confidence in our test suite.
- **Collaboration:** The focused design session between Omer (Backend) and Hassaan (Frontend) to define the JSON structure for the chat messages was highly effective. It took only 30 minutes and prevented any integration problems.
- **Focus:** The team did an excellent job of concentrating only on the two user stories for this sprint. We successfully avoided scope creep by tabling discussions about more advanced AI features for a future sprint.

### What didn’t work so well this sprint?

- **Initial Uncertainty:** There was some initial confusion on Wednesday about how to manage the conversation state in LangChain. Omer spent a few hours researching different methods, which was valuable but not explicitly planned for.
- **Communication Lag:** On Thursday morning, Hassaan had to wait for a clarification from Omer on the final API response format. A quick, direct message would have been faster than waiting for the next daily standup and could have saved an hour of idle time.

### What will we do to improve next sprint?

- **Action Item (Planning):** For future sprints involving new technologies (like the AI plan generation in Sprint 3), we will add a specific "Research/Spike" task to the backlog to formally allocate time for exploration and reduce uncertainty.
- **Action Item (Communication):** We will encourage more ad-hoc communication for small clarifications. If a question can be answered in 2 minutes via a direct message or call, we will do that instead of waiting for the next daily standup.
