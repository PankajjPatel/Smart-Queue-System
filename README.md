# Smart Queue Management System 🎫

> **Slogan:** Efficiency in Every Turn ⭐  
> **Tagline:** Streamlining customer flows, optimizing counter service, and reducing wait times with real-time queue intelligence.

A production-ready **Smart Queue Management System** designed to manage and optimize customer waiting lines. The project consists of a high-performance **Java Spring Boot backend** secured with JWT authentication, a relational **MySQL database** layer, and a modern **Vite-based frontend** supporting customer, staff, and admin portals.

---

## 🛠️ Tech Stack & Key Libraries

### Backend (Spring Boot)
- **Framework:** Spring Boot 3.x (Java 17+)
- **Security:** Spring Security & JWT (JSON Web Tokens) for role-based authentication
- **Data Access:** Spring Data JPA & Hibernate ORM
- **Database:** MySQL Server 8.0+
- **Build Tool:** Maven

### Frontend (Vite & Vanilla JS)
- **Bundler:** Vite (for fast module bundling and development)
- **UI / UX Styling:** Modern responsive CSS with custom layouts
- **Logic:** Vanilla JS with Fetch API for backend integration
- **Portals:** Dedicated user flows for Customers, Staff, and Administrators

---

## 📂 Project Architecture

```
smart-queue-system/
├── backend/                  # Spring Boot Java Application
│   ├── src/main/java/        # Java source code (Controllers, Services, Repositories, DTOs, Security)
│   ├── src/main/resources/   # Application properties and SQL scripts (data.sql, schema.sql)
│   └── pom.xml               # Maven dependency configuration
├── database/                 # Relational database scripts
│   ├── schema.sql            # Database tables and relationships setup
│   └── data.sql              # Seed data for roles, services, and counters
└── frontend/                 # React/Vite/HTML User Interfaces
    ├── css/                  # Styling files
    ├── js/                   # Core JavaScript files handling APIs
    ├── index.html            # Customer Landing Page (Token Generation)
    ├── customer.html         # Customer Queue Dashboard (Real-time View)
    ├── staff.html            # Staff Counter Console
    ├── admin.html            # Admin Configuration Panel
    └── vite.config.js        # Vite configuration
```

---

## 🔑 Role-Based Access Control (RBAC)

The application implements secure role-based endpoints:
1. **Customer:** Can view active queues and generate new queue tokens.
2. **Staff:** Can manage active tokens at their assigned counter (calling next customer, marking complete, etc.).
3. **Admin:** Can create/update locations, services, staff accounts, and counter assignments.

---

## 🚀 Step-by-Step Local Setup Guide

Follow these steps to run the Smart Queue Management System locally:

### 1. Database Configuration
1. Start your local MySQL service.
2. Create a database named `smart_queue`:
   ```sql
   CREATE DATABASE smart_queue;
   ```
3. Import the database schema and default seed data using the SQL scripts in `database/schema.sql` and `database/data.sql`.

### 2. Backend Setup
1. Navigate to the `backend/` directory.
2. Configure your MySQL credentials in `src/main/resources/application.properties`:
   ```properties
   spring.datasource.url=jdbc:mysql://localhost:3306/smart_queue
   spring.datasource.username=root
   spring.datasource.password=your_password
   ```
3. Run the backend application using Maven:
   ```bash
   ./mvnw spring-boot:run
   ```
   The backend API server will start on `http://localhost:8080`.

### 3. Frontend Setup
1. Navigate to the `frontend/` directory.
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the Vite development server:
   ```bash
   npm run dev
   ```
4. Open your browser and navigate to the local URL (usually `http://localhost:5173`).

---

## 📝 License
This project is proprietary and for educational purposes.
