

## Plan: Set Default Shipping Fee to 0

Change the initial form state in `src/pages/admin/SettingsPage.tsx` so `shipping_fee` defaults to `"0"` instead of `"5.99"`.

### File: `src/pages/admin/SettingsPage.tsx`
- Line ~30: Change `shipping_fee: "5.99"` → `shipping_fee: "0"`

This only affects the UI default before data loads from the database. The database default remains `5.99` but since settings are already saved, the loaded value will take precedence.

