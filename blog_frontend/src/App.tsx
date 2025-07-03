import { Provider } from "react-redux";
import { store } from "./store/store";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "./contexts/ThemeContext";
import { HelmetProvider } from "react-helmet-async";
import Home from "./pages/Home";
import BlogDetail from "./pages/BlogDetail";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Privacy from "./pages/Privacy";
import Terms from "./pages/Terms";
import { Login } from "./pages/auth/Login";
import { Register } from "./pages/auth/Register";
import CreatePost from "./pages/post/CreatePost";
import EditPost from "./pages/post/EditPost";
import Profile from "./pages/auth/Profile";
import NotFound from "./pages/NotFound";

function App() {
  return (
    <Provider store={store}>
      <HelmetProvider>
        <ThemeProvider >
          <BrowserRouter>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/blog/:id" element={<BlogDetail />} />
            <Route path="/create-post" element={<CreatePost />} />
            <Route path="/edit-post/:id" element={<EditPost />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/privacy" element={<Privacy />} />
            <Route path="/terms" element={<Terms />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="*" element={<NotFound />} />
            
          </Routes>
        </BrowserRouter>
      </ThemeProvider>
      </HelmetProvider>
    </Provider>
  );
}

export default App;
