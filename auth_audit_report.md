# Authentication Architecture Audit Report

THIS IS AN AUDIT/INSPECTION TASK ONLY. No authentication changes have been implemented.

# 1. AUTHENTICATION PAGE STATUS

| Flow | File | Route | Current Backend | Current Auth | Status |
|------|------|-------|-----------------|--------------|--------|
| Student Login | `src/app/login/page.tsx` | `/login` | Not Connected | `localStorage.setItem('isLoggedIn', 'true')` | MOCK ONLY |
| Student Signup | `src/app/register/page.tsx` | `/register` | Not Connected | `localStorage.setItem('isLoggedIn', 'true')` | MOCK ONLY |
| Coordinator Login | `src/app/coordinator/login/page.tsx` | `/coordinator/login` | Connected (`/api/auth/coordinator/login`) | Checks email exists in DB | PARTIALLY WORKING |
| Admin Login | `src/app/admin/login/page.tsx` | `/admin/login` | Connected (`/api/auth/admin/login`) | Checks email exists in DB | PARTIALLY WORKING |

# 2. BACKEND AUTH STATUS

- **Student login endpoint:** Does not exist.
- **Student signup endpoint:** Does not exist.
- **Coordinator login endpoint:** `POST /api/auth/coordinator/login` (via `coordinatorRoutes.ts` / AdminController mount) 
- **Admin login endpoint:** `POST /api/auth/admin/login` (via `adminRoutes.ts`)
- **Auth middleware:** `server/middleware/authMiddleware.ts` simply parses the string `mock-jwt-token-{id}`. No cryptography is used.
- **Token format:** `mock-jwt-token-{id}`
- **Role handling:** Derived from ID prefix. e.g., `id.startsWith('admin') ? 'admin' : 'coordinator'`.
- **User ID handling:** Extracted literally from the token suffix. Trusted immediately without verification.

# 3. DATABASE AUTH FIELDS

**Student:**
- Current fields: `name`, `enrollmentNumber`, `email`
- Password field: None
- PasswordHash field: None

**Coordinator:**
- Current fields: `name`, `email`, `department`, `role`, `avatar`
- Password field: None
- PasswordHash field: None

**Admin:**
- Current fields: `name`, `email`, `role`
- Password field: None
- PasswordHash field: None

# 4. CURRENT AUTH FLOW

**Student:**
```
Login/Signup Page 
  → Set 'isLoggedIn' = 'true' in localStorage 
  → Redirect to /dashboard 
  → API calls generate a mock studentId via api.ts and append it.
```

**Coordinator:**
```
Coordinator Login Page 
  → POST /api/auth/coordinator/login 
  → DB Lookup (email only) 
  → Return mock-jwt-token-{id} 
  → Store coordinator_token in localStorage 
  → API calls pass token in Authorization header.
```

**Admin:**
```
Admin Login Page 
  → POST /api/auth/admin/login 
  → DB Lookup (email only) 
  → Return mock-jwt-token-{id} 
  → Store admin_token in localStorage 
  → API calls pass token in Authorization header.
```

# 5. MOCK AUTH DEPENDENCIES

- `src/services/api.ts`: Generates a fake MongoDB ObjectId (`studentId`) and stores it persistently in `localStorage` to simulate a logged-in student.
- `server/middleware/authMiddleware.ts`: Trusts any token formatted as `mock-jwt-token-...`.
- `server/services/AdminService.ts`: Returns admin profile just by querying the email.
- `server/services/CoordinatorService.ts`: Returns coordinator profile just by querying the email.
- `src/app/login/page.tsx`: Resolves via `setTimeout` instead of fetching an endpoint.
- `src/app/register/page.tsx`: Resolves via `setTimeout` instead of fetching an endpoint.

# 6. LOCAL STORAGE AUTH DEPENDENCIES

- `isLoggedIn`: Used by the student Dashboard and Navbar to conditionally render protected routes.
- `studentId`: Used by `api.ts` to attach an identity to student API requests.
- `coordinator_token`: Used by the Coordinator dashboard/API calls.
- `coordinator_data`: Stores coordinator user data on the frontend.
- `admin_token`: Used by the Admin dashboard/API calls.
- `admin_data`: Stores admin user data on the frontend.

