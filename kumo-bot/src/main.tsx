import { createRoot } from 'react-dom/client'
import Callback from './callback.tsx';
import WithdrawPage from './pages/withdraw/withdraw.tsx';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import App from './App.tsx'
import './index.css'
import WalletPage from './pages/wallet/WalletPage.tsx';

createRoot(document.getElementById('root')!).render(
  <Router>
    <Routes>
      <Route path="/" element={<Callback />} />
      <Route path="/main" element={<App />} />
      <Route path="/convert" element={<WalletPage />} />
      <Route path="/withdraw" element={<WithdrawPage />} />
    </Routes>
  </Router>
)
