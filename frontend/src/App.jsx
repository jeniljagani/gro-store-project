import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import Navbar from './components/layout/Navbar';
import Login from './pages/Login';
import Register from './pages/Register';
import Home from './pages/Home';
import Recipes from './pages/Recipes';
import Shop from './pages/Shop';
import CategoryPage from './pages/CategoryPage';
import ProductDetail from './pages/ProductDetail';
import Walkthrough from './pages/Walkthrough';
import Favorites from './pages/Favorites';
import LandingPage from './pages/LandingPage';
import Profile from './pages/Profile';
import Cart from './pages/Cart';
import RecipeDetail from './pages/RecipeDetail';
import Wallet from './pages/Wallet';
import CheckoutPage from './pages/CheckoutPage';
import MyOrders from './pages/MyOrders';
import OrderTracking from './pages/OrderTracking';
import { fetchFavorites } from './redux/slices/favoritesSlice';

import { Toaster } from 'react-hot-toast';

function AppContent() {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);

  // Load favorites when user is logged in
  useEffect(() => {
    if (user?.token) {
      dispatch(fetchFavorites());
    }
  }, [user, dispatch]);

  return (
    <div className="min-h-screen bg-background text-slate-900">
      <Navbar />
      <main>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/recipes" element={<Recipes />} />
          <Route path="/recipes/:id" element={<RecipeDetail />} />
          <Route path="/shop" element={<Shop />} />
          <Route path="/category/:name" element={<CategoryPage />} />
          <Route path="/product/:id" element={<ProductDetail />} />
          <Route path="/walkthrough" element={<Walkthrough />} />
          <Route path="/favorites" element={<Favorites />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/wallet" element={<Wallet />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/checkout" element={<CheckoutPage />} />
          <Route path="/orders" element={<MyOrders />} />
          <Route path="/orders/:id/track" element={<OrderTracking />} />
        </Routes>
      </main>
    </div>
  );
}

function App() {
  return (
    <Router>
      <Toaster position="bottom-right" />
      <AppContent />
    </Router>
  );
}

export default App;
