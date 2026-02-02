-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Image" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "itemId" TEXT NOT NULL,
    "filename" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "order" INTEGER NOT NULL,
    CONSTRAINT "Image_itemId_fkey" FOREIGN KEY ("itemId") REFERENCES "Item" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_Image" ("filename", "id", "itemId", "order", "url") SELECT "filename", "id", "itemId", "order", "url" FROM "Image";
DROP TABLE "Image";
ALTER TABLE "new_Image" RENAME TO "Image";
CREATE INDEX "Image_itemId_idx" ON "Image"("itemId");
CREATE TABLE "new_Prices" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "base" TEXT NOT NULL,
    "discounted" TEXT,
    "itemId" TEXT NOT NULL,
    CONSTRAINT "Prices_itemId_fkey" FOREIGN KEY ("itemId") REFERENCES "Item" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_Prices" ("base", "discounted", "id", "itemId") SELECT "base", "discounted", "id", "itemId" FROM "Prices";
DROP TABLE "Prices";
ALTER TABLE "new_Prices" RENAME TO "Prices";
CREATE UNIQUE INDEX "Prices_itemId_key" ON "Prices"("itemId");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
