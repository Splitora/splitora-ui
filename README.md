# Splitora UI

A modern React.js frontend application for **Splitora** — a Splitwise clone that allows users to manage group expenses, track balances, and settle debts. This is the frontend UI that communicates with the Splitora backend REST API built using Spring Boot and MySQL.

## 🚀 Features

- **Modern React 19** with hooks and functional components
- **Vite** for lightning-fast development and building
- **Well-organized folder structure** for scalability
- **Custom hooks** for common functionality
- **Utility functions** for reusability
- **CSS custom properties** for theming
- **Responsive design** with mobile-first approach
- **ESLint** configuration for code quality
- **REST API integration** with Spring Boot backend
- **Group expense management** and debt tracking
- **Real-time balance calculations**

## 🏗️ Architecture

This project is part of the **Splitora** ecosystem:

- **Frontend**: React.js + Vite (this repository)
- **Backend**: Spring Boot + MySQL ([splitora](https://github.com/your-username/splitora))
- **Database**: MySQL for data persistence

## 📁 Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── Button/         # Button component with variants
│   │   ├── Button.jsx
│   │   ├── Button.css
│   │   └── index.js
│   └── index.js        # Component exports
├── pages/              # Page components
│   ├── Home/           # Home page
│   │   ├── Home.jsx
│   │   ├── Home.css
│   │   └── index.js
│   └── index.js        # Page exports
├── hooks/              # Custom React hooks
│   ├── useLocalStorage.js
│   ├── useDebounce.js
│   └── index.js
├── utils/              # Utility functions and constants
│   ├── helpers.js      # Common helper functions
│   ├── constants.js    # Application constants
│   └── index.js
├── styles/             # Global styles
│   └── global.css      # CSS reset and global styles
├── assets/             # Static assets (images, icons, etc.)
├── App.jsx             # Main App component
├── App.css             # App-specific styles
└── main.jsx            # Application entry point
```

## 🛠️ Prerequisites

Before running this application, ensure you have:

- **Node.js** (version 18 or higher)
- **npm** or **yarn**
- **Splitora Backend** running locally or accessible via API
- **MySQL** database (if running backend locally)

## 🚀 Getting Started

### 1. Clone the Repository

```bash
git clone <repository-url>
cd splitora-ui
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Environment Configuration

Create a `.env` file in the root directory:

```env
# API Configuration
VITE_API_BASE_URL=http://localhost:8080/api

# Optional: Environment-specific settings
VITE_APP_NAME=Splitora
VITE_APP_VERSION=1.0.0
```

### 4. Start the Development Server

```bash
npm run dev
```

The application will be available at `http://localhost:5173`

### 5. Backend Integration

Ensure the Splitora backend is running:

```bash
# If running backend locally
cd ../splitora
./mvnw spring-boot:run
```

The backend should be accessible at `http://localhost:8080`

## 📜 Available Scripts

- `npm run dev` - Start development server with hot reload
- `npm run build` - Build for production
- `npm run preview` - Preview production build locally
- `npm run lint` - Run ESLint for code quality
- `npm run lint:fix` - Fix ESLint issues automatically

## 🎨 Component Usage

### Button Component

The Button component supports multiple variants and sizes:

```jsx
import { Button } from './components';

// Primary button
<Button variant="primary" size="large">
  Add Expense
</Button>

// Secondary button
<Button variant="secondary" size="medium">
  Cancel
</Button>

// Ghost button
<Button variant="ghost" size="small">
  View Details
</Button>
```

**Variants:** `primary`, `secondary`, `ghost`
**Sizes:** `small`, `medium`, `large`

## 🔧 Custom Hooks

### useLocalStorage

Persist user preferences and settings:

```jsx
import { useLocalStorage } from './hooks';

const [userPreferences, setUserPreferences] = useLocalStorage('user_preferences', {
  theme: 'dark',
  currency: 'USD'
});
```

### useDebounce

Optimize API calls for search functionality:

```jsx
import { useDebounce } from './hooks';

const [searchTerm, setSearchTerm] = useState('');
const debouncedSearchTerm = useDebounce(searchTerm, 500);

// Use debouncedSearchTerm for API calls
```

## 🎯 Utility Functions

Common utility functions available in `src/utils/helpers.js`:

- `formatDate(date, locale)` - Format dates for display
- `capitalize(str)` - Capitalize strings
- `debounce(func, wait)` - Debounce functions
- `generateId(length)` - Generate random IDs
- `isValidEmail(email)` - Validate email addresses
- `formatCurrency(amount, currency)` - Format currency values

## 🎨 Styling

The project currently uses CSS custom properties for consistent theming. Future plans include:

- **CSS Modules** for component-scoped styling
- **Tailwind CSS** for utility-first styling
- **Styled Components** for dynamic styling

### Current CSS Variables

```css
:root {
  --primary-color: #646cff;
  --background-color: #242424;
  --text-primary: rgba(255, 255, 255, 0.87);
  --surface-color: rgba(255, 255, 255, 0.05);
  /* ... more variables */
}
```

### Utility Classes

Pre-built utility classes for common styling:

```css
.text-center    /* Text alignment */
.mt-1, .mt-2   /* Margin top */
.mb-1, .mb-2   /* Margin bottom */
.p-1, .p-2     /* Padding */
.container     /* Max-width container */
```

## 📱 Responsive Design

The application is built with a mobile-first approach:

- **Mobile**: < 768px
- **Tablet**: 768px - 1024px
- **Desktop**: > 1024px

## 🔌 API Integration

The frontend communicates with the Splitora backend API:

### Key Endpoints (planned)

- `GET /api/groups` - Fetch user's groups
- `POST /api/expenses` - Create new expense
- `GET /api/expenses` - Fetch expenses for a group
- `GET /api/balances` - Get user balances
- `POST /api/settlements` - Create settlement

### API Configuration

API base URL is configured via environment variables:

```javascript
// src/utils/constants.js
export const API_BASE_URL = process.env.VITE_API_BASE_URL || 'http://localhost:8080/api';
```

## 🔍 Code Quality

- **ESLint** configuration with React-specific rules
- **React Hooks** linting rules
- **Accessibility** best practices
- **Consistent code formatting**

## 🚀 Deployment

### Build for Production

```bash
npm run build
```

The built files will be in the `dist/` directory.

### Environment Variables for Production

Set the following environment variables for production:

```env
VITE_API_BASE_URL=https://your-api-domain.com/api
VITE_APP_NAME=Splitora
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines

- Follow React best practices
- Use functional components with hooks
- Write clean, readable code
- Add comments for complex logic
- Test your changes thoroughly

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

- **Issues**: Open an issue in the repository
- **Documentation**: Check the [Splitora Backend](https://github.com/your-username/splitora) for API documentation
- **Discussions**: Use GitHub Discussions for questions and ideas

## 🔗 Related Projects

- **[Splitora Backend](https://github.com/your-username/splitora)** - Spring Boot REST API
- **[Splitora Mobile](https://github.com/your-username/splitora-mobile)** - React Native mobile app (planned)

---

**Splitora** - Making group expenses simple and fair! 💰
