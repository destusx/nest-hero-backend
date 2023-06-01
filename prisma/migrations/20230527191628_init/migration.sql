-- CreateTable
CREATE TABLE "users" (
    "id" SERIAL NOT NULL,
    "email" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "heroes" (
    "id" SERIAL NOT NULL,
    "nickname" TEXT NOT NULL,
    "real_name" TEXT NOT NULL,
    "origin_description" TEXT NOT NULL,
    "superpowers" TEXT NOT NULL,
    "catch_phrase" TEXT NOT NULL,
    "images" TEXT[],
    "slug" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "userId" INTEGER NOT NULL,

    CONSTRAINT "heroes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_userFavorites" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "heroes_nickname_key" ON "heroes"("nickname");

-- CreateIndex
CREATE UNIQUE INDEX "_userFavorites_AB_unique" ON "_userFavorites"("A", "B");

-- CreateIndex
CREATE INDEX "_userFavorites_B_index" ON "_userFavorites"("B");

-- AddForeignKey
ALTER TABLE "heroes" ADD CONSTRAINT "heroes_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_userFavorites" ADD CONSTRAINT "_userFavorites_A_fkey" FOREIGN KEY ("A") REFERENCES "heroes"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_userFavorites" ADD CONSTRAINT "_userFavorites_B_fkey" FOREIGN KEY ("B") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
