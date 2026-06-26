# Smart Queue Management System (S4) 🚦

[![Java](https://img.shields.io/badge/Java-17-orange?style=for-the-badge&logo=java)](https://oracle.com/java)
[![Spring Boot](https://img.shields.io/badge/Spring_Boot-3.2.5-green?style=for-the-badge&logo=springboot)](https://spring.io/projects/spring-boot)
[![React](https://img.shields.io/badge/React-18-blue?style=for-the-badge&logo=react)](https://react.dev)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4-cyan?style=for-the-badge&logo=tailwindcss)](https://tailwindcss.com)
[![MySQL](https://img.shields.io/badge/MySQL-8.0-blue?style=for-the-badge&logo=mysql)](https://mysql.com)

> **Slogan:** Efficiency in Every Turn 🏫  
> **Tagline:** Streamlining customer flows, optimizing counter service, and reducing wait times with real-time queue intelligence.

A production-ready **Smart Queue Management System** designed to manage and optimize customer waiting lines. The project consists of a high-performance **Java Spring Boot backend** secured with JWT authentication, a relational **MySQL database** layer, and a modern **Vite-based frontend** supporting customer, staff, and admin portals.

---  
hii
## 🛠️ Tech Stack & Key Libraries

### Backend (Spring Boot)
- **Framework:** Spring Boot 3.x (Java 17+)
- **Security:** Spring Security & JWT (JSON Web Tokens) for role-based authentication
- **Data Access:** Spring Data JPA & Hibernate ORM
- **Database:** MySQL Server 8.0+
- **Build Tool:** Maven

### Frontend (Vite & Vanilla JS)
- **Bundler:** Vite (for fast module bundling and development)
- **Styling:** Custom responsive CSS layouts and CSS parameters

---

## 🚀 Setup & Execution Guide

### Prerequisites
- Java Development Kit (JDK) 17+ installed
- Node.js (v18+) installed
- MySQL Server 8.0 running locally

### 1. Database Setup
1. Log into your MySQL console and create the database:
   ```sql
   CREATE DATABASE smart_queue;
   ```
2. Update the credentials in `backend/src/main/resources/application.properties` (or yml) to match your environment username and password:
   ```properties
   spring.datasource.url=jdbc:mysql://localhost:3306/smart_queue
   spring.datasource.username=root
   spring.datasource.password=Root@123
   ```

### 2. Backend Installation (Spring Boot)
1. Navigate to the `backend` directory containing `pom.xml`:
   ```bash
   cd backend
   mvn clean install
   ```
2. Launch the backend application:
   ```bash
   mvn spring-boot:run
   ```
   The backend API will run on `http://localhost:8080/`. You can view API documentation at `http://localhost:8080/swagger-ui/index.html`.

### 3. Frontend Installation (React + Vite)
1. Open a new shell and navigate to the `frontend` folder:
   ```bash
   cd frontend
   ```
2. Install npm packages:
   ```bash
   npm install
   ```
3. Run the development server:
   ```bash
   npm run dev
   ```
   Open your browser and navigate to `http://localhost:5173`.



---

## 📂 Project Structure
```
S4/
├── backend/                   # Spring Boot core files
│   ├── src/main/java          # Controllers, Services, Repositories, Configs
│   └── pom.xml                # Backend dependencies (JPA, Security, JJWT)
│
├── frontend/                  # React dashboard frontend
│   ├── src/                   # Components, Layouts, Hooks
│   ├── package.json           # Node configuration scripts
│   └── vite.config.js         # Vite compile configuration
│
└── README.md                  # Root project documentation
```
