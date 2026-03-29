# Pilates Studio Booking System - Client Application

## 1. Project Overview
This repository contains the client-side frontend for an enterprise-style full-stack web application designed for a Pilates studio. The application focuses on user interaction and presentation, providing a seamless booking experience for studio clients.

## 2. Architecture & Technology Stack
* **Framework:** React.
* **Separation of Concerns:** This frontend application acts as the presentation layer in a three-layer enterprise architecture.
* **Data Flow:** The frontend communicates strictly with the Django REST API middleware and never directly accesses the database.

## 3. Core User Flows & Features
* **Authentication UI:** Interfaces for user registration, user login, and secure authentication flows.
* **Profile Management:** Screens to support editable user profiles and password reset functionality.
* **Domain Functionality (Bookings):** * Interfaces allowing users to create, view, update, and cancel their Pilates class bookings.
    * Clear displays of booking attributes, such as date, time, and class resource.
    * UI states reflecting booking status lifecycles (e.g., pending, confirmed, cancelled).

## 4. Deployment Strategy
* The frontend will be deployed independently to ensure architectural separation.
* The target deployment platform is Render, utilizing secure configuration and environment variables for API endpoints.