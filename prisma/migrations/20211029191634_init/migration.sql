-- CreateEnum
CREATE TYPE "HttpMethod" AS ENUM ('GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "isTemp" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MockEndpoint" (
    "id" SERIAL NOT NULL,
    "userId" TEXT NOT NULL,
    "endpointName" TEXT NOT NULL,
    "httpMethod" "HttpMethod" NOT NULL,
    "urlPath" TEXT NOT NULL,
    "httpStatus" INTEGER NOT NULL,
    "responseContentType" TEXT NOT NULL,
    "charset" TEXT NOT NULL,
    "httpHeaders" TEXT NOT NULL DEFAULT E'',
    "httpResponseBody" TEXT NOT NULL DEFAULT E'',
    "timeout" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "MockEndpoint_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "MockEndpoint" ADD CONSTRAINT "MockEndpoint_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
