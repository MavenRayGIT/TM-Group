# Deploy Notes (HubSpot CLI)

- If the watcher is running, saves can upload immediately.
- Stop the watcher before experimenting.
- Start the watcher only when ready to push a specific change.

# TM Group HubSpot Deploy Notes

- Watcher is OFF by default.
- Local saves do not deploy.
- Manual hs upload = live production change.

## Preferred deploy pattern
- Upload single files only.
- Verify in HubSpot Preview immediately.
- Rollback by re-uploading the previous version if needed.