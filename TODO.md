# TODO: Fix TanStack Query and API Route Errors

## Step 1: Fix authUser Query Errors
- [x] Update `frontend/src/main.jsx` to add a default queryFn for ["authUser"] queries.
- [x] Update `frontend/src/App.jsx` to remove the explicit queryFn since the default will handle it.

## Step 2: Fix 404 Error for /api/posts/all
- [x] Update `frontend/src/components/common/Posts.jsx` to change "/api/posts/all" to "/api/post/all" and "/api/posts/following" to "/api/post/following".

## Step 3: Test the Fixes
- [ ] Run the backend server (npm run dev in backend directory).
- [ ] Run the frontend server (npm run dev in frontend directory).
- [ ] Check browser console for errors; verify authUser data loads and posts fetch successfully.
