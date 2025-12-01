# Supabase Setup Guide

Since you want to use a cloud SQL server, **Supabase** is an excellent choice. It provides a managed PostgreSQL database that works perfectly with Prisma.

## Step 1: Create a Supabase Project
1.  Go to [supabase.com](https://supabase.com) and sign in (or sign up).
2.  Click **"New Project"**.
3.  Choose your organization.
4.  Enter a **Name** (e.g., `hire-me-wonderful-ai`).
5.  Enter a strong **Database Password**.
    *   **IMPORTANT:** Save this password! You will need it for the connection string.
6.  Choose a **Region** close to you (e.g., `eu-central-1` or `us-east-1`).
7.  Click **"Create new project"**.

## Step 2: Get Connection Strings
Once the project is created (it takes a minute):
1.  Go to **Project Settings** (cog icon at the bottom left).
2.  Click on **Database** in the sidebar.
3.  Under **Connection parameters**, look for the **Connection String** section.
4.  Click on the **URI** tab.
5.  **Mode: Transaction** (Port 6543) - Use this for `DATABASE_URL`.
    *   Copy the string. It looks like: `postgres://postgres.[ref]:[password]@aws-0-[region].pooler.supabase.com:6543/postgres?pgbouncer=true`
6.  **Mode: Session** (Port 5432) - Use this for `DIRECT_URL`.
    *   Copy the string. It looks like: `postgres://postgres.[ref]:[password]@aws-0-[region].pooler.supabase.com:5432/postgres`

## Step 3: Update `.env`
I have already updated your `.env` file with placeholders. You need to replace them with the actual values.

1.  Open `.env`.
2.  Replace `[PASSWORD]` with the password you set in Step 1.
3.  Replace `[PROJECT-REF]` and `[REGION]` with the values from your connection string.
    *   *Tip: Just copy the full string from Supabase and paste it over the placeholder line.*

**Example:**
```env
DATABASE_URL="postgres://postgres.abcdefg:mypassword@aws-0-eu-central-1.pooler.supabase.com:6543/postgres?pgbouncer=true"
DIRECT_URL="postgres://postgres.abcdefg:mypassword@aws-0-eu-central-1.pooler.supabase.com:5432/postgres"
```

## Step 4: Let me know!
Once you have updated the `.env` file, let me know, and I will verify the connection and push the database schema.
