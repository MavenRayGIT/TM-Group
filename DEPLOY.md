# Deployment Rules (HubSpot)

- `hs cms watch` is NOT used.
- All changes are manual and intentional.
- Files are uploaded individually using `hs upload`.
- After a successful upload, changes MUST be committed to git.
- Commit messages should describe the deploy (ex: "Deploy: blog tag dropdown").

## Typical Flow
1. Edit files locally
2. Verify with preview if applicable
3. `hs upload <file>`
4. Confirm live
5. `git commit -m "Deploy: <description>"`
