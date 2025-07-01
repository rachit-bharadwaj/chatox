import { KeyPair, SessionKey, EncryptedMessage, StoredKeyPair, StoredSessionKey } from '../types/crypto';

const CRYPTO_DB_NAME = 'chatox-crypto';
const CRYPTO_DB_VERSION = 1;
const KEYPAIR_STORE = 'keypairs';
const SESSION_KEYS_STORE = 'sessionkeys';

class CryptoManager {
  private db: IDBDatabase | null = null;

  async initDB(): Promise<void> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(CRYPTO_DB_NAME, CRYPTO_DB_VERSION);
      
      request.onerror = () => reject(request.error);
      request.onsuccess = () => {
        this.db = request.result;
        resolve();
      };
      
      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;
        
        if (!db.objectStoreNames.contains(KEYPAIR_STORE)) {
          db.createObjectStore(KEYPAIR_STORE, { keyPath: 'userId' });
        }
        
        if (!db.objectStoreNames.contains(SESSION_KEYS_STORE)) {
          const sessionStore = db.createObjectStore(SESSION_KEYS_STORE, { keyPath: 'id' });
          sessionStore.createIndex('conversationId', 'conversationId', { unique: false });
        }
      };
    });
  }

  async generateKeyPair(): Promise<KeyPair> {
    const keyPair = await crypto.subtle.generateKey(
      {
        name: 'RSA-OAEP',
        modulusLength: 2048,
        publicExponent: new Uint8Array([1, 0, 1]),
        hash: 'SHA-256',
      },
      true,
      ['encrypt', 'decrypt']
    );

    const publicKeyJWK = await crypto.subtle.exportKey('jwk', keyPair.publicKey);
    const publicKeyString = JSON.stringify(publicKeyJWK);

    return {
      publicKey: keyPair.publicKey,
      privateKey: keyPair.privateKey,
      publicKeyString,
      generatedAt: new Date(),
    };
  }

  async storeKeyPair(userId: string, keyPair: KeyPair): Promise<void> {
    if (!this.db) await this.initDB();

    const privateKeyJWK = await crypto.subtle.exportKey('jwk', keyPair.privateKey);
    
    const storedKeyPair: StoredKeyPair & { userId: string } = {
      userId,
      publicKeyString: keyPair.publicKeyString,
      privateKeyJWK,
      generatedAt: keyPair.generatedAt.toISOString(),
    };

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([KEYPAIR_STORE], 'readwrite');
      const store = transaction.objectStore(KEYPAIR_STORE);
      const request = store.put(storedKeyPair);
      
      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve();
    });
  }

  async loadKeyPair(userId: string): Promise<KeyPair | null> {
    if (!this.db) await this.initDB();

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([KEYPAIR_STORE], 'readonly');
      const store = transaction.objectStore(KEYPAIR_STORE);
      const request = store.get(userId);
      
      request.onerror = () => reject(request.error);
      request.onsuccess = async () => {
        const result = request.result as (StoredKeyPair & { userId: string }) | undefined;
        
        if (!result) {
          resolve(null);
          return;
        }

        try {
          const publicKey = await crypto.subtle.importKey(
            'jwk',
            JSON.parse(result.publicKeyString),
            { name: 'RSA-OAEP', hash: 'SHA-256' },
            true,
            ['encrypt']
          );

          const privateKey = await crypto.subtle.importKey(
            'jwk',
            result.privateKeyJWK,
            { name: 'RSA-OAEP', hash: 'SHA-256' },
            true,
            ['decrypt']
          );

          resolve({
            publicKey,
            privateKey,
            publicKeyString: result.publicKeyString,
            generatedAt: new Date(result.generatedAt),
          });
        } catch (error) {
          reject(error);
        }
      };
    });
  }

  async generateSessionKey(conversationId: string): Promise<SessionKey> {
    const key = await crypto.subtle.generateKey(
      { name: 'AES-GCM', length: 256 },
      true,
      ['encrypt', 'decrypt']
    );

    const id = crypto.randomUUID();
    const now = new Date();
    const expiresAt = new Date(now.getTime() + 24 * 60 * 60 * 1000); // 24 hours

    return {
      key,
      id,
      conversationId,
      createdAt: now,
      expiresAt,
    };
  }

  async storeSessionKey(sessionKey: SessionKey): Promise<void> {
    if (!this.db) await this.initDB();

    const keyJWK = await crypto.subtle.exportKey('jwk', sessionKey.key);
    
    const storedSessionKey: StoredSessionKey = {
      keyJWK,
      id: sessionKey.id,
      conversationId: sessionKey.conversationId,
      createdAt: sessionKey.createdAt.toISOString(),
      expiresAt: sessionKey.expiresAt.toISOString(),
    };

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([SESSION_KEYS_STORE], 'readwrite');
      const store = transaction.objectStore(SESSION_KEYS_STORE);
      const request = store.put(storedSessionKey);
      
      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve();
    });
  }

  async loadSessionKey(sessionKeyId: string): Promise<SessionKey | null> {
    if (!this.db) await this.initDB();

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([SESSION_KEYS_STORE], 'readonly');
      const store = transaction.objectStore(SESSION_KEYS_STORE);
      const request = store.get(sessionKeyId);
      
      request.onerror = () => reject(request.error);
      request.onsuccess = async () => {
        const result = request.result as StoredSessionKey | undefined;
        
        if (!result) {
          resolve(null);
          return;
        }

        try {
          const key = await crypto.subtle.importKey(
            'jwk',
            result.keyJWK,
            { name: 'AES-GCM' },
            true,
            ['encrypt', 'decrypt']
          );

          resolve({
            key,
            id: result.id,
            conversationId: result.conversationId,
            createdAt: new Date(result.createdAt),
            expiresAt: new Date(result.expiresAt),
          });
        } catch (error) {
          reject(error);
        }
      };
    });
  }

  async getLatestSessionKey(conversationId: string): Promise<SessionKey | null> {
    if (!this.db) await this.initDB();

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([SESSION_KEYS_STORE], 'readonly');
      const store = transaction.objectStore(SESSION_KEYS_STORE);
      const index = store.index('conversationId');
      const request = index.getAll(conversationId);
      
      request.onerror = () => reject(request.error);
      request.onsuccess = async () => {
        const results = request.result as StoredSessionKey[];
        
        if (results.length === 0) {
          resolve(null);
          return;
        }

        // Find the most recent non-expired session key
        const now = new Date();
        const validKeys = results.filter(key => new Date(key.expiresAt) > now);
        
        if (validKeys.length === 0) {
          resolve(null);
          return;
        }

        const latestKey = validKeys.sort((a, b) => 
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        )[0];

        try {
          const key = await crypto.subtle.importKey(
            'jwk',
            latestKey.keyJWK,
            { name: 'AES-GCM' },
            true,
            ['encrypt', 'decrypt']
          );

          resolve({
            key,
            id: latestKey.id,
            conversationId: latestKey.conversationId,
            createdAt: new Date(latestKey.createdAt),
            expiresAt: new Date(latestKey.expiresAt),
          });
        } catch (error) {
          reject(error);
        }
      };
    });
  }

  async encryptSessionKey(sessionKey: CryptoKey, recipientPublicKeyString: string): Promise<string> {
    const publicKeyJWK = JSON.parse(recipientPublicKeyString);
    const publicKey = await crypto.subtle.importKey(
      'jwk',
      publicKeyJWK,
      { name: 'RSA-OAEP', hash: 'SHA-256' },
      false,
      ['encrypt']
    );

    const sessionKeyJWK = await crypto.subtle.exportKey('jwk', sessionKey);
    const sessionKeyData = new TextEncoder().encode(JSON.stringify(sessionKeyJWK));
    
    const encryptedData = await crypto.subtle.encrypt(
      { name: 'RSA-OAEP' },
      publicKey,
      sessionKeyData
    );

    return btoa(String.fromCharCode(...new Uint8Array(encryptedData)));
  }

  async decryptSessionKey(encryptedSessionKey: string, privateKey: CryptoKey): Promise<CryptoKey> {
    const encryptedData = new Uint8Array(
      atob(encryptedSessionKey).split('').map(char => char.charCodeAt(0))
    );

    const decryptedData = await crypto.subtle.decrypt(
      { name: 'RSA-OAEP' },
      privateKey,
      encryptedData
    );

    const sessionKeyJWK = JSON.parse(new TextDecoder().decode(decryptedData));
    
    return await crypto.subtle.importKey(
      'jwk',
      sessionKeyJWK,
      { name: 'AES-GCM' },
      true,
      ['encrypt', 'decrypt']
    );
  }

  async encryptMessage(message: string, sessionKey: CryptoKey): Promise<EncryptedMessage> {
    const iv = crypto.getRandomValues(new Uint8Array(12));
    const messageData = new TextEncoder().encode(message);
    
    const encryptedData = await crypto.subtle.encrypt(
      { name: 'AES-GCM', iv },
      sessionKey,
      messageData
    );

    return {
      ciphertext: btoa(String.fromCharCode(...new Uint8Array(encryptedData))),
      iv: btoa(String.fromCharCode(...iv)),
      sessionKeyId: '', // Will be set by caller
    };
  }

  async decryptMessage(encrypted: EncryptedMessage, sessionKey: CryptoKey): Promise<string> {
    const ciphertext = new Uint8Array(
      atob(encrypted.ciphertext).split('').map(char => char.charCodeAt(0))
    );
    const iv = new Uint8Array(
      atob(encrypted.iv).split('').map(char => char.charCodeAt(0))
    );

    const decryptedData = await crypto.subtle.decrypt(
      { name: 'AES-GCM', iv },
      sessionKey,
      ciphertext
    );

    return new TextDecoder().decode(decryptedData);
  }

  async encryptFile(file: ArrayBuffer, sessionKey: CryptoKey): Promise<EncryptedMessage> {
    const iv = crypto.getRandomValues(new Uint8Array(12));
    
    const encryptedData = await crypto.subtle.encrypt(
      { name: 'AES-GCM', iv },
      sessionKey,
      file
    );

    return {
      ciphertext: btoa(String.fromCharCode(...new Uint8Array(encryptedData))),
      iv: btoa(String.fromCharCode(...iv)),
      sessionKeyId: '', // Will be set by caller
    };
  }

  async decryptFile(encrypted: EncryptedMessage, sessionKey: CryptoKey): Promise<ArrayBuffer> {
    const ciphertext = new Uint8Array(
      atob(encrypted.ciphertext).split('').map(char => char.charCodeAt(0))
    );
    const iv = new Uint8Array(
      atob(encrypted.iv).split('').map(char => char.charCodeAt(0))
    );

    return await crypto.subtle.decrypt(
      { name: 'AES-GCM', iv },
      sessionKey,
      ciphertext
    );
  }

  async clearExpiredSessionKeys(): Promise<void> {
    if (!this.db) await this.initDB();

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([SESSION_KEYS_STORE], 'readwrite');
      const store = transaction.objectStore(SESSION_KEYS_STORE);
      const request = store.getAll();
      
      request.onerror = () => reject(request.error);
      request.onsuccess = () => {
        const results = request.result as StoredSessionKey[];
        const now = new Date();
        
        const deletePromises = results
          .filter(key => new Date(key.expiresAt) <= now)
          .map(key => {
            return new Promise<void>((deleteResolve, deleteReject) => {
              const deleteRequest = store.delete(key.id);
              deleteRequest.onerror = () => deleteReject(deleteRequest.error);
              deleteRequest.onsuccess = () => deleteResolve();
            });
          });

        Promise.all(deletePromises)
          .then(() => resolve())
          .catch(reject);
      };
    });
  }
}

export const cryptoManager = new CryptoManager();