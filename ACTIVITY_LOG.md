# Activity Log - Get It Done (GID)

This log documents all activities, system configurations, and bug fixes for the project.

---

## [2026-09-12 13:35] Project Initialization & Git Pull
- **Action**: Connected to remote repository `https://github.com/Misiryn/GID.git`.
- **Branch**: `master` (commit `b47e81e restured the folder`).
- **Target Workspace**: `/Users/shubham/Get It Done`.
- **Status**: Repository successfully cloned and verified clean.

---

## [2026-09-12 13:38] Dependency & Environment Setup
- **Action**: Installed packages using `npm ci`.
- **Environment**: Created `.env.local` containing `DATABASE_URL="file:./db.sqlite"`.
- **Database**: 
  - Ran Prisma migrations (`db/migrations/*` - 4 migrations applied).
  - SQLite database initialized at `./db.sqlite`.
  - Generated Prisma Client (`@prisma/client`).

---

## [2026-09-12 13:41] Server Startup
- **Development Server**: Blitz.js dev server started in background (`npm run dev`).
  - URL: `http://localhost:3001`
  - Status: Active / `HTTP 200 OK`
- **Database GUI**: Prisma Studio started in background (`npm run studio`).
  - URL: `http://localhost:5555`
  - Status: Active / `HTTP 200 OK`

---

## [2026-09-12 13:44] Admin Account Creation
- **Action**: Created primary administrative user using Blitz `SecurePassword` hashing and Prisma client.
- **Credentials**:
  - Email: `admin@example.com`
  - Password: `AdminPassword123!`
  - Role: `ADMIN`
- **Verification**: Verified password hash via `SecurePassword.verify`.

---

## [2026-09-12 13:48] Fix: Next.js Image Hostname Restriction (400 Error)
- **Problem**: Creating a service with an external image URL resulted in Next.js runtime error: `hostname "www.istockphoto.com" is not configured under images in your blitz.config.js`.
- **Root Cause**: `app/pages/services/[serviceId].tsx` used Next.js `<Image>` component which strictly forbids unlisted image hostnames.
- **Resolution**:
  - Replaced `<Image>` with a responsive standard `<img>` element in `[serviceId].tsx`.
  - Fixed crash on `/services/1` without restricting which image domains users can supply.

---

## [2026-09-12 14:13] Fix & Enhancement: Image URLs & Fallbacks
- **Problem**: User entered Unsplash webpage URL (`https://unsplash.com/photos/person-reaching-from-car-window-mOi4khLZuU4`) which rendered broken because it is an HTML webpage rather than a direct image file.
- **Resolution**:
  1. **Form Validation (`app/services/validation.ts`)**:
     - Added Zod refinement detecting Unsplash and iStockphoto webpage URLs, displaying a friendly prompt explaining how to copy the direct image address.
  2. **Form UX (`app/services/components/ServiceForm.tsx` & `LabeledTextField.tsx`)**:
     - Added helper text tip explaining how to copy direct image addresses.
     - Updated placeholder to show example direct image URL.
  3. **Graceful Fallback (`[serviceId].tsx` & `services/index.tsx`)**:
     - Added `onError` fallback handlers to both single service view and catalog cards.
     - Automatically renders a clean placeholder image if an image URL fails to load.
