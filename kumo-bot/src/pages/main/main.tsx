import { useNavigate } from 'react-router-dom';
import './main.css';
import { AuthService } from "../../utils/authService";
import { SuiService } from '../../utils/suiService';
import React, { useState, useCallback, useEffect } from "react";

// const walletAddress = "0x48dfdd7c1acb1b4919e1b4248206af584bef882f126f1733521ac41eb13fb77b";

const Main: React.FC = () => {
    const [walletAddress, setWalletAddress] = useState("0x");
    // const suiService = new SuiService();

    const getAdress = useCallback(async () => {
        try {
            if (AuthService.isAuthenticated()) {
                setWalletAddress(AuthService.walletAddress());
            }
        } catch (error) {
            console.log({ error });
        } finally {
        }
    }, [AuthService.isAuthenticated, AuthService.walletAddress, setWalletAddress]);

    useEffect(() => {
        getAdress();
    }, [getAdress]);

    const navigate = useNavigate();

    const handleWithdraw = () => {
        navigate('/withdraw');
    };

    const handleConvert = () => {
        navigate('/convert');
    };

    const handleCopyAddress = () => {
        navigator.clipboard.writeText(walletAddress);
        alert('Wallet address copied to clipboard!');
    };

    return (
        <div className="container">
            <h1 className="heading">ODG Kumo Bot</h1>

            <div className="wallet-address">
                <p>{walletAddress}</p>
                <button className="copy-button" onClick={handleCopyAddress}>
                    Copy Address
                </button>
            </div>

            <button className="button" onClick={handleWithdraw}>
                Withdraw
            </button>
            <button className="button" onClick={handleConvert}>
                Convert
            </button>
        </div>
    );
};

export default Main;
