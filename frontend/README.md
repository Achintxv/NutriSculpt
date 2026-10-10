# 🥗 NutriSculpt — AI-Powered Fitness & Nutrition Planner

**Your fitness goals. Your personalized plan. Your progress.**

NutriSculpt is a full-stack fitness and nutrition web application that helps users create personalized workout routines and meal plans using AI. Users can manage their fitness profiles, generate plans based on their preferences and goals, choose from previously generated plans, and manually customize individual exercises and meals.

Built with **Next.js, FastAPI, PostgreSQL, and Google Gemini AI**, NutriSculpt combines AI-powered recommendations with practical tools for managing everyday fitness routines.

---

## ✨ Features

### 🔐 Authentication & User Management
- User registration and login.
- JWT-based authentication.
- Protected API endpoints.
- User-specific profiles and fitness plans.
- Logout functionality.

### 👤 Fitness Profile Management
- Store personal fitness information, including height, weight, and age.
- Define fitness goals, activity level, and fitness experience.
- Set weekly workout frequency.
- Specify dietary preferences and food allergies.
- Update profile information as fitness goals change.

### 🏋️ AI-Powered Workout Generation
- Generate personalized workout plans using Google Gemini AI.
- Organize routines into individual training days.
- Display exercises with sets, repetitions, and duration.
- Save multiple generated workout plans.
- Select a workout plan from previously saved plans.
- Manually edit exercise names, sets, repetitions, and duration.

### 🥑 AI-Powered Meal Planning
- Generate meal plans based on fitness goals and dietary preferences.
- Display meals with calorie and macronutrient information.
- Track calories, protein, carbohydrates, and fats.
- Account for dietary preferences and allergies when generating recommendations.
- Save and select previously generated meal plans.
- Edit meal names, meal types, nutritional values, and notes.

### 📊 Fitness Dashboard
- View a personalized dashboard after logging in.
- Review fitness goals and profile information.
- See workout and meal plan statistics.
- Switch between saved workout and meal plans independently.
- View exercises, meals, calories, and nutritional information in one place.
- Generate new plans and refresh dashboard data.

### 🎨 User Interface
- Responsive dashboard layout.
- Dedicated login, registration, and profile pages.
- Consistent visual design with bold borders, bright yellow accents, and mint-green highlights.
- Interactive forms and inline editing.
- Reusable workout and meal components for maintainable frontend code.

---

## 🛠️ Tech Stack

| Technology | Purpose |
|---|---|
| Next.js (App Router) | Frontend application and page routing |
| React | Component-based user interface |
| JavaScript | Frontend application logic |
| Tailwind CSS | Responsive styling |
| Lucide React | Icons |
| FastAPI | Python backend and REST API |
| PostgreSQL | Relational database |
| SQLAlchemy | ORM and database operations |
| Alembic | Database migrations |
| Pydantic | Request validation and response schemas |
| JWT / PyJWT | Authentication tokens |
| Google Gemini AI | AI-powered fitness plan generation |

---

## 🏗️ Architecture

NutriSculpt follows a frontend–backend architecture.

```text
┌───────────────────────────────┐
│       Next.js Frontend        │
│                               │
│ Login / Registration          │
│ Fitness Profile               │
│ Dashboard                     │
│ WorkoutSection                │
│ MealSection                   │
└───────────────┬───────────────┘
                │ HTTP / JSON
                │ JWT Authentication
                ▼
┌───────────────────────────────┐
│         FastAPI Backend       │
│                               │
│ Authentication                │
│ User & Profile Management     │
│ Workout & Meal APIs            │
│ Plan Generation               │
│ Gemini AI Integration         │
└───────────┬───────────┬───────┘
            │           │
            ▼           ▼
┌──────────────────┐  ┌─────────────────┐
│   PostgreSQL     │  │  Gemini API     │
│                  │  │                 │
│ Users & Profiles │  │ AI Plan Output  │
│ Workout Plans    │  │                 │
│ Meal Plans       │  └─────────────────┘
│ Exercises & Meals│
└──────────────────┘
```

### How it works

1. A user registers and logs in.
2. The backend authenticates the user and issues a JWT access token.
3. The user creates or updates their fitness profile.
4. The frontend requests a personalized plan from the backend.
5. The backend uses Gemini AI to generate workout and meal recommendations.
6. The generated plans and their related records are stored in PostgreSQL.
7. The dashboard fetches the user's saved plans and displays the selected workout and meal plan.
8. Users can switch between saved plans and edit exercises or meals through API requests.

