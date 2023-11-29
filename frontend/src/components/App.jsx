import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { LoginPage } from '../pages/login.jsx';
import HomePage from '../pages/home.jsx';
import NotFoundPage from '../pages/notfound';

function App() {
  return (
    <BrowserRouter>
    <Routes>
      <Route path="login" element={ <LoginPage />} />
      <Route path="/" element={ <HomePage />} />
      <Route path="*" element={ <NotFoundPage />} />
    </Routes></BrowserRouter>
  );
}

export default App;
