# Deployment Rules (HubSpot)

- `hs cms watch` is NOT used.
- All changes are manual and intentional.
- Files are uploaded individually using `hs cms upload <local_file> <destination_path>`.
- Whenever Codex edits a file, Codex must provide the exact `hs cms upload <local_file> <destination_path>` command(s) in the response.
- After a successful upload, changes MUST be committed to git.
- Commit messages should describe the deploy (ex: "Deploy: blog tag dropdown").

## Typical Flow
1. Edit files locally
2. Verify with preview if applicable
3. `hs cms upload <local_file> <destination_path>`
4. Confirm live
5. `git commit -m "Deploy: <description>"`
