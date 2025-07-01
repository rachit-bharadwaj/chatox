import { KeyPair, SessionKey, CryptoState } from '../../types/crypto';
import { cryptoManager } from '../../utils/crypto';

export interface CryptoSlice extends CryptoState {
  initializeCrypto: (userId: string) => Promise<void>;
  generateUserKeyPair: (userId: string) => Promise<KeyPair>;
  getOrCreateSessionKey: (conversationId: string) => Promise<SessionKey>;
  getSessionKey: (sessionKeyId: string) => Promise<SessionKey | null>;
  storePublicKey: (userId: string, publicKey: string) => void;
  getPublicKey: (userId: string) => string | null;
  clearCryptoData: () => void;
  setIsGeneratingKeys: (isGenerating: boolean) => void;
}

export const createCryptoSlice = (set: any, get: any): CryptoSlice => ({
  keyPair: null,
  sessionKeys: new Map(),
  publicKeys: new Map(),
  isInitialized: false,
  isGeneratingKeys: false,

  initializeCrypto: async (userId: string) => {
    try {
      await cryptoManager.initDB();
      
      // Load existing key pair
      const existingKeyPair = await cryptoManager.loadKeyPair(userId);
      
      if (existingKeyPair) {
        set({ 
          keyPair: existingKeyPair, 
          isInitialized: true 
        });
      } else {
        // Generate new key pair if none exists
        set({ isGeneratingKeys: true });
        const newKeyPair = await get().generateUserKeyPair(userId);
        set({ 
          keyPair: newKeyPair, 
          isInitialized: true,
          isGeneratingKeys: false 
        });
      }

      // Clean up expired session keys
      await cryptoManager.clearExpiredSessionKeys();
    } catch (error) {
      console.error('Failed to initialize crypto:', error);
      set({ isGeneratingKeys: false });
      throw error;
    }
  },

  generateUserKeyPair: async (userId: string) => {
    try {
      const keyPair = await cryptoManager.generateKeyPair();
      await cryptoManager.storeKeyPair(userId, keyPair);
      return keyPair;
    } catch (error) {
      console.error('Failed to generate key pair:', error);
      throw error;
    }
  },

  getOrCreateSessionKey: async (conversationId: string) => {
    const state = get();
    
    // Check if we have a valid session key in memory
    const existingKey = Array.from(state.sessionKeys.values())
      .find(key => key.conversationId === conversationId && key.expiresAt > new Date());
    
    if (existingKey) {
      return existingKey;
    }

    // Try to load from storage
    const storedKey = await cryptoManager.getLatestSessionKey(conversationId);
    if (storedKey && storedKey.expiresAt > new Date()) {
      const newSessionKeys = new Map(state.sessionKeys);
      newSessionKeys.set(storedKey.id, storedKey);
      set({ sessionKeys: newSessionKeys });
      return storedKey;
    }

    // Generate new session key
    const newSessionKey = await cryptoManager.generateSessionKey(conversationId);
    await cryptoManager.storeSessionKey(newSessionKey);
    
    const newSessionKeys = new Map(state.sessionKeys);
    newSessionKeys.set(newSessionKey.id, newSessionKey);
    set({ sessionKeys: newSessionKeys });
    
    return newSessionKey;
  },

  getSessionKey: async (sessionKeyId: string) => {
    const state = get();
    
    // Check memory first
    const memoryKey = state.sessionKeys.get(sessionKeyId);
    if (memoryKey) {
      return memoryKey;
    }

    // Load from storage
    const storedKey = await cryptoManager.loadSessionKey(sessionKeyId);
    if (storedKey) {
      const newSessionKeys = new Map(state.sessionKeys);
      newSessionKeys.set(sessionKeyId, storedKey);
      set({ sessionKeys: newSessionKeys });
    }
    
    return storedKey;
  },

  storePublicKey: (userId: string, publicKey: string) => {
    const state = get();
    const newPublicKeys = new Map(state.publicKeys);
    newPublicKeys.set(userId, publicKey);
    set({ publicKeys: newPublicKeys });
  },

  getPublicKey: (userId: string) => {
    const state = get();
    return state.publicKeys.get(userId) || null;
  },

  clearCryptoData: () => {
    set({
      keyPair: null,
      sessionKeys: new Map(),
      publicKeys: new Map(),
      isInitialized: false,
      isGeneratingKeys: false,
    });
  },

  setIsGeneratingKeys: (isGenerating: boolean) => {
    set({ isGeneratingKeys });
  },
});