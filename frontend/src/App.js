import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Landing from './pages/Landing';
import Login from './pages/Login';
import Register from './pages/Register';
import LogInterview from './pages/LogInterview';
import Dashboard from './pages/Dashboard';

// PrivateRoute: if not logged in, send to login page
function PrivateRoute({ children }) {
  const { isLoggedIn } = useAuth();
  return isLoggedIn ? children : <Navigate to="/login" />;
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public pages */}
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Protected pages — only visible when logged in */}
          <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
          <Route path="/log" element={<PrivateRoute><LogInterview /></PrivateRoute>} />

          {/* Coming soon placeholders */}
          <Route path="/history" element={<PrivateRoute><div className="min-h-screen bg-slate-900 flex items-center justify-center text-white text-2xl font-bold">History — Coming Day 11!</div></PrivateRoute>} />
          <Route path="/questions" element={<PrivateRoute><div className="min-h-screen bg-slate-900 flex items-center justify-center text-white text-2xl font-bold">Questions — Coming Day 12!</div></PrivateRoute>} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;