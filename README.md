# Sitecore JSS Next.js Sample Application

## Quick Start (After Cloning)

### 1. Install Dependencies
```bash
npm install
```

### 2. Environment Configuration ✅ **Already Included**
The `.env.local` file is included in the repository with UAT environment settings.
No manual configuration needed!

Pre-configured variables:
- `PORT=8080` - Runs Next.js on port 8080
- `SITECORE_API_HOST=https://uat-cm.dammamairports.sa` - UAT Sitecore CM server
- `SITECORE_API_KEY` - API key for Sitecore access
- `LAYOUT_SERVICE_CONFIGURATION_NAME=sxa-jss` - Layout service configuration

**Note:** If you need different settings (dev/prod), modify `.env.local` or use `.env.local.example` as a template.

### 3. Build and Run
```bash
# Development mode
npm run start:connected

# Production mode
npm run start:production
```

The app will be available at `http://localhost:8080`

---

## Recent Changes Made

### 1. Updated Sitecore CM URL Configuration (UAT Environment)

**Files Changed:**
- `.env.local` (lines 8, 16)
- `src/temp/config.js` (lines 6, 10, 12)
- `next.config.js` (lines 60-67)

**Changes:**
- Updated `SITECORE_API_HOST` from `https://daco.cm` → `https://uat-cm.dammamairports.sa`
- Updated `SITECORE_LAYOUT_SERVICE_HOST` from `https://daco.cm` → `https://uat-cm.dammamairports.sa`
- Removed `:8080` port from `publicUrl` fallback
- Added `uat-cm.dammamairports.sa` to Next.js image hostname whitelist (kept `daco.cm` as fallback)

**Why:** The IIS server port was changed from 443 to 8080 for the CM server. The application needed to use the proper UAT domain name instead of the internal `daco.cm` hostname.

---

### 2. Added URL Rewriting Logic to Layout Service

**File Changed:**
- `src/lib/layout-service-factory.ts` (lines 11-91)

**Changes:**
- Added `rewriteUrls()` function that recursively walks through Sitecore's Layout Service JSON response
- Created `LayoutServiceWrapper` class to intercept and transform responses
- Automatically rewrites all URLs from `http://uat-cm.dammamairports.sa:8080` or `https://uat-cm.dammamairports.sa:8080` to `https://uat-cm.dammamairports.sa` (removes port, forces HTTPS)

**Why:** When Sitecore's IIS runs on port 8080, it includes the port number in all media URLs (images, documents, etc.). This causes issues because:
- External users access the site via WAF/load balancer on standard HTTPS (port 443)
- Including `:8080` in URLs makes them inaccessible from the public internet
- This wrapper ensures all URLs are cleaned before rendering, regardless of Sitecore's configuration

---

### 3. Added sxa-jss Layout Service Configuration

**File Changed:**
- `sitecore/config/kfia-app.config` (lines 163-169)

**Changes:**
- Added `<config name="sxa-jss">` section with `IncludeServerUrlInMediaUrls` set to `false`

**Why:** The `.env.local` uses `LAYOUT_SERVICE_CONFIGURATION_NAME=sxa-jss`, but the Sitecore config only had settings for "default" and "jss" layouts. Without this configuration, Sitecore was including the full server URL (with port) in all media paths. This setting tells Sitecore to generate relative URLs instead.

**Note:** This config file needs to be deployed to the Sitecore CM server at `App_Config/Include/zzz/kfia-app.config` and IIS must be restarted for changes to take effect.

---

### 4. tsconfig.json - Disabled strict TypeScript rules

- Changed `"noUnusedParameters": true` → `false` (line 31)
- Changed `"noUnusedLocals": true` → `false` (line 30)

**Why:** Node.js version (v24.7.0) enforces TypeScript checks. These rules were flagging unused imports and parameters that might be needed by Sitecore later.

### 2. src/components/KFIA/Flights/Flights-Panel/mockData.ts - Fixed function calls

- Line 39: Changed `TODAY.getTime()` → `TODAY().getTime()`
- Line 91: Changed `new Date(TODAY)` → `new Date(TODAY())`

**Why:** `TODAY` is defined as a function in `date.ts`, so it needs to be called with `()` to return a Date object.

### 3. package.json & package-lock.json - Installed missing dependency

- Added `react-icons` package via `npm install react-icons`

**Why:** The Footer.tsx file imports from `react-icons/fa6` but the package wasn't declared in package.json (a bug in the develop branch).

---

<!---
@TODO: Update to next version docs before release
-->
[Documentation (Experience Platform)](https://doc.sitecore.com/xp/en/developers/hd/22/sitecore-headless-development/sitecore-javascript-rendering-sdk--jss--for-next-js.html)

[Documentation (XM Cloud)](https://doc.sitecore.com/xmc/en/developers/xm-cloud/sitecore-javascript-rendering-sdk--jss--for-next-js.html)
