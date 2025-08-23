import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css';
import { Provider } from 'react-redux';
import store from './store/store.js';
import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import Home from './pages/Home.jsx';
import { AuthLayout, Login } from './components/index.js';
import AddPost from './pages/AddPost';
import Signup from './pages/SignUp';
import EditPost from './pages/EditPost';
import Post from './pages/Post';
import AllPosts from './pages/AllPosts';
import About from './pages/About.jsx';

const ErrorPage = ({ error }) => (
  <div className="p-4">
    <h1 className="text-2xl font-bold text-red-500">Something went wrong</h1>
    <p>{error?.message || "An unexpected error occurred. Please try again."}</p>
    <button
      onClick={() => window.location.reload()}
      className="mt-4 px-4 py-2 bg-blue-500 text-white rounded"
    >
      Refresh Page
    </button>
  </div>
);

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    errorElement: <ErrorPage />,
    children: [
      {
        path: '/',
        element: <Home />,
        errorElement: <ErrorPage />,
      },
      {
        path: '/login',
        element: (
          <AuthLayout authentication={false}>
            <Login />
          </AuthLayout>
        ),
        errorElement: <ErrorPage />,
      },
      {
        path: '/signup',
        element: (
          <AuthLayout authentication={false}>
            <Signup />
          </AuthLayout>
        ),
        errorElement: <ErrorPage />,
      },
      {
        path: '/all-posts',
        element: (
          <AuthLayout authentication>
            <AllPosts />
          </AuthLayout>
        ),
        errorElement: <ErrorPage />,
      },
      {
        path: '/add-post',
        element: (
          <AuthLayout authentication>
            <AddPost />
          </AuthLayout>
        ),
        errorElement: <ErrorPage />,
      },
      {
        path: '/edit-post/:slug',
        element: (
          <AuthLayout authentication>
            <EditPost />
          </AuthLayout>
        ),
        errorElement: <ErrorPage />,
      },
      {
        path: '/post/:slug',
        element: <Post />,
        errorElement: <ErrorPage />,
      },
      // Add this to your router configuration:
      {
       path: '/about',
       element: <About />,
       errorElement: <ErrorPage />,
      },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById('root')).render(
  //<React.StrictMode>
    <Provider store={store}>
      <RouterProvider router={router} />
    </Provider>
  //</React.StrictMode>
);