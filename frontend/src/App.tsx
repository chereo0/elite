import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider, CssBaseline } from '@mui/material';
import theme from './theme/theme';
import { WishlistProvider } from './contexts/WishlistContext';
import { CartProvider } from './contexts/CartContext';
import Home from './pages/Home';
import Shop from './pages/Shop';
import ProductDetail from './pages/ProductDetail';
import WishlistPage from './pages/WishlistPage';
import MyOrdersPage from './pages/MyOrdersPage';
import Contact from './pages/Contact';
import AuthPage from './pages/AuthPage';
import CartPage from './pages/CartPage';
import ProfilePage from './pages/ProfilePage';
import AdminDashboard from './pages/AdminDashboard';
import AddProductPage from './pages/AddProductPage';
import AddCategoryPage from './pages/AddCategoryPage';
import ViewProductsPage from './pages/ViewProductsPage';
import ViewOrdersPage from './pages/ViewOrdersPage';
import ViewUsersPage from './pages/ViewUsersPage';
import { AdminRoute, ProtectedRoute } from './components/ProtectedRoute';

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <CartProvider>
        <WishlistProvider>
          <Router>
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<Home />} />
              <Route path="/shop" element={<Shop />} />
              <Route path="/clothes" element={<Shop />} />
              <Route path="/product/:id" element={<ProductDetail />} />
              <Route path="/wishlist" element={<WishlistPage />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/cart" element={<CartPage />} />
              <Route path="/auth" element={<AuthPage />} />
              <Route path="/login" element={<AuthPage />} />
              <Route path="/signup" element={<AuthPage />} />

              {/* Protected Routes (require login) */}
              <Route path="/profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
              <Route path="/my-orders" element={<ProtectedRoute><MyOrdersPage /></ProtectedRoute>} />

              {/* Admin Protected Routes */}
              <Route path="/admin" element={<AdminRoute><AdminDashboard /></AdminRoute>} />
              <Route path="/dashboard" element={<AdminRoute><AdminDashboard /></AdminRoute>} />
              <Route path="/admin/add-product" element={<AdminRoute><AddProductPage /></AdminRoute>} />
              <Route path="/admin/add-category" element={<AdminRoute><AddCategoryPage /></AdminRoute>} />
              <Route path="/admin/products" element={<AdminRoute><ViewProductsPage /></AdminRoute>} />
              <Route path="/admin/orders" element={<AdminRoute><ViewOrdersPage /></AdminRoute>} />
              <Route path="/admin/users" element={<AdminRoute><ViewUsersPage /></AdminRoute>} />
            </Routes>
          </Router>
        </WishlistProvider>
      </CartProvider>
    </ThemeProvider>
  );
}

export default App;
