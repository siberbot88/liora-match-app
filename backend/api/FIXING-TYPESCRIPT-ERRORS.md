# Fixing TypeScript Errors in Backend

## Root Cause

The TypeScript errors occur because the **Prisma Client is out of sync** with the database schema.

When you see errors like:
- `Module '@prisma/client' has no exported member 'UserRole'`
- `Property 'firebaseUid' does not exist on type User`
- `Property 'studentProfile' does not exist on type PrismaService`

This means the Prisma Client needs to be regenerated.

## Solution

Run this command in the backend directory:

```bash
cd e:\liora\backend\api
npx prisma generate
```

This will:
1. Read the `schema.prisma` file
2. Generate TypeScript types for all models
3. Update the Prisma Client with correct types

## After Regeneration

1. **Restart TypeScript Server in VSCode:**
   - Press `Ctrl + Shift + P`
   - Type: "TypeScript: Restart TS Server"
   - Press Enter

2. **Verify:**
   - All red squiggles should disappear
   - TypeScript will recognize `UserRole`, `firebaseUid`, etc.

## When to Regenerate

Run `npx prisma generate` whenever you:
- Modify `schema.prisma`
- Add/remove models or fields
- Change relationships
- Update enums

## Quick Commands

```bash
# Generate Prisma Client
npx prisma generate

# Create migration + generate
npx prisma migrate dev --name migration_name

# View database in browser
npx prisma studio
```

---

**Status:** Running `npx prisma generate` now...
