import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { LoginPage } from '../pages/login.jsx';
import HomePage from '../pages/home.jsx';
import NotFoundPage from '../pages/notfound';
import { AuthProvider } from '../contexts/authContext';

function App() {
  return (
      <BrowserRouter>
        <AuthProvider> 
          <Routes>
            <Route path="login" element={ <LoginPage />} />
            <Route path="/" element={ <HomePage />} />
            <Route path="*" element={ <NotFoundPage />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    
  );
}

export default App;
