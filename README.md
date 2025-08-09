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

#### Environment Variables

Create a `.env` file in the root directory with the following variables:

```env
# API Configuration
VITE_API_BASE_URL=http://localhost:8080/api

# Development Settings
VITE_APP_ENV=development
VITE_DEBUG=true

# Production Settings (uncomment for production)
# VITE_API_BASE_URL=https://api.splitora.com/api
# VITE_APP_ENV=production
# VITE_DEBUG=false
```

#### API Service Usage

The application includes a comprehensive API service module (`src/utils/api.js`) with the following features:

- **Axios-based HTTP client** for reliable API communication
- **Authentication handling** with JWT tokens and refresh tokens
- **Automatic token refresh** - Handles expired tokens automatically
- **Automatic error handling** and timeout management
- **Request/response interceptors**
- **Type-safe API methods** for all endpoints
- **Response data extraction** - Automatically extracts data from `response.data.data` structure

```javascript
import { apiService, authAPI, groupsAPI, expensesAPI } from './utils';

// Authentication
const loginResponse = await authAPI.login({ email, password });
const userProfile = await authAPI.getProfile();

// Groups
const groups = await groupsAPI.getGroups();
const newGroup = await groupsAPI.createGroup({ name: 'Trip to Paris' });

// Expenses
const expenses = await expensesAPI.getExpenses(groupId);
const newExpense = await expensesAPI.createExpense(groupId, {
  name: 'Dinner',
  amount: 50.00,
  creditorId: userId,
  debtors: [userId1, userId2]
});

// Using React hooks for better state management
import { useAuth, useGroups, useExpenses } from './hooks';

const MyComponent = () => {
  const { login, getProfile } = useAuth();
  const { getGroups, createGroup } = useGroups();
  const { getExpenses } = useExpenses();

  const handleLogin = async () => {
    try {
      const response = await login.execute({ email, password });
      console.log('Login successful:', response);
    } catch (error) {
      console.error('Login failed:', error.message);
    }
  };

  return (
    <button onClick={handleLogin} disabled={login.loading}>
      {login.loading ? 'Signing in...' : 'Sign In'}
    </button>
  );
};
```

#### Available API Methods

**Authentication (`authAPI`):**
- `login(credentials)` - User login (stores both access and refresh tokens)
- `register(userData)` - User registration (stores both access and refresh tokens)
- `logout()` - User logout (sends refresh token to backend)
- `refreshToken()` - Manually refresh access token
- `getProfile()` - Get current user profile
- `updateProfile(profileData)` - Update user profile

**Groups (`groupsAPI`):**
- `getGroups()` - Get all user groups
- `getGroup(groupId)` - Get specific group
- `createGroup(groupData)` - Create new group
- `updateGroup(groupId, groupData)` - Update group
- `deleteGroup(groupId)` - Delete group
- `addMembers(groupId, memberIds)` - Add members to group
- `removeMember(groupId, memberId)` - Remove member from group

**Expenses (`expensesAPI`):**
- `getExpenses(groupId)` - Get group expenses
- `createExpense(groupId, expenseData)` - Create new expense
- `updateExpense(groupId, expenseId, expenseData)` - Update expense
- `deleteExpense(groupId, expenseId)` - Delete expense

**Settlements (`settlementsAPI`):**
- `getSettlements(groupId)` - Get group settlements
- `markAsPaid(groupId, settlementId)` - Mark settlement as paid

#### Response Structure

The API service automatically handles the standard response structure where successful responses are wrapped in a `data` object:

```javascript
// API Response Structure
{
  "success": true,
  "message": "Operation successful",
  "data": {
    // Actual response data here
    "id": 1,
    "name": "Group Name",
    "members": [...]
  }
}

// Error Response Structure
{
  "success": false,
  "message": "Error message",
  "error": "Detailed error information"
}
```

The service automatically extracts the `data` property from successful responses and error messages from failed responses, so you can use the API methods directly without worrying about the wrapper structure.

#### Refresh Token Functionality

The application includes automatic refresh token handling:

**Automatic Token Refresh:**
- When a 401 error occurs, the system automatically attempts to refresh the access token
- If refresh succeeds, the original request is retried automatically
- If refresh fails, the user is redirected to the login page

**Token Storage:**
- Access tokens and refresh tokens are stored in localStorage
- Both tokens are automatically managed by the API service
- Tokens are cleared on logout or refresh failure

**Proactive Token Refresh:**
- The system checks token expiration every minute
- Tokens are refreshed 5 minutes before expiration
- This prevents token expiration during user activity

**Usage Example:**
```javascript
import { useAuthState } from './hooks';

const App = () => {
  const { user, isLoading, isAuthenticated, logout } = useAuthState();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!isAuthenticated) {
    return <Login />;
  }

  return (
    <div>
      <p>Welcome, {user.username}!</p>
      <button onClick={logout}>Logout</button>
    </div>
  );
};
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
