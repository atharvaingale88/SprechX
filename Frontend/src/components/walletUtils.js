import Web3 from 'web3';

export const connectWallet = async () => {
  try {
    if (window.ethereum) {
      const provider = window.ethereum;

      await provider.request({ method: 'eth_requestAccounts' });

      const web3 = new Web3(provider);

      const accounts = await web3.eth.getAccounts();
      const account = accounts[0]; 

      const networkId = await web3.eth.net.getId();
      console.log('Network ID:', networkId); 

      console.log('Connected wallet:', account);
      return { web3, account }; 
    } else {
      console.error('No Ethereum provider found. Please install MetaMask!');
      return null;
    }
  } catch (error) {
    console.error('Error connecting wallet:', error);
    return null;
  }
};
