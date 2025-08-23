import React, { useState, useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { useLocation } from 'react-router-dom'
import './App.css'
import authService from "./appwrite/auth"
import { login, logout } from "./store/authSlice"
import { Footer, Header } from './components'
import { Outlet } from 'react-router-dom'

function App() {
  const [loading, setLoading] = useState(true)
  const dispatch = useDispatch()
  const location = useLocation()

  useEffect(() => {
    authService.getCurrentUser()
      .then((userData) => {
        if (userData) {
          dispatch(login({ userData }))
        } else {
          dispatch(logout())
        }
      })
      .finally(() => setLoading(false))
  }, [])

  // Hide footer only on the All Posts page
  const shouldShowFooter = location.pathname !== '/all-posts';

  return !loading ? (
    <div className="flex flex-col min-h-screen bg-gray-400">
      {/* Header */}
      <Header />

      {/* Main content */}
      <main className="flex-grow">
        <Outlet />
      </main>

      {/* Show footer on all pages EXCEPT /all-posts */}
      {shouldShowFooter && <Footer />}
    </div>
  ) : null
}

export default App