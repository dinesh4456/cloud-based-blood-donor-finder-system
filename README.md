# Blood Donor Finder System 🩸

> A production-ready, cloud-ready enterprise web application connecting voluntary blood donors with hospital patients and families in real-time medical emergencies.

![Java](https://img.shields.io/badge/Java-17-orange.svg)
![Spring Boot](https://img.shields.io/badge/Spring%20Boot-3.2.5-brightgreen.svg)
![Spring Security](https://img.shields.io/badge/Spring%20Security-JWT-blue.svg)
![Database](https://img.shields.io/badge/Database-MySQL%208.0-blue.svg)
![Frontend](https://img.shields.io/badge/Frontend-Bootstrap%205.3-purple.svg)
![Deployment](https://img.shields.io/badge/AWS-EC2%20%7C%20RDS%20Ready-ff9900.svg)

---

## 📑 Table of Contents
1. [Project Overview](#-project-overview)
2. [Key Features](#-key-features)
3. [Technology Stack](#-technology-stack)
4. [Enterprise Layered Architecture](#-enterprise-layered-architecture)
5. [Database Schema & Relationships](#-database-schema--relationships)
6. [Pre-configured Seed Accounts](#-pre-configured-seed-accounts)
7. [Getting Started (Localhost)](#-getting-started-localhost)
8. [REST API Documentation](#-rest-api-documentation)
9. [Postman Collection Guide](#-postman-collection-guide)
10. [AWS Production Deployment Guide](#-aws-production-deployment-guide)

---

## 🌟 Project Overview

During emergencies, every second counts. Finding matching blood donors in nearby locations is often fraught with delays, unverified lists, and communication barriers. 

The **Blood Donor Finder System** provides:
- Instant geographical search by **Blood Group** and **City**.
- **Real-time Donor Availability Status** (Available / Unavailable) managed directly by donors.
- **Urgent Blood Request Dispatch** (Direct to a specific donor or open city-wide requests).
- **Request Lifecycle Tracking**: Pending ➔ Accepted ➔ Completed / Rejected / Cancelled.
- **Comprehensive Administration Console**: Platform analytics, user activation/blocking, donor records, and request audits.
- **Zero-Build Embedded Frontend**: Beautiful, responsive Bootstrap 5 interface served directly by Spring Boot.

---

## ✨ Key Features

### 🔐 1. Security & Authentication
- **BCrypt Password Hashing** (Strength: 12) for secure credential storage.
- **JWT (JSON Web Tokens)** stateless session management via JJWT 0.12.5.
- **Role-Based Access Control (RBAC)**: `ROLE_USER`, `ROLE_DONOR`, `ROLE_ADMIN`.
- **Account Protection**: Instant lockout enforcement for blocked or deactivated accounts.

### 👤 2. User & Profile Module
- User registration and login with input validation.
- Profile view, personal details update, and secure password change (requiring current password verification).

### 🩸 3. Donor Management
- One-click donor onboarding with blood group (`A+`, `A-`, `B+`, `B-`, `AB+`, `AB-`, `O+`, `O-`), city, and contact details.
- Instant **Availability Toggle** to prevent unwanted calls when unable to donate.
- Tracks **Last Donation Date** and **Total Donations Count**.

### 🔍 4. Blood Search Hub
- Filter donors by blood group and city.
- Filter by availability status.
- Direct **"Request Blood"** modal pre-populating donor and hospital data.
- Public **Blood Group Inventory** and **Medical Compatibility Matrix**.

### 🚑 5. Blood Requests Workflow
- Send direct requests to specific donors or open city-wide emergency broadcasts.
- Donor acceptance/decline controls with real-time feedback.
- Requester tracking for sent requests with cancellation capabilities.
- Auto-increment of donor donation counters upon successful request completion.

### 🛡️ 6. Administration Module
- High-level KPIs: Total users, registered donors, available donors, and active blood requests.
- Blood group distribution breakdown with percentages.
- User management table with one-click **Block / Activate** actions.
- Audit logs for all registered donors and blood requests.

---

## 🛠️ Technology Stack

| Layer | Technologies |
|---|---|
| **Backend Framework** | Java 17, Spring Boot 3.2.5, Spring MVC |
| **Data Access** | Spring Data JPA, Hibernate, HikariCP |
| **Security** | Spring Security 6, JWT (io.jsonwebtoken:jjwt 0.12.5), BCrypt |
| **Database** | MySQL 8.0+ (with automatic schema updates) |
| **Frontend** | HTML5, CSS3, JavaScript (Vanilla ES6+), Bootstrap 5.3.3, Bootstrap Icons |
| **Build & Packaging** | Apache Maven 3.9+ |
| **Testing** | JUnit 5, Spring Security Test, Postman Collection |
| **Cloud Deployment** | AWS EC2 (Ubuntu 22.04 LTS), Amazon RDS (MySQL) |

---

## 🏗️ Enterprise Layered Architecture

```
com.bloodfinder/
├── BloodDonorFinderApplication.java   # Spring Boot Main Entry Point
├── config/                            # Security, MVC, and Data Seeding
│   ├── SecurityConfig.java
│   ├── WebConfig.java
│   └── DataInitializer.java
├── controller/                        # REST Controllers (Strictly no business logic)
│   ├── AuthController.java
│   ├── UserController.java
│   ├── DonorController.java
│   ├── BloodRequestController.java
│   └── AdminController.java
├── service/                           # Business Logic Interfaces
│   ├── AuthService.java
│   ├── UserService.java
│   ├── DonorService.java
│   ├── BloodRequestService.java
│   ├── AdminService.java
│   └── impl/                          # Constructor-injected implementations
├── repository/                        # Spring Data JPA Repositories
│   ├── UserRepository.java
│   ├── DonorRepository.java
│   └── BloodRequestRepository.java
├── entity/                            # JPA Relational Entities & Enums
│   ├── User.java
│   ├── Donor.java
│   ├── BloodRequest.java
│   └── enums/
├── dto/                               # Data Transfer Objects & Validation
│   ├── request/
│   └── response/
├── exception/                         # Global Exception Handler & Custom Errors
│   ├── GlobalExceptionHandler.java
│   ├── ResourceNotFoundException.java
│   ├── BadRequestException.java
│   ├── UnauthorizedException.java
│   └── DuplicateResourceException.java
├── security/                          # JWT Tokens, Filter & UserDetails
│   ├── JwtTokenProvider.java
│   ├── JwtAuthenticationFilter.java
│   ├── JwtAuthenticationEntryPoint.java
│   ├── CustomUserDetailsService.java
│   └── UserPrincipal.java
└── util/                              # Constants and Helper Utilities
    └── AppConstants.java
```

---

## 🗄️ Database Schema & Relationships

### Relational Entities:
1. **`users` Table**:
   - `id` (PK, BigInt, Auto-increment)
   - `name`, `email` (Unique), `password` (BCrypt), `phone`
   - `role` (`ROLE_USER`, `ROLE_DONOR`, `ROLE_ADMIN`)
   - `status` (`ACTIVE`, `BLOCKED`)
   - `created_at`, `updated_at`

2. **`donors` Table**:
   - `id` (PK, BigInt, Auto-increment)
   - `user_id` (FK to `users.id`, 1-to-1)
   - `blood_group` (`A_POSITIVE`, `A_NEGATIVE`, `B_POSITIVE`, `B_NEGATIVE`, `AB_POSITIVE`, `AB_NEGATIVE`, `O_POSITIVE`, `O_NEGATIVE`)
   - `city`, `state`, `address`, `contact_number`
   - `last_donation_date` (Date)
   - `availability_status` (`AVAILABLE`, `UNAVAILABLE`)
   - `total_donations` (Integer)

3. **`blood_requests` Table**:
   - `id` (PK, BigInt, Auto-increment)
   - `requester_id` (FK to `users.id`, Many-to-1)
   - `donor_id` (FK to `donors.id`, Many-to-1, Nullable for open emergency broadcast)
   - `patient_name`, `blood_group`, `hospital_name`, `hospital_address`, `city`, `contact_number`
   - `required_units` (Integer)
   - `urgency_level` (`LOW`, `MEDIUM`, `HIGH`, `CRITICAL`)
   - `status` (`PENDING`, `ACCEPTED`, `REJECTED`, `COMPLETED`, `CANCELLED`)
   - `additional_notes`, `needed_before`

---

## 🔑 Pre-configured Seed Accounts

When the application boots, `DataInitializer` automatically seeds realistic test data:

| Account Type | Email | Password | Role / Details |
|---|---|---|---|
| **System Admin** | `admin@bloodfinder.com` | `Admin@123` | Full administrative control |
| **Donor (O+)** | `rahul.sharma@example.com` | `Donor@123` | Mumbai, Available (5 donations) |
| **Donor (A+)** | `priya.patel@example.com` | `Donor@123` | Delhi, Available (3 donations) |
| **Donor (B+)** | `amit.verma@example.com` | `Donor@123` | Bangalore, Available (8 donations) |
| **Donor (AB+)** | `sneha.reddy@example.com` | `Donor@123` | Hyderabad, Available (2 donations) |
| **Donor (O-)** | `vikram.singh@example.com` | `Donor@123` | Mumbai, Universal Donor (12 donations) |
| **Donor (B-)** | `ananya.das@example.com` | `Donor@123` | Pune, Available (4 donations) |
| **Regular User** | `john.doe@example.com` | `User@123` | Standard requester account |

---

## 🚀 Getting Started (Localhost)

### Prerequisites
- **Java 17** or higher
- **Maven 3.9+**
- **MySQL 8.0+** (Running on default port `3306`)

### Step 1: Database Setup
Ensure MySQL is running on `localhost:3306`. Create database `blood_donor_db` (or let the JDBC driver auto-create it with `createDatabaseIfNotExist=true`):
```sql
CREATE DATABASE IF NOT EXISTS blood_donor_db;
```

### Step 2: Configure Environment or application.yml
By default, the application connects using:
- Host: `localhost`
- Port: `3306`
- User: `root`
- Password: `root` (or set via environment variables `SPRING_DATASOURCE_PASSWORD` / `DB_PASSWORD`)

To customize credentials, set environment variables:
```powershell
# Windows PowerShell
$env:DB_USERNAME="root"
$env:DB_PASSWORD="your_password"
```

### Step 3: Build & Run
Run with Maven:
```powershell
mvn spring-boot:run
```
Or package and execute the standalone JAR:
```powershell
mvn clean package -DskipTests
java -jar target/blood-donor-finder-system-1.0.0.jar
```

### Step 4: Open in Browser
Open your browser and navigate to:
```
http://localhost:8080
```

---

## 📡 REST API Documentation

### 1. Authentication Endpoints (`/api/auth`)
| Method | Endpoint | Access | Description |
|---|---|---|---|
| `POST` | `/api/auth/register` | Public | Register a new user or donor |
| `POST` | `/api/auth/login` | Public | Authenticate user and receive JWT token |

### 2. User Profile Endpoints (`/api/users`)
| Method | Endpoint | Access | Description |
|---|---|---|---|
| `GET` | `/api/users/profile` | Authenticated | Retrieve authenticated user's profile |
| `PUT` | `/api/users/profile` | Authenticated | Update user name and phone number |
| `PUT` | `/api/users/change-password` | Authenticated | Change account password |

### 3. Donor Endpoints (`/api/donors`)
| Method | Endpoint | Access | Description |
|---|---|---|---|
| `GET` | `/api/donors/search` | Public | Search donors by bloodGroup, city, availability |
| `GET` | `/api/donors/available` | Public | List all currently available donors |
| `GET` | `/api/donors/{id}` | Public | Get specific donor details |
| `GET` | `/api/donors/stats/summary` | Public | Summary count of donors per blood group |
| `POST` | `/api/donors/register` | Authenticated | Register authenticated user as a donor |
| `PUT` | `/api/donors/profile` | Authenticated | Update donor profile details |
| `PATCH` | `/api/donors/toggle-availability`| Authenticated | Toggle availability (AVAILABLE / UNAVAILABLE) |
| `GET` | `/api/donors/my-profile` | Authenticated | Get donor profile of logged in user |

### 4. Blood Request Endpoints (`/api/requests`)
| Method | Endpoint | Access | Description |
|---|---|---|---|
| `POST` | `/api/requests` | Authenticated | Create a direct or open blood request |
| `PUT` | `/api/requests/{id}/status` | Authenticated | Update request status (ACCEPTED, REJECTED, COMPLETED) |
| `GET` | `/api/requests/sent` | Authenticated | Get all requests sent by current user |
| `GET` | `/api/requests/received` | Authenticated | Get all requests received as a donor |
| `GET` | `/api/requests/{id}` | Authenticated | Get request details |
| `DELETE` | `/api/requests/{id}` | Authenticated | Cancel pending request |

### 5. Admin Endpoints (`/api/admin`)
| Method | Endpoint | Access | Description |
|---|---|---|---|
| `GET` | `/api/admin/dashboard` | Admin Only | High-level system KPIs & blood group stats |
| `GET` | `/api/admin/users` | Admin Only | List all registered users |
| `PUT` | `/api/admin/users/{id}/status` | Admin Only | Block or activate user account |
| `GET` | `/api/admin/donors` | Admin Only | List all registered donors |
| `GET` | `/api/admin/requests` | Admin Only | List all blood requests |

---

## 📮 Postman Collection Guide

A pre-built Postman collection is included in:
```
postman/Blood_Donor_Finder_System.postman_collection.json
```

### Quick Import Steps:
1. Open **Postman**.
2. Click **Import** ➔ Select `postman/Blood_Donor_Finder_System.postman_collection.json`.
3. Variables configured:
   - `{{baseUrl}}`: `http://localhost:8080/api`
   - `{{token}}`: Auto-saved upon executing "Login User".
   - `{{adminToken}}`: Auto-saved upon executing "Login Admin".
4. Execute test requests across all 5 modules seamlessly.

---

## ☁️ AWS Production Deployment Guide

This application is architected to be 100% **AWS Free Tier ready** with zero external dependencies.

```
                  Internet / Users
                         │
                         ▼
        ┌──────────────────────────────────┐
        │       AWS VPC / Security Group   │
        │                                  │
        │   ┌──────────────────────────┐   │
        │   │    Amazon EC2 Instance   │   │
        │   │    (Ubuntu 22.04 LTS)    │   │
        │   │  • Java 17 JRE           │   │
        │   │  • Spring Boot JAR :8080 │   │
        │   │  • Nginx (Reverse Proxy) │   │
        │   └────────────┬─────────────┘   │
        │                │                 │
        │                ▼                 │
        │   ┌──────────────────────────┐   │
        │   │   Amazon RDS Instance    │   │
        │   │       (MySQL 8.0)        │   │
        │   │    Port 3306 (Private)   │   │
        │   └──────────────────────────┘   │
        └──────────────────────────────────┘
```

### Step 1: Provision Amazon RDS (MySQL)
1. Go to **AWS Console ➔ RDS ➔ Create Database**.
2. Select **MySQL (8.0)**, choose **Free Tier** template (`db.t3.micro` or `db.t4g.micro`).
3. Set DB Instance Identifier: `blood-donor-db`.
4. Master username: `admin`, Master password: `YourSecurePassword123!`.
5. Under Connectivity, select your default **VPC** and ensure **Security Group** allows inbound traffic on port `3306` from your EC2 Security Group.
6. Note the RDS **Endpoint** (e.g. `blood-donor-db.cxxxxxx.us-east-1.rds.amazonaws.com`).

### Step 2: Launch Amazon EC2 Instance
1. Go to **EC2 ➔ Launch Instance**.
2. Choose **Ubuntu Server 22.04 LTS (HVM)**, Architecture: 64-bit (x86).
3. Instance Type: `t2.micro` or `t3.micro` (Free tier eligible).
4. Key pair: Create or select your `.pem` key.
5. In **Network Settings**, configure **Security Group**:
   - Inbound Rule 1: SSH (`22`) from your IP.
   - Inbound Rule 2: HTTP (`80`) from Anywhere (`0.0.0.0/0`).
   - Inbound Rule 3: Custom TCP (`8080`) from Anywhere (`0.0.0.0/0`).

### Step 3: Install Java 17 on EC2
Connect to your EC2 instance via SSH:
```bash
ssh -i your-key.pem ubuntu@<EC2-PUBLIC-IP>
```
Update packages and install OpenJDK 17:
```bash
sudo apt update && sudo apt upgrade -y
sudo apt install openjdk-17-jre-headless -y
java -version
```

### Step 4: Deploy the Application JAR
Build the standalone executable JAR locally:
```powershell
mvn clean package -DskipTests
```
Copy the JAR from your computer to EC2 using `scp`:
```bash
scp -i your-key.pem target/blood-donor-finder-system-1.0.0.jar ubuntu@<EC2-PUBLIC-IP>:~/app.jar
```

### Step 5: Run as a Systemd Service
On your EC2 terminal, create a background service file:
```bash
sudo nano /etc/systemd/system/bloodfinder.service
```
Paste the following service definition (substituting your RDS endpoint and passwords):
```ini
[Unit]
Description=Blood Donor Finder System Spring Boot Service
After=syslog.target network.target

[Service]
User=ubuntu
Environment="SPRING_DATASOURCE_URL=jdbc:mysql://<RDS-ENDPOINT>:3306/blood_donor_db?createDatabaseIfNotExist=true&useSSL=false&serverTimezone=UTC"
Environment="SPRING_DATASOURCE_USERNAME=admin"
Environment="SPRING_DATASOURCE_PASSWORD=YourSecurePassword123!"
Environment="JWT_SECRET=404E635266556A586E3272357538782F413F4428472B4B6250645367566B5970"
Environment="PORT=8080"
ExecStart=/usr/bin/java -jar /home/ubuntu/app.jar
SuccessExitStatus=143
Restart=always
RestartSec=10

[Install]
WantedBy=multi-user.target
```
Reload systemd, enable and start the service:
```bash
sudo systemctl daemon-reload
sudo systemctl enable bloodfinder
sudo systemctl start bloodfinder
```
Verify logs:
```bash
sudo journalctl -u bloodfinder -f
```

The application is now live on `http://<EC2-PUBLIC-IP>:8080`!

---

## 📜 License
This project is open-source and available under the [MIT License](LICENSE).
