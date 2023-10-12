/**
 * A functional component in a React application that allows users to write sensitive data encrypted on the blockchain.
 * 
 * @returns {JSX.Element} The rendered React component.
 */
import { useState } from 'react';
import './App.css';
import { ConnectWallet, ThirdwebProvider,darkTheme } from "@thirdweb-dev/react";
import WriteBlockchain from "./writeBlockchain";
import EncryptedDataViewer from './returnData';
function App() {
  const [inputValue, setInputValue] = useState('');
  const [displayValue, setDisplayValue] = useState('');
  const activeChain = "Mumbai";

  const customStyles = {
    position: 'fixed',
    top: '20px',
    right: '20px',
    color: 'white',
    padding: '10px 20px',
    borderRadius: '5px',
    cursor: 'pointer'
  };

  /**
   * Handles the change event of the input field and updates the inputValue state.
   * 
   * @param {Object} event - The change event object.
   */
  const handleInputChange = (event) => {
    setInputValue(event.target.value);
  };

  /**
   * Sets the displayValue state to the inputValue.
   */
  const handleDisplay = () => {
    setDisplayValue(inputValue);
  };

  return (
    <>
      <ThirdwebProvider activeChain="mumbai" clientId="80229057a94b2632091fc8636471248a">
        <div className="logo-container">
          <img src={'https://wallet.polygon.technology/assets/img/zkEVM.svg'} className="logo" alt="Polygon logo" />
        </div>
        <div className="card">
          <h1 className='modern-title'>Write Encrypted Data on Blockchain</h1>
          <input
            className='input'
            type="password"
            value={inputValue}
            onChange={handleInputChange}
            placeholder="Enter sensitive data"
          />
          <WriteBlockchain params={inputValue}/>
          <EncryptedDataViewer/>
          <p>{displayValue}</p>
        </div>
        <ConnectWallet activeChain={activeChain} theme={darkTheme({
          colors: {
            primaryButtonBg: "#007bff",
            primaryButtonText: "#ffffff",
          },
        })} switchToActiveChain ={true} style={customStyles}/>
      </ThirdwebProvider>
    </>
  );
}

export default App;
