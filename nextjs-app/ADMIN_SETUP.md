# Admin Dashboard Setup

## Setting Up an Admin User

To create or update a user to have admin access, use the following command:

```bash
npm run db:set-admin <email> <password>
```

### Example:
```bash
npm run db:set-admin admin@homeswift.com admin123
```

This will:
- Create a new admin user if the email doesn't exist
- Update an existing user to admin role if the email exists

## Access Control

- **Regular users** (role: "customer"): Can sign up, login, and make bookings. Redirected to home page after login.
- **Admin users** (role: "admin"): Can access the admin dashboard at `/admin`. Redirected to admin dashboard after login.

## Security

- The admin dashboard is protected and will redirect non-admin users to the home page
- Non-authenticated users trying to access `/admin` will be redirected to the login page
- Admin status is checked on page load and redirects unauthorized users

