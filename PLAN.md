# 🎯 Task Plan: Master State Audit & Alignment (cgu_master focus)

## 🛡️ Standing Protocol (Operationalized from Perpetual Iteration Plan)
*These must be verified before any code is written or commands are run.*

### 1. Prime Directive Check
- [ ] **Smallest Coherent Change:** Is this the absolute minimum change required?
- [ ] **Reviewability:** Is this slice small enough for a quick, single-pass PR?
- [ ] **Validation:** Have I identified the correct `npm` validation commands for this repo?

### 2. Ownership & Boundary Check
*Verify the target file/logic belongs to the correct repository.*
- [ ] **`sh_hub`**: Canonical project/client/commercial/orchestration/registry truth.
- [ ] **`seanhalls_online`**: Public presentation, Firebase admin, CRM, invoice review, client portal.
- [ ] **`cgu_master`**: CGU public/admin/release experience and source work module.
- [ ] **`appreesh_master`**: APPREESH web and Anchor/Solana program work.
- [ ] **`seanhalls_master`**: (Projection scaffold only - avoid canonical changes here).

### 3. Pre-flight Data Reading
- [ ] `sh_hub/docs/MASTER_STATE.md` (Current global state)
- [ ] `sh_hub/docs/source-of-truth-map.md` (Mapping of ownership)
- [ ] `sh_hub/config/workspace.json` (Project/Client registry)
- [ ] `sh_hub/connectors/catalog.json` (Connector permissions)
- [ ] Target repo `README.md` & `agents.md`/`AGENTS.md`

### 4. Hard Stop Conditions (If any apply, STOP and ask for review)
- [ ] Production deployment or new production dependency required.
- [ ] Missing secret, wallet, private key, or Firebase service account.
- [ ] Operation changes custody, token distribution, or program authority.
- [ ] Ambiguous business decision (pricing, eligibility, contract terms).
- [ ] Validation failure requires a broad, non-local refactor.

---

## 🚀 Active Task: Master State Audit & Alignment (cgu_master focus)

### 📋 Granular Steps
*Break the task into tiny, single-turn chunks. Mark as [x] when done.*

- [ ] **Step 1: Audit `cgu_master` metadata.** Verify `package.json` scripts and directory structure align with ownership descriptions.
- [ ] **Step 2: Audit `cgu_master` Firebase config.** Verify `firestore.rules` and `storage.rules` align with descriptions of admin/public boundaries.
- [ ] **Step 3: Audit `cgu_master` scripts/validation.** Confirm the `test:intake` and `sync:work-module` scripts are correctly represented in the audit.
- [ ] **Step 4: Update `sh_hub/docs/MASTER_STATE.md`.** Update the audit date and refine `Current Status` or `Data Flow` for `cgu_master` sections if drift is found.

### 🧪 Verification Plan
- [ ] **Command(s) to run:** `npm run build` in `cgu_master` (to ensure no breakage from doc changes, though unlikely).
- [ ] **Expected outcome:** `MASTER_STATE.md` reflects the current audit date (`2026-09-20`) and accurate repository state.
