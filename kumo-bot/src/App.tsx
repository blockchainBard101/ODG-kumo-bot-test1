import './App.css'
import React, { useState, useCallback, useEffect } from "react";
import { AuthService } from "./utils/authService";
import { SuiService } from './utils/suiService';
import WalletPage from './pages/wallet/WalletPage';
import Login from './pages/login/login';
import Main from './pages/main/main';

function App() {
  // const [count, setCount] = useState(0)
  // const [balance, setBalance] = useState("0");
  // const suiService = new SuiService();

  // const getBalance = useCallback(async () => {
  //   try {
  //     if (AuthService.isAuthenticated()) {
  //       setBalance(await suiService.getFormattedBalance(AuthService.walletAddress()));
  //     }
  //   } catch (error) {
  //     console.log({ error });
  //   } finally {
  //   }
  // }, [AuthService.isAuthenticated, AuthService.walletAddress, suiService.getFormattedBalance, setBalance]);

  return (
    <>
      {AuthService.isAuthenticated() ? (
        <Main />
      ) : (
        <Login />
      )
      }
    </>
  );
}

export default App
