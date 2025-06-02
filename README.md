# Contoso Council Planning Portal

A modern, responsive web application for managing planning applications and environmental permits for Contoso Council.

![React](https://img.shields.io/badge/React-18.3.1-blue)
![TypeScript](https://img.shields.io/badge/TypeScript-5.6.2-blue)
![Vite](https://img.shields.io/badge/Vite-5.4.19-purple)
![Material-UI](https://img.shields.io/badge/MUI-6.1.10-blue)

## 🏛️ About

The Contoso Council Planning Portal is a comprehensive digital platform that enables residents and businesses to:

- Submit planning applications online
- Upload supporting documents
- Track application status in real-time
- Access planning guidance and resources
- Communicate with planning officers via integrated chatbot

## ✨ Features

### 🎨 Modern UI/UX
- Clean, professional design with Material-UI components
- Fully responsive layout for desktop and mobile
- Custom logo with sophisticated styling
- Intuitive navigation and user experience

### 📋 Application Management
- Complete application submission workflow
- Document upload with drag-and-drop support
- Real-time status tracking with timeline view
- Detailed application history and notes

### 🤖 Integrated Chatbot
- AI-powered assistance for application inquiries
- Quick access to common planning questions
- Contextual help based on application status

### 🔍 Planning Resources
- "How It Works" guide for new applicants
- Planning policy information
- Environmental guidance
- Step-by-step application process

## 🚀 Getting Started

### Prerequisites
- Node.js (version 18 or higher)
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone https://github.com/nlloydjenkins/ContosoCouncil.git
cd ContosoCouncil
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser and navigate to `http://localhost:5173`

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## 🏗️ Architecture

### Tech Stack
- **Frontend Framework:** React 18 with TypeScript
- **Build Tool:** Vite
- **UI Library:** Material-UI (MUI)
- **Routing:** React Router DOM
- **State Management:** React Context API
- **Styling:** CSS-in-JS with MUI's styled system

### Project Structure
```
src/
├── components/          # Reusable UI components
│   ├── ApplicationChatbot.tsx
│   ├── ChatbotLauncher.tsx
│   ├── DocumentUploader.tsx
│   ├── Footer.tsx
│   ├── Header.tsx
│   └── Logo.tsx
├── context/            # React Context providers
│   └── AppContext.tsx
├── pages/              # Page components
│   ├── ApplicationDetails.tsx
│   ├── Home.tsx
│   ├── HowItWorks.tsx
│   ├── MyApplications.tsx
│   └── UploadDocument.tsx
├── services/           # API and data services
│   └── applicationService.ts
├── styles/             # Global styles and theme
│   ├── global.css
│   └── theme.ts
└── main.tsx           # Application entry point
```

## 📱 Features Overview

### Home Page
- Welcome message and quick actions
- Featured planning information
- Recent updates and announcements

### My Applications
- List of submitted applications
- Status indicators (Submitted, Under Review, Approved, Rejected)
- Quick access to application details
- Integrated chatbot for specific application queries

### Application Details
- Comprehensive application information
- Document attachments viewer
- Timeline of application progress
- Officer notes and feedback

### Document Upload
- Drag-and-drop file upload interface
- Multiple file format support
- Progress indicators
- File validation and error handling

### How It Works
- Step-by-step guide for new applicants
- Planning process explanation
- Requirements and guidelines
- Contact information

## 🎨 Design System

The application uses a custom Material-UI theme with:
- **Primary Colors:** Clean whites and professional grays
- **Typography:** Roboto font family
- **Components:** Consistent styling across all UI elements
- **Responsiveness:** Mobile-first design approach

## 🔮 Future Enhancements

- [ ] Real backend API integration
- [ ] User authentication and authorization
- [ ] Email notifications
- [ ] Advanced document preview
- [ ] Payment integration for application fees
- [ ] Multi-language support
- [ ] Advanced search and filtering
- [ ] Mobile app development

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👥 Team

**Contoso Council Development Team**
- Planning Department
- IT Services
- Digital Transformation Team

---

**Contoso Council** - *Planning for a Sustainable Future* 🌱
