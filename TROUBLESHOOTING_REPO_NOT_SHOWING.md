# Repository Not Showing in Render - Troubleshooting

## Issue: Repository `119_Morpankh_Saree` not visible in Render Blueprint

If your repository is not showing up in the Render Blueprint interface, try these solutions:

---

## Solution 1: Re-authenticate GitHub

1. In the Blueprint page, find the **GitHub** section
2. Click **"Configure account"** (gear icon)
3. Re-authenticate with GitHub
4. **Important:** Make sure to grant Render access to:
   - ✅ All repositories (recommended)
   - ✅ Or at least your specific repository
5. Refresh the page
6. Your repository should now appear

---

## Solution 2: Use Public Repository URL

If the repository still doesn't show:

1. In the Blueprint page, look for **"Use public repository URL"** option
2. Or click **"Connect public repository"** link
3. Enter your repository URL:
   ```
   https://github.com/DualSparkStudio/119_Morpankh_Saree
   ```
4. Click **Connect**

---

## Solution 3: Check Repository Access

1. Go to [GitHub Settings](https://github.com/settings/installations)
2. Navigate to **Applications** → **Authorized OAuth Apps**
3. Find **Render** in the list
4. Click **Configure**
5. Ensure your repository is selected:
   - ✅ `DualSparkStudio/119_Morpankh_Saree`
6. Save changes
7. Go back to Render and refresh

---

## Solution 4: Manual Repository Connection

If Blueprint doesn't work:

1. Go to Render Dashboard → **New** → **Web Service**
2. Connect GitHub manually
3. Search for: `119_Morpankh_Saree`
4. Or paste the repository URL directly

---

## Solution 5: Check Repository Visibility

1. Go to your GitHub repository: `https://github.com/DualSparkStudio/119_Morpankh_Saree`
2. Check if repository is:
   - ✅ **Public** - Should work immediately
   - 🔒 **Private** - Needs proper GitHub permissions
3. If private, ensure Render has access (Solution 3)

---

## Solution 6: Use render.yaml Directly

1. Make sure `render.yaml` is in your repository root
2. Push to GitHub
3. In Render, use **"Use public repository URL"**
4. Enter: `https://github.com/DualSparkStudio/119_Morpankh_Saree`
5. Render will detect `render.yaml` automatically

---

## Quick Fix Steps

1. **Re-authenticate GitHub:**
   - Blueprint page → GitHub → "Configure account"
   - Grant full repository access
   - Refresh page

2. **Or use URL directly:**
   - Look for "Use public repository URL" option
   - Enter: `https://github.com/DualSparkStudio/119_Morpankh_Saree`

3. **Verify repository exists:**
   - Visit: `https://github.com/DualSparkStudio/119_Morpankh_Saree`
   - Make sure it's accessible

---

## Why Only 1 Repo Shows?

Render might be showing only repositories that:
- Were previously connected
- Are in a specific organization
- Have been granted explicit access

**Fix:** Re-authenticate and grant access to all repositories.

---

## Still Not Working?

1. Check GitHub repository permissions
2. Verify repository is accessible
3. Try connecting via Web Service instead of Blueprint
4. Contact Render support with repository URL

---

**Repository URL:** `https://github.com/DualSparkStudio/119_Morpankh_Saree`

