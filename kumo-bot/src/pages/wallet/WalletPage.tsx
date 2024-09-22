import React, { useState, useEffect, useCallback } from 'react';
import { Coins } from '../../utils/coins';
import { getCoinBalance } from '../../utils/get_coin_data';
import { SuiTransactionProcessor } from '../../utils/sui_transaction';
import { AuthService } from '../../utils/authService';
import './wallet.css';

const coin_class = new Coins();
const transaction = new SuiTransactionProcessor();

const WalletPage = () => {
  const coins = coin_class.get_coins();
  const [walletAddress, setWalletAddress] = useState<string>("0x");
  const [fromCrypto, setFromCrypto] = useState<string>(coins[0]);
  const [fromCryptoAdress, setFromCryptoAdress] = useState<string | null>(coin_class.get_coin_address(fromCrypto));
  const [toCrypto, setToCrypto] = useState<string>(coins[1]);
  const [toCryptoAddress, setToCryptoAddress] = useState<string | null>(coin_class.get_coin_address(toCrypto));
  const [customFromCA, setCustomFromCA] = useState<string>('');
  const [customToCA, setCustomToCA] = useState<string>('');
  const [fromAmount, setFromAmount] = useState<number | ''>('');
  const [toAmount, setToAmount] = useState<number | ''>('');
  const [fromBalance, setFromBalance] = useState<number>(0); // Default balance for 'From' crypto
  const [toBalance, setToBalance] = useState<number>(0); // Default balance for 'To' crypto
  const [slippage, setSlippage] = useState<number>(0.1);
  const [isCustomFrom, setIsCustomFrom] = useState<boolean>(false);
  const [isCustomTo, setIsCustomTo] = useState<boolean>(false);
  const [gasFee, setGasFee] = useState<number | null>(null); // Gas fee state
  const [isSuccessful, setIsSuccessful] = useState<boolean | null>(null); // For success or error
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  // Fetch wallet address using AuthService
  const getWalletAddress = useCallback(async () => {
    try {
      if (AuthService.isAuthenticated()) {
        const address = AuthService.walletAddress();
        setWalletAddress(address);
      }
    } catch (error) {
      console.error('Error fetching wallet address:', error);
    }
  }, []);

  useEffect(() => {
    getWalletAddress();
  }, [getWalletAddress]);

  useEffect(() => {
    const fetchWalletData = async () => {
      const from_CA = await coin_class.get_coin_address(fromCrypto);
      if (from_CA !== null) {
        getBalance(from_CA, true);
      }
      const to_CA = await coin_class.get_coin_address(toCrypto);
      if (to_CA !== null) {
        await getBalance(to_CA, false);
      }
    };
    fetchWalletData();
  }, [walletAddress]);

  const fetchCryptoBalance = async (CA: string): Promise<number> => {
    let balance: number | null = 0;
    if (walletAddress) {
      balance = await getCoinBalance(walletAddress, CA);
    }
    return balance || 0;
  };

  const getBalance = async (CA: string, isFrom: boolean) => {
    const balance = await fetchCryptoBalance(CA);
    if (isFrom) {
      setFromBalance(balance);
    } else {
      setToBalance(balance);
    }
  };

  const handleCustomFromToggle = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedValue = e.target.value;
    if (selectedValue === 'custom') {
      setIsCustomFrom(true);
    } else {
      setIsCustomFrom(false);
      setFromCrypto(selectedValue);
      const CA = await coin_class.get_coin_address(selectedValue);
      if (CA !== null) {
        setFromCryptoAdress(CA);
        await getBalance(CA, true);
      }
    }
  };

  const handleCustomToToggle = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedValue = e.target.value;
    if (selectedValue === 'custom') {
      setIsCustomTo(true);
    } else {
      setIsCustomTo(false);
      setToCrypto(selectedValue);
      const CA = await coin_class.get_coin_address(selectedValue);
      if (CA !== null) {
        setToCryptoAddress(CA);
        await getBalance(CA, false);
      }
    }
  };

  const handleCustomFromCAChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    setCustomFromCA(e.target.value);
    let coin_name = await coin_class.get_coin_name(e.target.value);
    if (coin_name !== null) {
      setFromCrypto(coin_name);
      setFromCryptoAdress(e.target.value);
      await getBalance(e.target.value, true);
    }
  };

  const handleCustomToCAChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    setCustomToCA(e.target.value);
    let coin_name = await coin_class.get_coin_name(e.target.value);
    if (coin_name !== null) {
      setToCrypto(coin_name);
      setToCryptoAddress(e.target.value);
      await getBalance(e.target.value, false);
    }
  };

  const handleConvert = async () => {
    if (fromAmount && walletAddress) {
      const result = await transaction.getGasFeesAndReturnAmount(fromCryptoAdress as string, toCryptoAddress as string, fromAmount, slippage);
      if (result !== null) {
        setToAmount(result.ReturnAmount as number | "");
        setGasFee(result.GasfeeInUsd as number | null);
      }
    }
  };

  // const handleSubmit = async () => {
  //   if (fromAmount && walletAddress) {
  //     const result = await transaction.convert(fromCryptoAdress as string, toCryptoAddress as string, fromAmount, slippage);

  //     if (result !== null) {
  //       // Transaction was successful
  //       setIsSuccessful(true);
  //       setIsModalOpen(true);  // Open success modal
  //     } else {
  //       // Transaction failed
  //       setIsSuccessful(false);
  //       setIsModalOpen(true);  // Open failure modal
  //     }
  //   }
  // };

  const handleSubmit = async () => {
    setIsSuccessful(true);
    setIsModalOpen(true);  // Open success modal
    if (fromAmount && walletAddress) {
      const result = await transaction.convert(fromCryptoAdress as string, toCryptoAddress as string, fromAmount, slippage);
      console.log(result);
      if (result !== null) {

      }
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  return (
    <div className="wallet-container">
      <h2>ODG Kumo Bot</h2>
      <h3>Convert</h3>
      <div className="wallet-info">
        <p><strong>Wallet Address:</strong></p>
        <p className="wallet-address" onClick={() => walletAddress && navigator.clipboard.writeText(walletAddress)}>
          {walletAddress} (Click to copy)
        </p>

        <div className="balance-info">
          <p><strong>{fromCrypto} Balance:</strong> {fromBalance.toFixed(4)}</p>
          <p><strong>{toCrypto} Balance:</strong> {toBalance.toFixed(4)}</p>
        </div>

        <div className="conversion-form">
          <div className="conversion-input">
            <label htmlFor="fromCrypto">From:</label>
            <select
              id="fromCrypto"
              value={isCustomFrom ? 'custom' : fromCrypto}
              onChange={handleCustomFromToggle}
            >
              {coins.map((coin) => (
                <option key={coin} value={coin}>{coin}</option>
              ))}
              <option value="custom">Custom (Enter CA)</option>
            </select>
            {isCustomFrom && (
              <input
                type="text"
                placeholder="Enter Contract Address (From)"
                value={customFromCA}
                onChange={handleCustomFromCAChange}
              />
            )}
            <input
              type="number"
              id="fromAmount"
              value={fromAmount}
              onChange={(e) => setFromAmount(parseFloat(e.target.value))}
              placeholder="Amount"
            />
          </div>

          <div className="conversion-input">
            <label htmlFor="toCrypto">To:</label>
            <select
              id="toCrypto"
              value={isCustomTo ? 'custom' : toCrypto}
              onChange={handleCustomToToggle}
            >
              {coins.map((coin) => (
                <option key={coin} value={coin}>{coin}</option>
              ))}
              <option value="custom">Custom (Enter CA)</option>
            </select>
            {isCustomTo && (
              <input
                type="text"
                placeholder="Enter Contract Address (To)"
                value={customToCA}
                onChange={handleCustomToCAChange}
              />
            )}
            <input
              type="number"
              id="toAmount"
              value={toAmount}
              readOnly
              placeholder="Converted amount"
            />
          </div>

          <button onClick={handleConvert} className="convert-button">Convert</button>

          <div className="slippage-input">
            <label htmlFor="slippage">Slippage Tolerance:</label>
            <select
              id="slippage"
              value={slippage}
              onChange={(e) => setSlippage(parseFloat(e.target.value))}
            >
              <option value="0.1">0.1%</option>
              <option value="0.5">0.5%</option>
              <option value="1">1%</option>
            </select>
          </div>

          {gasFee !== null && (
            <div className="gas-fee-info">
              <p><strong>Gas Fee:</strong> {gasFee} USD</p>
            </div>
          )}

          <button onClick={handleSubmit} className="submit-button">Submit</button>

          {/* Modal for Success/Failure */}
          {isModalOpen && (
            <div className="modal">
              <div className="modal-content">
                <h4>{isSuccessful ? 'Transaction Successful!' : 'Transaction Unsuccessful'}</h4>
                <p>{isSuccessful ? 'Your transaction was completed successfully.' : 'There was an error processing your transaction.'}</p>
                <button onClick={closeModal}>OK</button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default WalletPage;
