export interface ApiKeyRecord {
 createdAt: string;
 id: string;
 label: string;
 maskedKey: string;
 testnet: boolean;
 updatedAt: string;
 userId: string;
}

export interface ApiKeyWithSecrets extends ApiKeyRecord {
 encryptedApiKey: string;
 encryptedApiSecret: string;
}