---

## 📁 Project Structure

The project is organized into separate frontend and backend applications.

```text
NutriSculpt/
│
├── frontend/
│   ├── src/
│   │   ├── app/
│   │   │   ├── login/
│   │   │   │   └── page.jsx
│   │   │   ├── register/
│   │   │   │   └── page.jsx
│   │   │   ├── dashboard/
│   │   │   │   ├── page.jsx
│   │   │   │   ├── WorkoutSection.jsx
│   │   │   │   └── MealSection.jsx
│   │   │   ├── profile/
│   │   │   │   └── page.jsx
│   │   │   ├── globals.css
│   │   │   └── layout.jsx
│   │   └── lib/
│   │       └── api.js
│   ├── public/
│   ├── package.json
│   └── ...
│
├── backend/
│   ├── app/
│   │   ├── main.py
│   │   ├── routers/
│   │   │   ├── users.py
│   │   │   ├── auth.py
│   │   │   ├── profiles.py
│   │   │   ├── workouts.py
│   │   │   ├── meals.py
│   │   │   └── plans.py
│   │   ├── models/
│   │   ├── schemas/
│   │   └── ...
│   ├── alembic/
│   ├── alembic.ini
│   ├── requirements.txt
│   └── ...
│
├── .gitignore
└── README.md
```

*Note: The structure above is representative. Keep the file and folder names aligned with your actual repository.*

---

## ⚙️ Getting Started

### Prerequisites

Install the following before running the project:

- Node.js and npm
- Python 3.10 or a version supported by your backend dependencies
- PostgreSQL
- A Google Gemini API key

### 1. Clone the repository

```bash
git clone <YOUR_REPOSITORY_URL>
cd NutriSculpt
```

Replace the repository URL with your Git repository URL.

### 2. Configure the backend

Navigate to the backend directory:

```bash
cd backend
```

Create a virtual environment:

```bash
python -m venv venv
```

Activate it on Windows:

```bash
venv\Scripts\activate
```

Install dependencies:

```bash
pip install -r requirements.txt
```

If the project does not yet have a complete `requirements.txt`, install the dependencies recorded in your actual backend setup before proceeding.

### 3. Configure environment variables

Create a `.env` file in the backend directory. Use the names expected by your application's configuration.

Example:

```env
DATABASE_URL=postgresql://<DB_USER>:<DB_PASSWORD>@localhost:5432/<DB_NAME>
JWT_SECRET_KEY=<YOUR_RANDOM_SECRET>
JWT_ALGORITHM=<YOUR_ALGORITHM>
JWT_ACCESS_TOKEN_EXPIRE_MINUTES=<MINUTES_IN_NUMBER>
GEMINI_API_KEY=<YOUR_GEMINI_API_KEY>
```

Replace the placeholders with your actual configuration. Do not commit real secrets to version control.

### 4. Create the database

Create a PostgreSQL database for NutriSculpt, then verify that `DATABASE_URL` points to it.

Apply the database migrations:

```bash
alembic upgrade head
```

Run this command from the directory containing `alembic.ini`, using the activated virtual environment.

### 5. Start the backend

From the backend directory:

```bash
uvicorn app.main:app --reload
```

The backend should be available at:

```text
http://localhost:8000
```

FastAPI's interactive API documentation is available at:

```text
http://localhost:8000/docs
```

Use the documentation to inspect the actual registered routes and test API requests.

### 6. Configure the frontend

Open a second terminal:

```bash
cd frontend
npm install
```

Ensure the frontend API helper points to the backend address. For local development, the API base URL is typically:

```text
http://localhost:8000
```

If your application reads the URL from an environment variable, configure the corresponding variable in the frontend environment file instead.

### 7. Start the frontend

```bash
npm run dev
```

Open:

```text
http://localhost:3000
```

Register a user, log in, configure the fitness profile, and start generating plans.

---

## 🔑 Main Application Flows

### Registration and authentication

- Register a new account.
- Authenticate using the login form.
- Store and attach the access token to authenticated API requests.
- Access protected profile and plan endpoints.
- Log out to clear the local authentication state.

### Profile setup

Users provide the information needed to personalize recommendations, including their fitness goals, activity level, experience, weekly workout frequency, and dietary preferences.

### Plan generation

The frontend sends a generation request to FastAPI. The backend uses the user's profile and AI integration to generate a workout plan and meal plan, then persists the resulting data.

### Selecting saved plans

