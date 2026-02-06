# 🚀 HackSter 

HackSter is a **full-stack MERN web application** built using **React (Vite)** that brings **hackathon organizers and participants** together on a single platform.
It provides role-based access, team collaboration, team communication, and secure participation in hackathons.

## ✨ Features

### 🔐 Authentication & Authorization
- User registration & login
- JWT-based authentication
- Role-based access control:
    - **Admin (Organizers)**
    - **Users (Builders)**

---

### 🏆 Hackathon Management
- Browse upcoming hackathons
- View hackathon details
- Admin-only controls:
  - Create hackathons
  - Update hackathons
  - Delete hackathons
- View hackathons created or joined by the user

---

### 👥 Team Management
- Create teams for hackathons
- Join recruiting teams
- Send and manage join requests
- Leave teams
- Remove team members
- Update or delete teams
- View personal team details

---

### 💬 Team Communication
- Secure team-based chat
- Messages visible only to authenticated team members

---

### 👤 User Profiles
- View and update your profile
- View public profiles of other users

---

## 🧑‍💻 User Roles

### 👑 Organizers (Admins)
- Create, update, and delete hackathons
- Browse hackathons
- Create and join teams
- Manage hackathon events

### 🛠️ Builders (Users)
- Browse hackathons
- Create teams
- Join teams
- Participate in hackathons
- Collaborate with team members

--- 

## 🛣️ API Routes

### 🔑 Authentication
```
POST /api/auth/register
POST /api/auth/login
```

---

### 🏆 Hackathons
```
GET /api/hackathons
POST /api/hackathons (Admin only)
GET /api/hackathons/my-events
GET /api/hackathons/:id
PUT /api/hackathons/:id (Admin only)
DELETE /api/hackathons/:id (Admin only)
```

---

### 👥 Teams
```
GET /api/teams
POST /api/teams
GET /api/teams/my-team
GET /api/teams/:id
PUT /api/teams/:id
DELETE /api/teams/:id
POST /api/teams/:id/request
POST /api/teams/:id/manage-request
POST /api/teams/:id/leave
DELETE /api/teams/:id/remove/:userId
```

---

### 💬 Messages
```
GET /api/messages/:teamId
```

---

### 👤 Users
```
GET /api/users/profile
PUT /api/users/profile
GET /api/users/:id
```

---

## Tech Stack

### Frontend
- React(Vite)
- Tailwind CSS
- Redux Toolkit
- React Router
- Framer Motion

### Backend
- Node.js
- Express.js
- MongoDB
- JWT Authentication
- Socket.io

## Deployed Website Link 
https://hackster-mp4o.onrender.com/



