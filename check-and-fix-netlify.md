# Netlify Build Fix - Step by Step Instructions

## Problem
Netlify is using Yarn instead of npm and Node v22 instead of v20, causing build failures.

## Solution Steps

### Step 1: Check GitHub Repository

Go to your GitHub repository: https://github.com/changyi12345/profile

1. Check if `yarn.lock` file exists in the root directory
2. If it exists, **DELETE IT**:
   - Click on `yarn.lock` file
   - Click "Delete" button (trash icon)
   - Commit the deletion with message: "Remove yarn.lock to force npm usage"

### Step 2: Verify package-lock.json exists

Make sure `package-lock.json` is in your GitHub repository root.

### Step 3: Set Node Version in Netlify UI (CRITICAL!)

1. Go to https://app.netlify.com
2. Select your site
3. Go to: **Site settings** → **Build & deploy** → **Environment**
4. In the "Environment variables" section:
   - Click "Add a variable"
   - Key: `NODE_VERSION`
   - Value: `20`
   - Click "Save"

**This step is CRITICAL** - Netlify will use Node v22 by default unless you set this!

### Step 4: Commit and Push Current Changes

```bash
git add .
git commit -m "Fix Netlify build: configure npm and Node 20"
git push
```

### Step 5: Clear Netlify Build Cache

1. In Netlify dashboard
2. Go to: **Deploys** tab
3. Click "Trigger deploy" → **"Clear cache and deploy site"**

### Step 6: Monitor the Build

Check the build logs. You should now see:
- ✅ "Installing npm packages using npm" (not Yarn!)
- ✅ "Now using node v20.x.x" (not v22!)
- ✅ Build succeeds

## What We've Configured

✅ `package.json` - Added `packageManager: "npm@10.9.4"` field
✅ `.nvmrc` - Node version 20
✅ `.node-version` - Node version 20  
✅ `netlify.toml` - Node 20 and npm configuration
✅ `.npmrc` - npm configuration
✅ `.gitattributes` - Git attributes for package files

## If Still Not Working

1. **Double-check yarn.lock is deleted from GitHub**
2. **Verify NODE_VERSION=20 in Netlify UI Environment variables**
3. **Check build logs** - look for what Node version and package manager is being used
4. **Contact Netlify support** if the issue persists

