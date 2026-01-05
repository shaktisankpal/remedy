# Remedy - Complaint Tracking System

A full-stack complaint management application designed to streamline the process of reporting, tracking, and resolving client issues. The system features a robust role-based access control mechanism to ensure efficient workflow from initial report to final resolution.

## 🚀 Features

- **Multi-Role System**: Distinct workflows for Admins, Developers, Support Agents, and Clients.
- **Complaint Lifecycle Management**: Track complaints through various states (Open, In Progress, Escalated, Resolved, Closed).
- **Escalation Mechanism**: Seamless escalation from Support (L1) to Developer (L2) for complex issues.
- **User Management**: Administrators can control user roles and access.

## 👥 User Roles

The application defines four primary user roles, each with specific responsibilities:

1.  **ADMIN**:
    - Has full control over the system.
    - Manages user accounts and assigns roles.
2.  **DEVELOPER (L2)**:
    - Handles technical and complex complaints escalated by the Support team.
    - Responsible for resolving Level 2 issues.
3.  **SUPPORT (L1)**:
    - First point of contact for Client complaints.
    - Attempts to resolve issues immediately.
    - Escalates unresolved or technical issues to Level 2 (Developer).
4.  **CLIENT**:
    - End-users who report issues.
    - Can create new complaints, view status, close resolved complaints, or reopen them if unsatisfied.

## 🛠️ Tech Stack

- **Frontend**: React (Vite), TailwindCSS
- **Backend**: Node.js, Express.js
- **Database**: MongoDB (Mongoose)

## 📦 Setup & Installation

Follow these steps to get the project running locally.

### Prerequisites

- Node.js installed
- MongoDB installed and running

### 1. Backend Setup

1.  Navigate to the backend directory:
    ```bash
    cd backend
    ```
2.  Install dependencies:
    ```bash
    npm install
    ```
3.  Start the server:
    ```bash
    node src/server.js
    ```
    _(Note: Ensure your MongoDB instance is running and `.env` is configured if required)_

### 2. Frontend Setup

1.  Navigate to the frontend directory:
    ```bash
    cd frontend
    ```
2.  Install dependencies:
    ```bash
    npm install
    ```
3.  Start the development server:
    ```bash
    npm run dev
    ```

## 📂 Project Structure

- **backend/**: Contains the Node.js/Express API, database models, and logic.
- **frontend/**: Contains the React application and UI components.
