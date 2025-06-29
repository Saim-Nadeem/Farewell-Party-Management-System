🎉 Farewell Party Management System

[![Tech Stack](https://img.shields.io/badge/Frontend-HTML%2FCSS-blue)]()
[![Backend](https://img.shields.io/badge/Backend-Node.js-green)]()
[![Database](https://img.shields.io/badge/Database-MySQL-orange)]()
[![License](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

An interactive, role-based web platform designed to streamline the planning and management of a university farewell party.
Built for students and teachers, this system enables collaborative decision-making, attendance tracking, budget management, and more — all in one place.

---

## 🖼️ UI Preview

![Dashboard](https://github.com/Saim-Nadeem/Farewell-Party-Management-System/assets/137045037/a573ff70-bd8b-41b6-8da4-df073d1eab70)
![Login](https://github.com/Saim-Nadeem/Farewell-Party-Management-System/assets/137045037/a2efd949-9eac-49dc-9816-389293329a3b)
![Voting](https://github.com/Saim-Nadeem/Farewell-Party-Management-System/assets/137045037/5aaae153-5e3d-4cb4-a1f3-56fe4b5e3058)
![Reports](https://github.com/Saim-Nadeem/Farewell-Party-Management-System/assets/137045037/ed651fb4-1528-4be5-9711-d66c02e0ae26)
![Menu](https://github.com/Saim-Nadeem/Farewell-Party-Management-System/assets/137045037/43e9d62d-7da6-4982-91e3-857dad7ed8d0)
![Tracking](https://github.com/Saim-Nadeem/Farewell-Party-Management-System/assets/137045037/55874666-d78e-4dfb-bfe0-09d77d088d81)
![Members](https://github.com/Saim-Nadeem/Farewell-Party-Management-System/assets/137045037/88d2df7c-b6de-4aa9-9adc-1d910c3c210c)
![Invite](https://github.com/Saim-Nadeem/Farewell-Party-Management-System/assets/137045037/0cc87dfa-e800-43c8-9e93-0e923bb510b2)

---

## 💡 Project Description

The **Farewell Party Management System** is a full-stack application that helps streamline the event planning process for a farewell party organized by junior students for their seniors.
It features robust role-based access, collaboration tools, task management, and real-time decision support through voting and notifications.

---

## 🚀 Key Features

### 🔐 User Authentication
- Registration & login for students and teachers
- Role-specific dashboards
- Family member details (for teacher accounts)

### 🍽️ Menu Suggestion & Voting
- Students can propose dinner items
- Voting system to finalize the menu

### 🎭 Performance Proposals & Voting
- Propose performances (type, duration, notes)
- Students vote for most-anticipated shows

### 🧾 Teacher & Family Registration
- Teachers register attendees, including guests/family
- Seamless invitation handling

### 📋 Task Allocation & Progress Tracking
- Organizers assign tasks for:
  - Stage setup
  - Decoration
  - Coordination
- Track task status (Pending/In Progress/Completed)

### 🧍 Attendance Management
- Mark attendance of students, teachers & family
- Generate attendance-based reports

### 💰 Budget Tracking & Alerts
- Log expenses for:
  - Catering
  - Venue
  - Decoration
- Auto-notifications when thresholds are exceeded
- Triggers & stored procedures implemented in MySQL

### 🧑‍💼 Role-Based Use Cases
- Admins: Full access + event control
- Teachers: View reports, register family, RSVP
- Students: Vote, suggest items, volunteer for performances

### 📊 Reports & Notifications
- Dynamic report generation for:
  - Attendance
  - Voting results
  - Task completion

---

## 🧪 Tech Stack

| Layer        | Technology         |
|--------------|--------------------|
| Frontend     | HTML, CSS          |
| Backend      | Node.js, Express   |
| Database     | MySQL              |
| Authentication | Session-based login |
| Extras       | MySQL Triggers, Stored Procedures |

---

## 📂 Folder Structure

```
├── public/                  # HTML, CSS files
├── index.js                # Main backend server
├── project.sql             # Database schema, triggers
├── Report.pdf              # Project documentation
├── DB.drawio               # Database schema diagram
├── README.md               # You are here
└── .gitattributes          # Git attributes file
```

---

## ▶️ How to Run Locally

### 1️⃣ Clone the Repo
```bash
git clone https://github.com/Saim-Nadeem/Farewell-Party-Management-System.git
cd Farewell-Party-Management-System
```

### 2️⃣ Install Dependencies
```bash
npm install
```

### 3️⃣ Setup MySQL
- Create a database
- Import `project.sql`

### 4️⃣ Run the App
```bash
node index.js
```
Visit [http://localhost:3000](http://localhost:3000)

---


## 👤 Author

**Saim Nadeem**  
🔗 GitHub: [Saim-Nadeem](https://github.com/Saim-Nadeem)
