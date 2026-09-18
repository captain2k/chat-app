import { Navigate, Route, Routes } from 'react-router';
import ChatPage from './pages/ChatPage';
import LoginPage from './pages/LoginPage';
import SignUpPage from './pages/SignUpPage';
import { useAuthStore } from './stores/authStore';
import { useEffect } from 'react';
import LoadingPage from './components/LoadingPage';
import Background from './components/Background';
import { Toaster } from 'react-hot-toast';

function App() {
  const { authUser, check, isLoading } = useAuthStore();

  useEffect(() => {
    check();
  }, [check]);

  if (isLoading) {
    return <LoadingPage />;
  }
  return (
    <Background>
      <Routes>
        <Route path="/" element={authUser ? <ChatPage /> : <Navigate to={'/login'} />} />
        <Route path="/login" element={!authUser ? <LoginPage /> : <Navigate to={'/'} />} />
        <Route path="/signup" element={!authUser ? <SignUpPage /> : <Navigate to={'/'} />} />
      </Routes>
      <Toaster />
    </Background>
  );
}

export default App;
