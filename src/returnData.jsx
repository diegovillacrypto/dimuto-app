/**
 * React component that displays a button to retrieve encrypted data from a smart contract on the blockchain,
 * prompt the user for a decryption key, and display the decrypted JSON data.
 *
 * @component
 * @example
 * return (
 *   <EncryptedDataViewer />
 * )
 */
import React, { useState } from 'react';
import { Web3Button, useSigner,useAddress } from "@thirdweb-dev/react";
import { ThirdwebSDK } from "@thirdweb-dev/sdk";
import { ethers } from 'ethers';
import './App.css';
import CryptoJS from 'crypto-js';

/**
 * Decrypts the encrypted data using the provided decryption key.
 *
 * @param {string} encryptedData - The encrypted data to be decrypted.
 * @param {string} userKey - The decryption key.
 * @returns {object|null} - The decrypted JSON data or null if decryption fails.
 */
const decryptFromBlockchain = (encryptedData, userKey) => {
  try {
    const decryptedJsonString = CryptoJS.AES.decrypt(encryptedData, userKey).toString(CryptoJS.enc.Utf8);
    return JSON.parse(decryptedJsonString);
  } catch (error) {
    alert('Hubo un error al desencriptar el objeto JSON: ' + error.message);
    return null;
  }
};

/**
 * React component that displays a button to retrieve encrypted data from a smart contract on the blockchain,
 * prompt the user for a decryption key, and display the decrypted JSON data.
 *
 * @param {object} params - Additional parameters for the component (not used in this code snippet).
 * @returns {JSX.Element} - The rendered component.
 */
const EncryptedDataViewer = ({ params }) => {
  const [encryptedData, setEncryptedData] = useState(null);
  const signer = useSigner();
  const address = useAddress();

  /**
   * Handles the button click event.
   * Retrieves the encrypted data from the smart contract, prompts the user for a decryption key,
   * and displays the decrypted JSON data.
   *
   * @returns {Promise<void>} - A promise that resolves when the handling is complete.
   */
  const handleClick = async () => {
    try {
      const sdk = ThirdwebSDK.fromSigner(signer, "mumbai", {
        clientId: "80229057a94b2632091fc8636471248a"
      });
      const contract = await sdk.getContract("0xB4b007d1f4F5B4BA2D6b12189eE099891C0e0344");
      const encryptedData = await contract.call("getEncryptedData", undefined, {
        from: address
      });
      const data = ethers.utils.toUtf8String(encryptedData);
      setEncryptedData(data);
      const userKey = prompt('Por favor, ingresa tu clave de desencriptación:');
      if (userKey) {
        const decryptedData = decryptFromBlockchain(data, userKey);
        if (decryptedData) {
          alert('JSON desencriptado:\n' + JSON.stringify(decryptedData, null, 2));
        }
      } else {
        alert('Debes ingresar una clave para desencriptar.');
      }
    } catch (error) {
      alert('Hubo un error al llamar al contrato: ' + error.message);
    }
  };

  return (
    <div>
      <Web3Button
        style={{
          backgroundColor: '#00b894',
          color: 'white',
          padding: '8px 16px',
          borderRadius: '5px',
          cursor: 'pointer',
          fontSize: '14px'
        }}
        className="write-button"
        connectWallet={{
          btnTitle: 'Obtener JSON encriptado'
        }}
        contractAddress="0xB4b007d1f4F5B4BA2D6b12189eE099891C0e0344"
        action={handleClick}
      >
        Return Encrypted Data 🔐
      </Web3Button>
    </div>
  );
};

export default EncryptedDataViewer;
