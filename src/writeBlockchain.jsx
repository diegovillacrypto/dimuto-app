/**
 * React functional component that handles the encryption and storage of data on the blockchain.
 * @component
 * @example
 * // Example usage of WriteBlockchain component
 * <WriteBlockchain params={data} />
 * @param {Object} params - The data to be encrypted and stored on the blockchain.
 * @returns {JSX.Element} - The WriteBlockchain component.
 */
import React, { useState } from 'react';
import { Web3Button, useSigner } from "@thirdweb-dev/react";
import { ThirdwebSDK } from "@thirdweb-dev/sdk";
import { ethers } from 'ethers';
import './App.css';
import CryptoJS from 'crypto-js';

/**
 * Encrypts the provided data using a user-provided encryption key and sends it to the blockchain.
 * @param {Object} params - The data to be encrypted and stored on the blockchain.
 * @returns {Promise<string>} - The encrypted data.
 */
async function encryptAndSendToBlockchain(params) {

  const userKey = prompt('Please, write your key:');

  if (!userKey) {
    alert('You need to write key to encrypt.');
    return;
  }

  try {
    const jsonString = JSON.stringify(params);
    const encryptedJsonString = CryptoJS.AES.encrypt(jsonString, userKey).toString();
    return encryptedJsonString;
  } catch (error) {
    alert('Hubo un error al encriptar el objeto JSON: ' + error.message);
  }
};

/**
 * React functional component that handles the encryption and storage of data on the blockchain.
 * @component
 * @param {Object} params - The data to be encrypted and stored on the blockchain.
 * @returns {JSX.Element} - The WriteBlockchain component.
 */
const WriteBlockchain = (params) => {
  const [encryptedData, setEncryptedData] = useState(null);
  const signer = useSigner();

  /**
   * Handles the click event of the "Write on Blockchain" button.
   * @returns {Promise<void>}
   */
  const handleClick = async () => {
    //const jsonObjectToEncrypt = JSON.parse(params);
    const encryptedData = await encryptAndSendToBlockchain(params);
    setEncryptedData(encryptedData);
    const encryptedBytes = ethers.utils.toUtf8Bytes(encryptedData);
    const sdk = ThirdwebSDK.fromSigner(signer, "mumbai", {
      clientId: "80229057a94b2632091fc8636471248a"
    });
    const contract = await sdk.getContract("0xB4b007d1f4F5B4BA2D6b12189eE099891C0e0344");
    await contract.call("storeEncryptedData", [encryptedBytes]);
  };

  return (
    <Web3Button
      onSuccess={(result) => alert("Success!")}
      style={{
        backgroundColor: '#007BFF',
        color: 'white',
        padding: '8px 16px',
        borderRadius: '5px',
        cursor: 'pointer',
        marginBottom: '10px',
        marginTop: '10px'
      }}
      className="write-button"
      connectWallet={{
        btnTitle: 'Write on Blockchain 🔓'
      }}
      contractAddress="0xB4b007d1f4F5B4BA2D6b12189eE099891C0e0344"
      action={handleClick}
    >
      Write on Blockchain 🔓
    </Web3Button>
  );
}

export default WriteBlockchain;










