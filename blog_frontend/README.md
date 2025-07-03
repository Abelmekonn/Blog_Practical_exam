# Blog Frontend

A modern React blog application built with TypeScript, Redux Toolkit, and Tailwind CSS using **Feature-Based Architecture**.

## 🚀 **Quick Start**

```bash
cd blog_frontend
npm install
npm run dev
# Opens http://localhost:5173
```

## 🏗️ **Architecture Overview**

### **Feature-Based Structure**
```
src/
├── features/           # Business logic by domain
│   ├── auth/          # Authentication
│   ├── posts/         # Blog posts  
│   └── comments/      # Comments
├── components/        # UI components
├── pages/            # Route components
├── store/            # Redux store
└── utils/            # Shared utilities
```

Each feature contains:
- **api/** - HTTP requests
- **store/** - Redux slice  
- **hooks/** - Custom hooks
- **types/** - TypeScript interfaces

## ✨ **Features**

- **🔐 Authentication** - Login, register, JWT tokens
- **📝 Posts** - CRUD operations, image upload, search
- **💬 Comments** - Nested comments, real-time updates
- **🎨 UI/UX** - Dark mode, responsive design, loading states
- **⚡ Performance** - Code splitting, caching, optimizations

## 🛠️ **Tech Stack**

| Category | Technology |
|----------|------------|
| **Core** | React 19, TypeScript, Vite |
| **State** | Redux Toolkit, React Redux |
| **Styling** | Tailwind CSS, CVA |
| **Forms** | React Hook Form, Zod |
| **Routing** | React Router v7 |
| **HTTP** | Axios with interceptors |
| **Testing** | Vitest, Testing Library |
| **Icons** | Lucide React |

## 📱 **Routes**

| Route | Description | Auth |
|-------|-------------|------|
| `/` | Home page | No |
| `/blog/:id` | Post detail | No |
| `/create-post` | Create post | Yes |
| `/edit-post/:id` | Edit post | Yes (Owner) |
| `/login` | Login | No |
| `/register` | Register | No |
| `/about` | About page | No |

## 🎯 **Usage Examples**

### **Posts Feature**
```typescript
const { posts, loading, loadPosts, createPost } = usePosts();

// Load posts
useEffect(() => loadPosts(), []);

// Create post
const handleCreate = (data) => createPost(data);
```

### **Authentication**
```typescript
const { user, isAuthenticated, login, logout } = useAuth();

// Login
const handleLogin = (credentials) => login(credentials);
```

## 📦 **Project Structure Deep Dive**

### **Components Organization**
- **features/** - Feature-specific UI (auth forms, post detail)
- **common/** - Reusable components (buttons, cards, inputs)
- **layout/** - App structure (header, footer, layout)
- **ui/** - Base design system components

### **State Management**
- **Feature Slices** - Each feature manages its own state
- **Async Thunks** - API calls with loading/error handling
- **Typed Hooks** - `useAppDispatch`, `useAppSelector`

## 🔧 **Development**

### **Available Scripts**
```bash
npm run dev          # Development server
npm run build        # Production build
npm run test         # Run tests
npm run lint         # Code linting
```

### **Code Standards**
- **TypeScript** - Strict typing, no `any`
- **ESLint** - Consistent code formatting
- **Feature-First** - Organize by business domain
- **Component Patterns** - Proper props typing, memoization

### **Testing Strategy**
- **Unit Tests** - Individual components/functions
- **Integration Tests** - Feature-level testing
- **Mocking** - API calls and external dependencies

## 🎨 **Styling Guidelines**

### **Tailwind CSS**
- **Utility-first** approach
- **Responsive** design (mobile-first)
- **Dark mode** support
- **Design tokens** for consistency

### **Component Variants**
Using Class Variance Authority (CVA) for consistent component styling with variants.

## 🌐 **API Integration**

### **Architecture**
- **Feature-based APIs** - Organized by domain
- **Axios Client** - Centralized HTTP configuration
- **Error Handling** - Consistent error management
- **Token Management** - JWT authentication

### **Patterns**
- **Redux Thunks** - Async API calls
- **Custom Hooks** - Easy API consumption
- **Optimistic Updates** - Better UX
- **Caching** - Performance optimization

## 🔒 **Security**

- **JWT Tokens** - Secure authentication
- **Protected Routes** - Role-based access
- **Input Validation** - Zod schemas
- **XSS Prevention** - Sanitized inputs

## ⚡ **Performance**

- **Code Splitting** - Lazy loading
- **Memoization** - React.memo, useCallback
- **Bundle Optimization** - Vite optimizations
- **Image Optimization** - Cloudinary integration

## 🧪 **Testing**

### **Framework**
- **Vitest** - Fast testing
- **Testing Library** - Component testing
- **Jest DOM** - Extended assertions

### **Patterns**
- Mock API calls
- Test user interactions
- Verify component behavior
- Error scenario testing

## 🚀 **Deployment**

### **Build Process**
```bash
npm run build       # Creates dist/ folder
npm run preview     # Preview production build
```

### **Environment Variables**
```env
VITE_API_URL=http://localhost:3000
VITE_ENABLE_ANALYTICS=true
```

## 🎯 **Best Practices**

### **Architecture**
- ✅ Feature-based organization
- ✅ Separation of concerns
- ✅ Single responsibility principle
- ✅ Dependency injection

### **Code Quality**
- ✅ TypeScript strict mode
- ✅ Consistent naming conventions
- ✅ Proper error handling
- ✅ Performance optimizations

### **Development Workflow**
- ✅ Feature branch strategy
- ✅ Semantic commit messages
- ✅ Code reviews
- ✅ Automated testing

## 🔄 **Contributing**

1. **Fork** repository
2. **Create** feature branch
3. **Implement** with tests
4. **Submit** pull request
5. **Follow** code standards

## 📚 **Key Benefits**

| Aspect | Advantage |
|--------|-----------|
| **Scalability** | Easy to add new features |
| **Maintainability** | Clear code organization |
| **Type Safety** | Full TypeScript coverage |
| **Performance** | Optimized for production |
| **Developer Experience** | Hot reload, debugging tools |
| **Testing** | Comprehensive test coverage |

## 🎯 **Next Steps**

- [ ] Internationalization (i18n)
- [ ] PWA features
- [ ] Real-time notifications
- [ ] SEO optimization
- [ ] E2E testing
- [ ] Performance monitoring

## 📄 **License**

MIT License - see [LICENSE](LICENSE) file for details.

---

**Built with ❤️ using modern React ecosystem and feature-based architecture for scalability and maintainability.**
