# Sprint 1 Report: Foundation & Authentication

---

## Sprint Schedule

| Day | Activity | Who | Details |
| :--- | :--- | :--- | :--- |
| **Monday** | **Sprint Planning** | All Team | **Goal:** Establish core infrastructure & user authentication. <br/> **Assignments:** Mahad: Docker & CI/CD setup. Omer: Backend auth endpoints & DB schema. Hassaan: Frontend login UI. Salman: Auth test plan. |
| **Tuesday** | **Daily Standup** | All Team | **Progress:** Mahad: Docker networking configured. Omer: `users` table schema defined. Hassaan: Login page components built. Salman: Test cases for OAuth drafted. **No blockers.** |
| **Wednesday**| **Daily Standup** | All Team | **Progress:** Omer: `/auth/github` endpoint started. Mahad: Health checks in progress. <br/> **Blocker:** Hassaan is blocked waiting for the backend auth callback endpoint to be deployed. |
| **Thursday** | **Daily Standup** | All Team | **Progress:** Omer has deployed the auth endpoints to the dev environment. Hassaan is unblocked and integrating the login flow. Salman is writing automated test scripts. **Blocker resolved.** |
| **Friday** | **Sprint Review** | All Team | Demonstrate the full, end-to-end GitHub login flow and the creation of a user record in the database. Prepare to discuss test results and partially completed items. |

---

## Sprint Review

| Time | Duration | Activity | Description | Presenter |
| :--- | :--- | :--- | :--- | :--- |
| 8:00 | 5 min | **Introduction** | Overview of the Atlas AI vision. This sprint's goal was to build the foundational authentication layer upon which all future features will depend. | Atlas (AI Agent) |
| 8:05 | 5 min | **Sprint Goals** | **Goal 1:** Establish the core technical architecture with Docker. <br/> **Goal 2:** Integrate GitHub OAuth for secure user authentication. <br/> **Impact:** Enables all future user-specific features by providing a reliable authentication and session management system. | Atlas (AI Agent) |
| 8:10 | 15 min | **Status & Demo** | **Completed:** Docker Compose setup, backend user schema, full GitHub OAuth flow, frontend login/callback pages. <br/> **Live Demo:** Walkthrough of a user clicking "Login with GitHub", authorizing the app, being redirected, and seeing their user info on the frontend, with the corresponding user record shown in the database. <br/> **Value:** A secure, working authentication system is now in place. | Omer & Hassaan |
| 8:25 | 5 min | **Metrics** | **Velocity:** Planned 13 story points, Completed 12 (92.3%). <br/> **Reason:** One backend unit test for handling OAuth error states failed, preventing the testing story from being marked as 'Done'. | Salman |
| 8:30 | 5 min | **Blockers** | **Exact Blocker:** The unit test for the GitHub OAuth callback consistently fails to mock the timeout error from the GitHub API, leading to an incomplete test suite. <br/> **Impact:** Delayed full CI/CD pipeline activation. | Salman |

---

## Sprint Retrospective

### What worked well this sprint?

- **Specific Success:** The Docker Compose configuration was highly effective. Hassaan (Frontend) was able to develop the UI against a mock server while Omer (Backend) built the actual endpoints, and they integrated seamlessly.
- **Specific Success:** The API contract for the authentication endpoints (`/auth/github`, `/auth/callback`) was clearly defined early on, which prevented any integration issues between the frontend and backend.
- **Specific Success:** The team's communication in Wednesday's standup to identify that Hassaan was blocked by the backend deployment was quick and effective, allowing Omer to prioritize the deployment and resolve the blocker within a day.

### What didn’t work so well this sprint?

- **Specific Problem:** We underestimated the complexity of writing a reliable unit test for the GitHub OAuth callback, specifically in mocking network failure scenarios. This caused the testing story to be incomplete.
- **Specific Problem:** The Definition of Done for the main authentication story (which requires 100% passing tests) was not met because of the single failing test, even though the feature works manually.
- **Specific Problem:** The CI/CD pipeline was set up by Mahad, but we couldn't enable the "fail build on test failure" feature. This meant a developer could still merge code even with the known failing test, reducing the effectiveness of our CI gate.

### What will we do to improve next sprint?

- **Specific Action:** The first task in Sprint 2 for Omer will be to fix the flaky authentication test by using a more robust mocking library (e.g., `respx`) for external API calls.
- **Specific Action:** During Sprint 2 planning, when we estimate the story for "AI-Driven Project Generation", we will explicitly create a sub-task for "writing integration tests for the AI service" and add story points accordingly.
- **Specific Action:** Mahad will enable the "fail build on test failure" setting in the GitHub Actions workflow as soon as Salman confirms the entire test suite is green.
