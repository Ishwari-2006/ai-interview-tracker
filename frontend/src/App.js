import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Landing from './pages/Landing';
import Login from './pages/Login';
import Register from './pages/Register';
import LogInterview from './pages/LogInterview';
import Dashboard from './pages/Dashboard';
import History from './pages/History';      // ADD THIS

function PrivateRoute({ children }) {
  const { isLoggedIn } = useAuth();
  return isLoggedIn ? children : <Navigate to="/login" />;
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
          <Route path="/log" element={<PrivateRoute><LogInterview /></PrivateRoute>} />
          <Route path="/history" element={<PrivateRoute><History /></PrivateRoute>} />   {/* UPDATED */}
          <Route path="/questions" element={<PrivateRoute><div className="min-h-screen bg-slate-900 flex items-center justify-center text-white text-2xl font-bold">Questions — Coming Day 12!</div></PrivateRoute>} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;