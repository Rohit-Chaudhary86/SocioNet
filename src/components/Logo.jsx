// Logo.jsx - Always rounded version
import React from 'react'
import logo from "../assets/logo.png"

function Logo({ width = '100px', height = 'auto' }) {
  return (
    <img
      src={logo}
      alt="App Logo"
      style={{ width, height }}
      className="object-contain rounded-2xl"
    />
  )
}

export default Logo