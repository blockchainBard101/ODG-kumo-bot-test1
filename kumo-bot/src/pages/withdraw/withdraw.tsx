import React, { useState, useEffect, useCallback } from 'react';
import { Coins } from '../../utils/coins';
import { getCoinBalance } from '../../utils/get_coin_data';
import { SuiTransactionProcessor } from '../../utils/sui_transaction';
import { getCoinNames } from '../../utils/get_coin_data';
import './withdraw.css';
import { AuthService } from "../../utils/authService";

const coin_class = new Coins();
const transaction = new SuiTransactionProcessor();

const WithdrawPage: React.FC = () => {
    const [walletAddress, setWalletAddress] = useState("0x");

    // Remove unnecessary dependencies from the useCallback
    const getAdress = useCallback(async () => {
        try {
            if (AuthService.isAuthenticated()) {
                const address = AuthService.walletAddress();
                setWalletAddress(address);
            }
        } catch (error) {
            console.log({ error });
        }
    }, []); // Empty array means it runs once and doesn't rely on external changes

    useEffect(() => {
        getAdress();
    }, [getAdress]);

    // Separate useEffect to track walletAddress changes
    useEffect(() => {
    }, [walletAddress]);

    const [coins, setCoins] = useState<string[]>([]);
    const [selectedCoin, setSelectedCoin] = useState<string>('');
    const [balance, setBalance] = useState<number>(0);
    const [withdrawAddress, setWithdrawAddress] = useState<string>('');
    const [withdrawAmount, setWithdrawAmount] = useState<number | ''>('');

    useEffect(() => {
        const fetchCoins = async () => {
            console.log("Fetching coins for:", walletAddress);
            let coinList = await getCoinNames(walletAddress);
            if (!coinList) {
                coinList = [""];
            }
            setCoins(coinList);
            setSelectedCoin(coinList[0]);
        };

        if (walletAddress !== "0x") {
            fetchCoins();
        }
    }, [walletAddress]);

    useEffect(() => {
        const fetchBalance = async () => {
            const coinAddress = await coin_class.get_coin_address(selectedCoin);
            if (walletAddress && coinAddress) {
                const coinBalance = await getCoinBalance(walletAddress, coinAddress);
                setBalance(coinBalance || 0);
            }
        };

        if (selectedCoin) {
            fetchBalance();
        }
    }, [selectedCoin, walletAddress]);

    const handleCoinChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectedCoin(e.target.value);
    };

    const handleWithdraw = async () => {
        if (withdrawAddress && withdrawAmount) {
            // Call transaction function to process withdrawal
            const result = false
            if (result) {
                alert('Withdrawal successful!');
            } else {
                alert('Withdrawal failed!');
            }
        } else {
            alert('Please enter a valid address and amount.');
        }
    };

    return (
        <div className="withdraw-container">
            <h2>ODG Kumo Bot</h2>
            <h2>Withdraw</h2>
            <div className="withdraw-form">
                <div className="coin-selector">
                    <label htmlFor="coin">Select Coin:</label>
                    <select id="coin" value={selectedCoin} onChange={handleCoinChange}>
                        {coins.map((coin: string) => (
                            <option key={coin} value={coin}>{coin}</option>
                        ))}
                    </select>
                </div>

                <div className="balance-info">
                    <p><strong>{selectedCoin} Balance:</strong> {balance.toFixed(4)}</p>
                </div>

                <div className="withdraw-address">
                    <label htmlFor="withdrawAddress">Withdraw Address:</label>
                    <input
                        type="text"
                        id="withdrawAddress"
                        value={withdrawAddress}
                        onChange={(e) => setWithdrawAddress(e.target.value)}
                        placeholder="Enter withdraw address"
                    />
                </div>

                <div className="withdraw-amount">
                    <label htmlFor="amount">Amount to Withdraw:</label>
                    <input
                        type="number"
                        id="amount"
                        value={withdrawAmount}
                        onChange={(e) => setWithdrawAmount(parseFloat(e.target.value))}
                        placeholder="Enter amount"
                    />
                </div>

                <button className="send-button" onClick={handleWithdraw}>Send</button>
            </div>
        </div>
    );
};

export default WithdrawPage;
