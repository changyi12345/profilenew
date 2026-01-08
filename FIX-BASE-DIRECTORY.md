# 🔴 FIX: Base Directory Error

## Current Error
```
Base directory does not exist: /opt/build/repo/ls -la | findstr next
```

## Problem
Netlify UI မှာ **Base directory** field ကို command (`ls -la | findstr next`) ထည့်ထားတာကြောင့် error ဖြစ်နေတယ်။

## ✅ Solution - 2 Steps:

### STEP 1: Fix Netlify UI Settings

1. Go to: https://app.netlify.com
2. Click your site
3. Click **Site settings** (⚙️)
4. Click **Build & deploy** (left sidebar)
5. Scroll to **Build settings** section
6. Find **"Base directory"** field
7. **Delete everything** in that field (leave it EMPTY)
8. Click **Save**

### STEP 2: Verify netlify.toml

I've already updated `netlify.toml` to set `base = ""` (empty = root directory).

### STEP 3: Redeploy

1. Go to **Deploys** tab
2. Click **"Trigger deploy"** → **"Clear cache and deploy site"**

## What Should Be Set:

✅ **Base directory**: (EMPTY - leave blank)
✅ **Build command**: `rm -f yarn.lock && npm install --legacy-peer-deps && npm run build`
✅ **Publish directory**: `.next`

## Why This Happened

Someone tried to use a command to find the directory, but Netlify expects a path, not a command. For Next.js projects, base directory should be empty (root).

