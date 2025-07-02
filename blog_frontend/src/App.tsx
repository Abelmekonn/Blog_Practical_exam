import "./App.css";
import { Provider } from "react-redux";
import { store } from "./store/store";
import { BrowserRouter, Routes, Route } from "react-router-dom";

function App() {
  return (
    <Provider store={store}>
      <BrowserRouter>
        <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900">
          <Routes>
            <Route path="/" element={<div className="text-2xl font-bold text-blue-600 dark:text-blue-300">Blog Home (Placeholder)</div>} />
            {/* Add more routes here */}
          </Routes>
        </div>
      </BrowserRouter>
    </Provider>
  );
}

export default App;
