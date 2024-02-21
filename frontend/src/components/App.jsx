import { Provider } from "react-redux";
import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { LoginPage } from "../pages/login.jsx";
import { HomePage } from "../pages/home.jsx";
import { NotFoundPage } from "../pages/notfound";
import { SignupPage } from "../pages/signup.jsx";
import { AuthProvider } from "../contexts/authContext";
import "bootstrap/dist/css/bootstrap.min.css";
import store from "../slices/index.js";

function App() {
  return (
    <BrowserRouter>
      <Provider store={store}>
        <AuthProvider>
          <Routes>
            <Route path="login" element={<LoginPage />} />
            <Route path="/" element={<HomePage />} />
            <Route path="*" element={<NotFoundPage />} />
            <Route path="signup" element={<SignupPage />} />
          </Routes>
        </AuthProvider>
      </Provider>
    </BrowserRouter>
  );
}

export default App;
