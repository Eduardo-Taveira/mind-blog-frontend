import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import Home from './pages/Home';
import Articles from './pages/Articles';
import ArticleDetail from './pages/ArticleDetail';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import NewArticle from './pages/NewArticle';
import EditArticle from './pages/EditArticle';
import Settings from './pages/Settings';
import ProtectedRoute from './components/ProtectedRoute';

// Wrapper separado para ter acesso ao useLocation
function AppRoutes() {
  const location = useLocation();

  return (
    <Routes>
      {/* Rotas públicas — key={location.key} força rebuscar ao navegar */}
      <Route path="/"            element={<Home     key={location.key} />} />
      <Route path="/articles"    element={<Articles key={location.key} />} />
      <Route path="/articles/:id" element={<ArticleDetail />} />
      <Route path="/login"       element={<Login />} />
      <Route path="/register"    element={<Register />} />

      {/* Rotas protegidas */}
      <Route element={<ProtectedRoute />}>
        <Route path="/dashboard"         element={<Dashboard />} />
        <Route path="/articles/new"      element={<NewArticle />} />
        <Route path="/articles/:id/edit" element={<EditArticle />} />
        <Route path="/settings"          element={<Settings />} />
      </Route>
    </Routes>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  );
}

export default App;