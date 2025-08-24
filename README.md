NexusBlog

A modern blogging platform built with React, Appwrite, and Tailwind CSS.
NexusBlog allows users to register, log in, and publish their own blog posts with images and metadata.
It focuses on simplicity, responsiveness, and developer-friendly structure.

✨ Features

Authentication – Secure login, signup, and logout via Appwrite
# NexusBlog

![NexusBlog](https://img.shields.io/badge/React-18.3.1-blue) ![Appwrite](https://img.shields.io/badge/Appwrite-Backend-green) ![Tailwind CSS](https://img.shields.io/badge/Tailwind-CSS-38B2AC) ![License](https://img.shields.io/badge/License-MIT-yellow)

A modern, full-stack blogging platform built with React, Appwrite, and Tailwind CSS. NexusBlog empowers users to register, authenticate, and publish content with rich media support and metadata.

## ✨ Features

- **🔐 Authentication System** - Secure user registration, login, and logout powered by Appwrite
- **📝 Content Management** - Create, edit, and delete blog posts (author-restricted permissions)
- **🖼️ Media Support** - Upload and display featured images with Appwrite Storage
- **📊 Metadata Management** - Comprehensive post details including descriptions, creation dates, and author information
- **📱 Responsive Design** - Optimized experience across all devices with Tailwind CSS
- **🔔 Real-time Notifications** - User feedback system with React Toastify
- **⚡ Performance Optimized** - Built with Vite for fast development and production builds

## 🛠️ Tech Stack

| Layer | Technology |
|-------|------------|
| **Frontend Framework** | React 18.3.1 |
| **Build Tool** | Vite |
| **Styling** | Tailwind CSS |
| **Backend Services** | Appwrite (Database, Auth, Storage) |
| **Routing** | React Router DOM |
| **Notifications** | React Toastify |
| **CSS Processing** | PostCSS, Autoprefixer |



## 🚀 Quick Start

### Prerequisites

- Node.js 16.0 or higher
- npm or yarn package manager
- Appwrite instance (local or cloud)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/nexusblog.git
   cd nexusblog
Install dependencies

bash
npm install
Configure Environment Variables

Create a .env file in the root directory with the following variables:

env
VITE_APPWRITE_ENDPOINT=https://cloud.appwrite.io/v1
VITE_APPWRITE_PROJECT_ID=your-project-id
VITE_APPWRITE_DATABASE_ID=your-database-id
VITE_APPWRITE_COLLECTION_ID=your-collection-id
VITE_APPWRITE_BUCKET_ID=your-bucket-id
Set Up Appwrite

Create a new Appwrite project

Set up a Database with a posts collection

Add the following attributes to your collection:

title (string, required)

content (string, required)

featuredImage (string, file ID reference)

metaDescription (string)

author (string, user ID reference)

createdAt (datetime)

Create a Storage bucket for images with read/write permissions

Configure authentication providers in Appwrite Console

Start the development server

bash
npm run dev
Build for production

bash
npm run build
📖 Usage Guide
For Readers
Browse published blog posts on the homepage

View individual posts with full content and metadata

Responsive design ensures optimal reading experience on any device

For Authors
Register or login to your account

Access the dashboard to manage your content

Create new posts with the rich editor

Upload featured images to enhance your content

Edit or delete your existing posts

For Administrators
Manage all content through the Appwrite console

Monitor user activity and engagement

Moderate content as needed

🔧 Configuration
Tailwind Customization
Edit tailwind.config.js to customize the design system:

js
module.exports = {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        'nexus-primary': '#your-color',
        'nexus-secondary': '#your-color',
      },
    },
  },
  plugins: [],
}
Appwrite Setup Details
For detailed instructions on setting up Appwrite, refer to the Appwrite Documentation.

🤝 Contributing
We welcome contributions to NexusBlog! Please follow these steps:

Fork the project repository

Create a feature branch (git checkout -b feature/amazing-feature)

Commit your changes (git commit -m 'Add amazing feature')

Push to the branch (git push origin feature/amazing-feature)

Open a Pull Request

Development Guidelines
Follow React best practices and hooks conventions

Maintain responsive design principles

Ensure all functionality works across modern browsers

Write clear commit messages following conventional commits standard

📄 License
This project is licensed under the MIT License - see the LICENSE file for details.

🆘 Support
If you encounter any issues:

Check the Appwrite Documentation

Search existing GitHub Issues

Create a new issue with detailed information about the problem

🙏 Acknowledgments
Appwrite for the excellent BaaS platform

Tailwind CSS for the utility-first CSS framework

React Team for the powerful UI library

Vite for the fast build tooling

<div align="center"> Made with ❤️ by the Rohit Dev  </div> ```
Blog Management – Create, edit, and delete posts (restricted to authors)

Media Support – Upload and display featured images

Metadata – Store description, creation date, and author details

Responsive UI – Optimized for desktop and mobile

Notifications – Real-time feedback with React Toastify

🛠️ Tech Stack

Frontend: React (with Vite)

Styling: Tailwind CSS

Backend & Auth: Appwrite

Routing: React Router DOM

Notifications: React Toastify

📦 Dependencies
"dependencies": {
  "appwrite": "^14.0.1",
  "react": "^18.3.1",
  "react-dom": "^18.3.1",
  "react-router-dom": "^6.27.0",
  "react-toastify": "^10.0.6"
},
"devDependencies": {
  "@vitejs/plugin-react": "^4.3.2",
  "autoprefixer": "^10.4.20",
  "postcss": "^8.4.47",
  "tailwindcss": "^3.4.10",
  "vite": "^5.4.2"
}

⚙️ Installation

Clone the repository

git clone https://github.com/your-username/nexusblog.git
cd nexusblog


Install dependencies

npm install


Configure Appwrite

Create a new project in Appwrite
.

Set up a Database with a posts collection.

Add required attributes:

title (string)

featuredImage (file/string)

metaDescription (string)

author (string/userId reference)

Create a Storage bucket for images.

Update your environment variables (.env) with Appwrite project details:

VITE_APPWRITE_ENDPOINT=your-appwrite-endpoint
VITE_APPWRITE_PROJECT_ID=your-project-id
VITE_APPWRITE_DATABASE_ID=your-database-id
VITE_APPWRITE_COLLECTION_ID=your-collection-id
VITE_APPWRITE_BUCKET_ID=your-bucket-id


Run the development server

npm run dev



🤝 Contributing

Contributions are welcome!

Fork the repository

Create a new branch (feature/your-feature)

Commit changes

Open a pull request