# 7. PROTECTED ROUTES

**Student:**
- `/dashboard`
- `/my-registrations`
*(Protected on the client by checking `isLoggedIn === 'true'` on mount, redirecting to `/login` if false.)*

**Coordinator:**
- `/coordinator/dashboard`
- `/coordinator/events`
- `/coordinator/events/[id]`
*(Protected via `coordinator_token` passed to backend API calls.)*

**Admin:**
- `/admin/dashboard`
- `/admin/coordinators`
- `/admin/events`
- `/admin/events/create`
- `/admin/registrations`
*(Protected via `admin_token` passed to backend API calls.)*

# 8. AUTHORIZATION SECURITY

- **Student → Admin endpoint:** PREVENTED. Fails `requireAdminAccess` check since the fake ID does not start with 'admin'.
- **Student → Other student's registration:** ALLOWED (VULNERABLE). `registrationRoutes.ts` has absolutely no `authMiddleware`. Anyone can pass any `studentId` in the body/query.
- **Coordinator → Admin endpoint:** PREVENTED. Fails `requireAdminAccess` check.
- **Coordinator → Unassigned event:** PREVENTED. `requireCoordinatorEventAccess` correctly enforces ownership.
- **Coordinator → Coordinator assignment:** PREVENTED. Handled by Admin only routes.
- **Admin → Global resources:** ALLOWED. `requireAdminAccess` grants full access.

# 9. FILES THAT WILL NEED CHANGES

- `src/app/login/page.tsx`
- `src/app/register/page.tsx`
- `src/app/coordinator/login/page.tsx`
- `src/app/admin/login/page.tsx`
- `src/services/api.ts`
- `server/middleware/authMiddleware.ts`
- `server/controllers/AdminController.ts`
- `server/controllers/CoordinatorController.ts`
- `server/services/AdminService.ts`
- `server/services/CoordinatorService.ts`
- `server/models/Admin.ts`
- `server/models/Coordinator.ts`
- `server/models/Student.ts`
- `server/routes/registrationRoutes.ts`
- `server/routes/eventRoutes.ts`
- *(Will need to create: `StudentController.ts`, `StudentService.ts`, `studentRoutes.ts`)*

# 10. PACKAGES THAT WILL BE NEEDED

The project **DOES NOT** currently contain:
- `bcrypt` or `bcryptjs`
- `jsonwebtoken`
- `@types/jsonwebtoken`

# 11. EXISTING USERS

Existing MongoDB users (students, coordinators, admins) DO NOT have passwords or password hashes.

# 12. MIGRATION RISKS

1. **Role Identification Failure:** The current `authMiddleware` infers roles by checking if the user ID string starts with "admin". Since MongoDB ObjectIds do not start with "admin" or "coordinator", the middleware will completely fail to authorize requests when transitioned to real DB ObjectIds. The role must be embedded inside the JWT payload instead.
2. **Missing Student Endpoints:** There are currently zero backend endpoints for student login and signup.
3. **Unprotected Registration Routes:** Student registration currently relies entirely on trust from the frontend (`api.ts`). A student can pass any `studentId` in a POST payload. We must enforce that `req.user.id` is used on the backend.
4. **Existing Data Lockout:** Since existing DB users do not have passwords, they will not be able to log in after `bcrypt` is enabled unless a migration script injects default password hashes.

# 13. RECOMMENDED IMPLEMENTATION ORDER

1. Install `bcryptjs`, `jsonwebtoken`, and their types.
2. Update the Mongoose Models (`Admin`, `Coordinator`, `Student`) to include `passwordHash`.
3. Create `studentRoutes.ts`, `StudentController.ts`, and `StudentService.ts` for student signup and login logic.
4. Refactor `AdminController` and `CoordinatorController` to hash passwords and issue real JWTs upon login.
5. Refactor `authMiddleware.ts` to `jwt.verify` the token and extract `userId` and `role` securely from the payload.
6. Protect `registrationRoutes.ts` to require authentication for students.
7. Refactor frontend authentication logic to send real POST requests to auth endpoints and store valid JWTs.
8. Refactor `api.ts` to attach the standard JWT to the `Authorization` header instead of maintaining the `studentId` mock payload.
9. Seed or migrate the database with default passwords for existing mock users.
