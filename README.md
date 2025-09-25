# 📌 Auth & Profile Flow (NestJS + MongoDB + Next.js)

Minimal implementation of authentication and profile flow with:

- **Backend**: NestJS + MongoDB + JWT + Cookies
- **Frontend**: Next.js (React, Tailwind)
- **Features**:
  - User registration (unique email, hashed password)
  - Login with JWT (access + refresh tokens)
  - Token refresh + logout
  - Profile (view + update first/last name)
  - Avatar upload (local `/uploads` folder, persisted via Docker volume)
  - Auth guard (`AccessTokenGuard` with Passport-JWT)

---

## 🛠️ Setup

### 1. Clone

```bash
git clone https://github.com/procorneliu/auth-profile.git
cd auth-profile
```

⚠️ Note on .env
Unlike most projects, .env is not ignored in this repo (.gitignore does not exclude it).
That’s because the variables here don’t contain truly sensitive data — they are mostly for local setup. Keeping .env in version control makes the project easier to run out-of-the-box without extra configuration.

---

### 2. Run with Docker

```bash
docker compose up --build
```

Backend: http://localhost:4000/api
Frontend: http://localhost:3001

---

### Backend Endpoints

#### Auth

- `POST /api/auth/signup` – _register new user_

- `POST api/auth/signin` – _login, sets cookies_

- `POST api/auth/logout` – _clears refresh token_

- `POST api/auth/refresh` – _rotate access token_

#### User

- `GET /api/users/me` – get current user profile (auth required)

- `PUT /api/user/:id` – update profile fields

- `POST /api/user/:id/avatar` – upload avatar

---

### Frontend (Next.js)

Register → http://localhost:3001/register

Login → http://localhost:3001/login

Profile → http://localhost:3001/profile

---

### Example curl usage

All requests require -c cookie.txt -b cookie.txt to persist cookies locally.

_About cookie.txt:
The file will be created automatically on the first login (signin request).
You don’t need to provide it manually — it just acts like a browser cookie jar between requests._

#### Register

```bash
curl -X POST http://localhost:4000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{"email":"test@test.com","password":"123456","firstName":"John","lastName":"Doe"}' \
  -c cookie.txt -b cookie.txt
```

#### Login

```bash
curl -X POST http://localhost:4000/api/auth/signin \
  -H "Content-Type: application/json" \
  -d '{"email":"test@test.com","password":"123456"}' \
  -c cookie.txt -b cookie.txt
```

#### Get Profile

```bash
curl http://localhost:4000/api/users/me \
  -c cookie.txt -b cookie.txt
```

#### Update Profile

```bash
curl -X PUT http://localhost:4000/api/user/<userId> \
  -H "Content-Type: application/json" \
  -d '{"firstName":"Jane","lastName":"Smith"}' \
  -c cookie.txt -b cookie.txt
```

#### Upload Avatar

```bash
curl -X POST http://localhost:4000/api/user/<userId>/avatar \
  -F "avatar=@./myphoto.jpg" \
  -c cookie.txt -b cookie.txt
```

The part avatar=@./myphoto.jpg has two important parts:

- avatar= → the name of the form field expected by the backend.
- @./myphoto.jpg → the @ tells curl to read a file from your computer and attach it.

The path (./myphoto.jpg) must point to a file on your local machine:

- ./myphoto.jpg → a file in the same folder where you run the command.
- /Users/you/Pictures/avatar.png → an absolute path (macOS/Linux).
- C:\Users\You\Pictures\avatar.png → for Windows (make sure to use quotes: "@C:\Users\You\Pictures\avatar.png").

---

That's it! Thank you! `:)`
