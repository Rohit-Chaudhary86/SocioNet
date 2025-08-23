import React from 'react'
import { useDispatch } from 'react-redux'
import authService from '../../appwrite/auth'
import { logout } from '../../store/authSlice'

function LogoutButton() {
  const dispatch = useDispatch()

  const logoutHandler = () => {
    authService.logout().then(() => {
      dispatch(logout())
    })
  }

  return (
    <button
      onClick={logoutHandler}
      className="px-5 py-2 bg-red-500 text-white font-semibold rounded-full shadow-lg hover:bg-red-400 hover:scale-105 transition-transform duration-300 focus:outline-none focus:ring-2 focus:ring-red-300"
    >
      Logout
    </button>
  )
}

export default LogoutButton
