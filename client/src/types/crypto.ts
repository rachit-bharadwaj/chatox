export interface KeyPair {
  publicKey: CryptoKey;
  privateKey: CryptoKey;
  publicKeyString: string;
  generatedAt: Date;
}

export interface SessionKey {
  key: CryptoKey;
  id: string;
  conversationId: string;
  createdAt: Date;
  expiresAt: Date;
}

export interface EncryptedMessage {
  ciphertext: string;
  iv: string;
  sessionKeyId: string;
  ephemeralKey?: string;
}

export interface StoredKeyPair {
  publicKeyString: string;
  privateKeyJWK: JsonWebKey;
  generatedAt: string;
}

export interface StoredSessionKey {
  keyJWK: JsonWebKey;
  id: string;
  conversationId: string;
  createdAt: string;
  expiresAt: string;
}

export interface CryptoState {
  keyPair: KeyPair | null;
  sessionKeys: Map<string, SessionKey>;
  publicKeys: Map<string, string>;
  isInitialized: boolean;
  isGeneratingKeys: boolean;
}