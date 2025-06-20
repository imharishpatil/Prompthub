#!/bin/sh
npx prisma migrate deploy
node build/index.js