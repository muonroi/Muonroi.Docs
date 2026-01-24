# UI Auth Admin Dashboard: Quickstart

This guide shows how to use the web UI (Angular app) with the Base Template API to manage Roles and Permissions provided by Muonroi.BuildingBlock.

## Prerequisites

- Run the Base Template API (ASP.NET Core): ensure it starts and listens at a known URL, e.g. `http://localhost:5000/`.
- In the web app, set `src/Muonroi.BuildingBlock.Web/src/environments/environment.ts`:

```
export const environment = {
    apiUrl: 'http://localhost:5000/api/v1',
};
```

## Seeded Admin Account

On first run, the API seeds a default admin user and role:

- Username: `admin`
- Email: `admin@muonroi.com`
- Password: `sysadmin`

The API also syncs permission definitions from the app provider and assigns all permissions to the `Admin` role.

## Login and Explore

1. Start the API.
2. Start the web UI and open the login page (`/auth/login`).
3. Sign in with Username `admin` and Password `sysadmin`.
4. After login, the left sidebar loads based on Menu Metadata and your granted permissions.

### Admin Screens

- Auth Admin Dashboard: `/authadmin`
  - Overview cards (roles, permission groups, total permissions)
  - Role/Permission Matrix: assign/unassign permissions per role
  - Link to Permission Definitions

- Roles Management: `/roles`
  - List, Create, Edit roles
  - Assign/unassign permissions
  - View and assign role users

## API Endpoints Used

- Auth: `/api/v1/auth/login`, `/api/v1/auth/register`, `/api/v1/auth/refresh-token`, `/api/v1/auth/logout`, `/api/v1/auth/logout-all`
- Roles: `/api/v1/auth/roles`, `/api/v1/auth/create-role`, `/api/v1/auth/update-role`, `/api/v1/auth/delete-role/{roleId}`
- Permissions: `/api/v1/auth/permission-definitions`, `/api/v1/auth/role-permissions/{roleId}`, `/api/v1/auth/assign-permission`, `/api/v1/auth/remove-permission/{roleId}/{permissionId}`
- Role users: `/api/v1/auth/role-users/{roleId}`, `/api/v1/auth/assign-role`
- Menu/Tree: `/api/v1/auth/menu-metadata/{userId}`, `/api/v1/auth/permission-tree/{userId}`

## Notes

- Ensure CORS (`MAllowDomains`) allows the web UI origin.
- The Angular refresh call should include `Authorization: Bearer <accessToken>` even when bypassing interceptors.
- By default, the Admin role has all permissions, so Auth Admin and Roles pages should appear in the menu.
- To customize groups/keys, edit `AppPermissionProvider` and restart the API to resync.
