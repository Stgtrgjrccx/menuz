# Always Render-Deploy Ready Rule

For every change, feature addition, bug fix, or UI refinement:
1. **Render Build Integrity**:
   - Always verify that all services defined in `render.yaml` (`menuz-api`, `menuz-hq`, `menuz-customer`, and `menuz-owner`) build cleanly without type or bundling errors.
   - Run `npm run build:all` to ensure `dist-customer`, `dist-owner`, and `dist-hq` are verified.
2. **Git Synchronization**:
   - Always stage, commit, and push the changes directly to GitHub repository (`origin main`).
3. **Response Deliverable**:
   - Always present the Render 1-Click Deploy Link (`https://render.com/deploy?repo=https://github.com/Stgtrgjrccx/menuz`) and the live service URLs in the response:
     - 🏢 **Admin HQ**: `https://menuz-hq.onrender.com`
     - 🍽️ **Customer**: `https://menuz-customer.onrender.com`
     - 🧑‍🍳 **Owner / Partner**: `https://menuz-owner.onrender.com`
     - ⚡ **Sync API**: `https://menuz-api.onrender.com`