The dashboard allows users to choose a workout plan and a meal plan independently. The selected plans determine which exercises, meals, and calorie information appear on the dashboard.

### Editing plans

Users can edit individual exercises and meals through inline forms. The frontend sends update requests to the backend and reloads the saved plans to reflect the changes.

---

## 🧩 Development Challenges & Solutions

Building NutriSculpt involved debugging issues across the frontend, backend, database, authentication, and AI integration.

The following documents the main issues encountered during development and the approaches used to resolve them.

## ⚠️ Potential Improvements & Issues to Address

These are not necessarily bugs encountered during development. They are areas worth reviewing before deploying NutriSculpt for real users.

### Security
- Store secret keys and API credentials in environment variables.
- Use HTTPS in production.
- Review JWT expiry, refresh, and revocation behavior.
- Apply rate limiting to authentication and expensive AI-generation endpoints.
- Validate ownership on every update request so users cannot modify another user's plans by changing an ID.
- Consider secure, HTTP-only cookies if changing from localStorage-based token storage.

### AI reliability and nutrition accuracy
- Handle rate limits and temporary AI service failures gracefully.
- Validate AI-generated structured output before saving it.
- Avoid presenting AI-generated calorie and macro estimates as guaranteed accurate.
- Treat dietary restrictions and allergies as important constraints and validate generated results.
- Make it clear that generated fitness and nutrition suggestions are informational, not a substitute for qualified medical or dietary advice.

### Data management
- Decide whether users can archive or delete old plans.
- Define how plan deletion affects related workout days, exercises, and meals.
- Add appropriate foreign-key constraints and cascading behavior where suitable.
- Ensure plan selections persist across page reloads if that is the intended experience.
- Consider transaction handling when generating and saving workout and meal plans together.

### Performance and reliability
- Add loading, empty, and error states to all important views.
- Avoid silently redirecting to login for every API error.
- Add tests for authentication, profile creation, plan generation, and plan editing.
- Add retries with sensible limits for transient AI failures.
- Consider pagination if users accumulate many saved plans.

### Deployment
- Configure production CORS origins.
- Configure environment variables separately for development and production.
- Apply database migrations during deployment.
- Verify that the frontend and backend URLs are correct in production.
- Never commit `.env` files, access tokens, database credentials, or API keys.

---

## 🧪 Testing Checklist

Before releasing a new version, verify the following:

- [ ] A new user can register successfully.
- [ ] Existing users can log in and log out.
- [ ] Unauthenticated users cannot access protected endpoints.
- [ ] The user profile can be created, loaded, and updated.
- [ ] Workout and meal plans can be generated.
- [ ] Generated plans are saved and retrieved correctly.
- [ ] Users can switch between saved workout plans.
- [ ] Users can switch between saved meal plans.
- [ ] Exercise edits persist after refreshing the dashboard.
- [ ] Meal edits persist after refreshing the dashboard.
- [ ] API errors are displayed clearly.
- [ ] One user's data cannot be accessed or edited by another user.
- [ ] Database migrations can be applied to a clean database.
- [ ] Secrets are excluded from version control.

---

## 🚀 Future Enhancements

Potential directions for expanding NutriSculpt include:

- Persistent active-plan selection across sessions.
- Plan history, archiving, and deletion.
- Workout completion tracking and progress analytics.
- Weight and body-measurement history.
- Weekly and monthly progress visualizations.
- AI-generated plan regeneration based on user feedback.
- Exercise substitutions and equipment preferences.
- Grocery lists generated from meal plans.
- Meal logging and daily calorie tracking.
- Automated tests and continuous integration.
- Production deployment with monitoring and error reporting.

---

## 🎯 What This Project Demonstrates

NutriSculpt demonstrates practical full-stack development skills, including:

- Building a Next.js application with reusable React components.
- Designing and integrating a FastAPI REST API.
- Managing relational data with PostgreSQL and SQLAlchemy.
- Handling database schema changes with Alembic.
- Implementing JWT-based authentication.
- Validating API requests and structuring responses with Pydantic.
- Integrating a third-party generative AI service.
- Building data-driven dashboards and editable forms.
- Debugging integration problems across multiple application layers.
- Managing asynchronous API calls, loading states, and frontend refresh behavior.

---

## 👨‍💻 Author

**Achint Verma**

Built as a full-stack project exploring AI-assisted fitness planning, modern web development, and backend API engineering.

---

*NutriSculpt — Small steps. Big results.*