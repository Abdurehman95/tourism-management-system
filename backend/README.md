# Getting Started with Create React App

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Project Layout
- `frontend/` – React app (the provided UI code). Run commands from inside this folder.
- `backend/` – PHP + MySQL backend scaffold (PDO, Chapa stubs, JWT).

## Available Scripts

In the `frontend` directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

The page will reload when you make changes.\
You may also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can't go back!**

If you aren't satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you're on your own.

You don't have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn't feel obligated to use this feature. However we understand that this tool wouldn't be useful if you couldn't customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).

## Backend (PHP + MySQL)
- Location: `backend/` contains the PHP + PDO backend scaffold with REST routes for auth, users, sites, guide requests, payments (Chapa + proofs), notifications, and reviews.
- Requirements: PHP 8.1+, MySQL, Composer, Apache (with mod_rewrite) or `php -S` for local dev.
- Env vars: copy `backend/.env.example` to `backend/.env` and set `DB_HOST`, `DB_PORT`, `DB_NAME`, `DB_USER`, `DB_PASS`, `APP_URL`, `API_URL`, `CHAPA_SECRET_KEY`, `CHAPA_PUBLIC_KEY`, `JWT_SECRET`, `UPLOAD_DIR`, `MAX_UPLOAD_SIZE`.
- Setup:
	1. `cd backend`
	2. `composer install`
	3. Create the MySQL schema (run your provided SQL once)
	4. `cp .env.example .env` and update values
	5. Serve locally: `php -S localhost:8000 -t public` (or point Apache docroot to `backend/public`)
- Approval guard: `PATCH /api/requests/{id}/approve` only approves when a confirmed payment exists for that request; otherwise it returns `400` with `"Visitor has not paid or payment not verified."`
- Health check (XAMPP): `GET http://localhost:8000/api/health` should return `{status:"ok", db:"connected"}` if PHP can reach MySQL.

### Code Splitting

This section has moved here: [https://facebook.github.io/create-react-app/docs/code-splitting](https://facebook.github.io/create-react-app/docs/code-splitting)

### Analyzing the Bundle Size

This section has moved here: [https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size](https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size)

### Making a Progressive Web App

This section has moved here: [https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app](https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app)

### Advanced Configuration

This section has moved here: [https://facebook.github.io/create-react-app/docs/advanced-configuration](https://facebook.github.io/create-react-app/docs/advanced-configuration)

### Deployment

This section has moved here: [https://facebook.github.io/create-react-app/docs/deployment](https://facebook.github.io/create-react-app/docs/deployment)

### `npm run build` fails to minify

This section has moved here: [https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify](https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify)
