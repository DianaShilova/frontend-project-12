import { Provider } from 'react-redux';
import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Provider as ProviderRollbar, ErrorBoundary } from '@rollbar/react';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import store from '../slices/index.js';
import LoginPage from '../pages/login.jsx';
import HomePage from '../pages/home.jsx';
import NotFoundPage from '../pages/notfound';
import SignupPage from '../pages/signup.jsx';
import { AuthProvider } from '../contexts/authContext';


const rollbarConfig = {
  accessToken: 'efa0e36235e941d2a3b8ced681bc22a2',
  environment: process.env.NODE_ENV === 'development' ? 'dev' : 'prod',
};

const App = () => (
  <>
    <ProviderRollbar config={rollbarConfig}>
      <ErrorBoundary>
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
      </ErrorBoundary>
    </ProviderRollbar>
    <ToastContainer
      position="top-right"
      autoClose={5000}
      hideProgressBar={false}
      closeOnClick
      draggable
      pauseOnHover
      theme="light"
    />
  </>
);

export default App;
