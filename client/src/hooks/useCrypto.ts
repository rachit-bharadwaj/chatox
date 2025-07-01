import { useEffect } from 'react';
import useAppStore from '../store';
import { cryptoManager } from '../utils/crypto';
import { EncryptedMessage } from '../types/crypto';
import { apiClient } from '../utils/apiClient';
import { STORE_PUBLIC_KEY, GET_PUBLIC_KEY, GET_PUBLIC_KEYS } from '../constants';

export const useCrypto = () => {
  const {
    userData,
    keyPair,
    isInitialized,
    isGeneratingKeys,
    initializeCrypto,
    getOrCreateSessionKey,
    getSessionKey,
    storePublicKey,
    getPublicKey,
    clearCryptoData,
  } = useAppStore();

  // Initialize crypto when user data is available
  useEffect(() => {
    if (userData._id && !isInitialized && !isGeneratingKeys) {
      initializeCrypto(userData._id)
        .then(async () => {
          // Store public key on server if we have one
          const state = useAppStore.getState();
          if (state.keyPair?.publicKeyString) {
            try {
              await apiClient.post(STORE_PUBLIC_KEY, {
                userId: userData._id,
                publicKey: state.keyPair.publicKeyString,
              }, { withCredentials: true });
            } catch (error) {
              console.error('Failed to store public key on server:', error);
            }
          }
        })
        .catch(console.error);
    }
  }, [userData._id, isInitialized, isGeneratingKeys, initializeCrypto]);

  // Clear crypto data when user logs out
  useEffect(() => {
    if (!userData._id && isInitialized) {
      clearCryptoData();
    }
  }, [userData._id, isInitialized, clearCryptoData]);

  const encryptMessage = async (message: string, recipientId: string): Promise<{ encrypted: EncryptedMessage; encryptedSessionKey: string } | null> => {
    try {
      if (!keyPair || !userData._id) {
        console.error('Crypto not initialized or no user data');
        return null;
      }

      // Fetch recipient's public key
      const recipientPublicKey = await fetchPublicKey(recipientId);
      if (!recipientPublicKey) {
        console.error('Recipient public key not found');
        return null;
      }

      const conversationId = [userData._id, recipientId].sort().join('-');
      const sessionKey = await getOrCreateSessionKey(conversationId);
      
      const encrypted = await cryptoManager.encryptMessage(message, sessionKey.key);
      encrypted.sessionKeyId = sessionKey.id;
      
      // Encrypt session key for recipient
      const encryptedSessionKey = await cryptoManager.encryptSessionKey(sessionKey.key, recipientPublicKey);
      
      return { encrypted, encryptedSessionKey };
    } catch (error) {
      console.error('Failed to encrypt message:', error);
      return null;
    }
  };

  const decryptMessage = async (encrypted: EncryptedMessage): Promise<string | null> => {
    try {
      if (!keyPair) {
        console.error('Crypto not initialized');
        return null;
      }

      const sessionKey = await getSessionKey(encrypted.sessionKeyId);
      if (!sessionKey) {
        console.error('Session key not found:', encrypted.sessionKeyId);
        return null;
      }

      return await cryptoManager.decryptMessage(encrypted, sessionKey.key);
    } catch (error) {
      console.error('Failed to decrypt message:', error);
      return null;
    }
  };

  const encryptSessionKeyForRecipient = async (sessionKeyId: string, recipientId: string): Promise<string | null> => {
    try {
      if (!keyPair) {
        console.error('Crypto not initialized');
        return null;
      }

      const recipientPublicKey = getPublicKey(recipientId);
      if (!recipientPublicKey) {
        console.error('Recipient public key not found');
        return null;
      }

      const sessionKey = await getSessionKey(sessionKeyId);
      if (!sessionKey) {
        console.error('Session key not found');
        return null;
      }

      return await cryptoManager.encryptSessionKey(sessionKey.key, recipientPublicKey);
    } catch (error) {
      console.error('Failed to encrypt session key:', error);
      return null;
    }
  };

  const decryptSessionKeyFromSender = async (encryptedSessionKey: string, sessionKeyId: string, conversationId: string): Promise<void> => {
    try {
      if (!keyPair) {
        console.error('Crypto not initialized');
        return;
      }

      const sessionKeyCrypto = await cryptoManager.decryptSessionKey(encryptedSessionKey, keyPair.privateKey);
      
      // Create session key object
      const sessionKey = {
        key: sessionKeyCrypto,
        id: sessionKeyId,
        conversationId,
        createdAt: new Date(),
        expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours
      };

      await cryptoManager.storeSessionKey(sessionKey);
      
      // Update store
      const { sessionKeys } = useAppStore.getState();
      const newSessionKeys = new Map(sessionKeys);
      newSessionKeys.set(sessionKeyId, sessionKey);
      useAppStore.setState({ sessionKeys: newSessionKeys });
    } catch (error) {
      console.error('Failed to decrypt session key:', error);
    }
  };

  const isMessageEncrypted = (message: any): boolean => {
    return message.encrypted === true && message.ciphertext && message.iv && message.sessionKeyId;
  };

  const fetchPublicKey = async (userId: string): Promise<string | null> => {
    try {
      // Check if we already have it in store
      const existingKey = getPublicKey(userId);
      if (existingKey) {
        return existingKey;
      }

      // Fetch from server
      const response = await apiClient.get(`${GET_PUBLIC_KEY}/${userId}`, { withCredentials: true });
      const { publicKey } = response.data;
      
      if (publicKey) {
        storePublicKey(userId, publicKey);
        return publicKey;
      }
      
      return null;
    } catch (error) {
      console.error('Failed to fetch public key:', error);
      return null;
    }
  };

  const fetchMultiplePublicKeys = async (userIds: string[]): Promise<Record<string, string>> => {
    try {
      const response = await apiClient.post(GET_PUBLIC_KEYS, { userIds }, { withCredentials: true });
      const { publicKeys } = response.data;
      
      // Store all keys in the store
      Object.entries(publicKeys).forEach(([userId, keyData]: [string, any]) => {
        storePublicKey(userId, keyData.publicKey);
      });
      
      return Object.fromEntries(
        Object.entries(publicKeys).map(([userId, keyData]: [string, any]) => [userId, keyData.publicKey])
      );
    } catch (error) {
      console.error('Failed to fetch public keys:', error);
      return {};
    }
  };

  const canEncrypt = (): boolean => {
    return isInitialized && !!keyPair && !isGeneratingKeys;
  };

  return {
    isInitialized,
    isGeneratingKeys,
    canEncrypt: canEncrypt(),
    publicKey: keyPair?.publicKeyString || null,
    encryptMessage,
    decryptMessage,
    encryptSessionKeyForRecipient,
    decryptSessionKeyFromSender,
    isMessageEncrypted,
    storePublicKey,
    getPublicKey,
    fetchPublicKey,
    fetchMultiplePublicKeys,
  };
};