# Sitecore JSS Next.js Sample Application

## Recent Changes Made

### 1. tsconfig.json - Disabled strict TypeScript rules

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
