/*
  Warnings:

  - Added the required column `coverImage` to the `Service` table without a default value. This is not possible if the table is not empty.
  - Added the required column `details` to the `Service` table without a default value. This is not possible if the table is not empty.
  - Added the required column `offerPrice` to the `Service` table without a default value. This is not possible if the table is not empty.
  - Added the required column `price` to the `Service` table without a default value. This is not possible if the table is not empty.
  - Added the required column `slug` to the `Service` table without a default value. This is not possible if the table is not empty.
  - Added the required column `title` to the `Service` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userId` to the `Service` table without a default value. This is not possible if the table is not empty.

*/
-- CreateTable
CREATE TABLE "Order" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "serviceDateTime" DATETIME NOT NULL,
    "total" INTEGER NOT NULL,
    "isCompleted" BOOLEAN NOT NULL DEFAULT false,
    "address" TEXT NOT NULL,
    "is_paid" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "serviceId" INTEGER NOT NULL,
    "userId" INTEGER NOT NULL,
    CONSTRAINT "Order_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Order_serviceId_fkey" FOREIGN KEY ("serviceId") REFERENCES "Service" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Service" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "title" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "details" TEXT NOT NULL,
    "price" INTEGER NOT NULL,
    "offerPrice" INTEGER NOT NULL,
    "coverImage" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "userId" INTEGER NOT NULL,
    CONSTRAINT "Service_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Service" ("createdAt", "id", "updatedAt") SELECT "createdAt", "id", "updatedAt" FROM "Service";
DROP TABLE "Service";
ALTER TABLE "new_Service" RENAME TO "Service";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
