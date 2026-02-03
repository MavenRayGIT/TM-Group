> Codex: You must read this file and ARCHITECTURE.md before performing any task in this repo.

PROJECT: TM Group HubSpot CMS

IMPORTANT CONTEXT
This repository is a HubSpot CMS theme using HubL.
It is NOT WordPress, NOT FOLEO, and NOT a multisite system.

RULES
- Treat this as a HubSpot CMS theme only.
- Use HubL syntax where applicable.
- Do not reference FOLEO concepts, files, or architecture.
- Do not introduce WordPress concepts, PHP, or multisite logic.
- Do not refactor unless explicitly asked.
- Prefer smallest possible change.

STRUCTURE
- Global layout: templates/layouts/
- Templates: templates/
- Modules: modules/
- Global CSS: css/
- Global JS: js/

WORKING STYLE
- Provide file paths and exact line ranges for edits.
- Do not output raw code unless explicitly requested.
- Assume changes are deployed via HubSpot CLI watch.
- Validate success by HubSpot Preview, not VS Code linting.

SOURCE OF TRUTH
- HubSpot Preview rendering is authoritative.
- VS Code syntax warnings are non-authoritative.


# Codex Ground Rules, TM Group HubSpot Theme (Production)

## Context
This repository is a HubSpot CMS theme. Changes made here can be deployed to a live production website.
Local saves may upload immediately when the HubSpot CLI watcher is running.

## Critical Safety Rule
Assume all changes are production-impacting unless explicitly stated otherwise.

## Deployment Behavior
- If `hs cms watch` is running, saving a file can upload to HubSpot immediately.
- If the watcher is stopped, changes remain local only.

## What is Allowed Without Approval
Codex may proceed without approval ONLY for small, low-risk changes, such as:
- Copy edits, text fixes, link fixes
- Minor CSS tweaks (spacing, font size, color) limited to one module or one clearly scoped selector
- Fixing a broken image reference or asset path
- Small accessibility improvements (alt text, aria-labels, heading order) that do not change layout structure
- Bug fixes that are clearly local and do not alter shared layout logic

These changes must be:
- Limited to 1 to 2 files
- Minimal diff, minimal surface area
- Reversible in a single revert

## What Requires Explicit Approval Before Any Changes Are Written
Codex must STOP and request approval before editing if any of the following are involved:
- Editing `templates/layouts/*` or any base layout file that affects many pages
- Any refactor (moving files, renaming, reorganizing folders)
- Any change affecting multiple modules or multiple templates
- Any change to global CSS architecture (new global reset, new framework, sweeping selector changes)
- Any change to global JS behavior (new listeners, new dependencies, major logic changes)
- Any deletion of files
- Any change that could affect navigation, header, footer, forms, tracking, or analytics
- Any change that cannot be validated quickly in HubSpot Preview

Approval means Jon explicitly says: "Approved, make that change."

## Required Output Format for Every Task
Codex must always provide:
1) Proposed change summary (1 to 3 bullets)
2) Exact files to touch
3) Exact line ranges to change (or a reliable search string if line numbers are unstable)
4) Risk rating: Low, Medium, High
5) Verification checklist (what Jon should preview in HubSpot)

## Workflow Rule
- Prefer a "propose first" approach.
- For anything beyond the Allowed list, propose the change and wait for approval.
- Never perform broad cleanup just because lint warnings exist. HubL linting is not authoritative.

## Source of Truth
- HubSpot Preview rendering is authoritative.
- VS Code lint warnings are not authoritative for HubL.

## Do Not Do
- Do not introduce WordPress or FOLEO concepts.
- Do not add new dependencies without approval.
- Do not reformat large HubL blocks.
- Do not change file structure without approval.

