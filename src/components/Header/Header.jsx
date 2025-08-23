import React from 'react'
import { Container, Logo, LogoutButton } from '../index'
import { Link, useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'

function Header() {
  const authStatus = useSelector((state) => state.auth.status)
  const navigate = useNavigate()

  const navItems = [
    { name: 'Home', slug: '/', active: true, icon: '' },
    { name: 'Login', slug: '/login', active: !authStatus, icon: '' },
    { name: 'Signup', slug: '/signup', active: !authStatus, icon: '' },
    { name: 'All Posts', slug: '/all-posts', active: authStatus, icon: '' },
    { name: 'Add Post', slug: '/add-post', active: authStatus, icon: '' },
  ]

  return (
    <header className="bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 shadow-xl border-b border-gray-700/50 sticky top-0 z-50">
      <Container>
        <nav className="flex items-center py-3">
          {/* Logo and App Name */}
          <Link to="/" className="flex items-center mr-8 group">
            <div className="flex items-center gap-3">
              <Logo width="45px" height="45px" />
              <div className="flex flex-col">
                <span className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent group-hover:from-blue-300 group-hover:to-purple-400 transition-all duration-300">
                  NexusBlog
                </span>
                <span className="text-xs text-gray-400 font-light -mt-1">
                  Connect • Create • Share
                </span>
              </div>
            </div>
          </Link>

          {/* Navigation Items */}
          <ul className="flex items-center ml-auto gap-3">
            {navItems.map(
              (item) =>
                item.active && (
                  <li key={item.name}>
                    <button
                      onClick={() => navigate(item.slug)}
                      className="flex items-center gap-2 px-4 py-2.5 rounded-lg text-gray-200 bg-gray-800/40 backdrop-blur-sm hover:bg-blue-600/90 hover:text-white transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-400/50 border border-gray-700/30 hover:border-blue-500/30 group/nav"
                      title={item.name}
                    >
                      <span className="text-sm">{item.icon}</span>
                      <span className="text-sm font-medium">{item.name}</span>
                    </button>
                  </li>
                )
            )}
            
            {/* Developer Button */}
            <li>
              <button
                onClick={() => navigate('/about')}
                className="flex items-center gap-2 px-4 py-2.5 rounded-lg text-white bg-gradient-to-r from-purple-600 to-indigo-600 backdrop-blur-sm hover:from-purple-700 hover:to-indigo-700 transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-purple-400/50 border border-purple-500/30 hover:border-purple-400/50 shadow-lg hover:shadow-purple-500/20"
                title="About the Developer"
              >
                <span className="text-sm">👨‍💻</span>
                <span className="text-sm font-medium">Developer</span>
              </button>
            </li>

            {/* Logout Button */}
            {authStatus && (
              <li>
                <LogoutButton />
              </li>
            )}
          </ul>
        </nav>
      </Container>
    </header>
  )
}

export default Header