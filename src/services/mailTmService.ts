const API_BASE = 'https://api.mail.tm';

export interface MailAccount {
  email: string;
  password: string;
  token: string;
}

export interface Message {
  id: string;
  from: { address: string; name: string };
  to: Array<{ address: string; name: string }>;
  subject: string;
  intro: string;
  createdAt: string;
  seen: boolean;
}

export interface MessageDetail extends Message {
  text: string;
  html: string[];
}

const generateRandomString = (length: number): string => {
  const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
};

const generatePassword = (): string => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let password = '';
  for (let i = 0; i < 12; i++) {
    password += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return password;
};

export const mailTmService = {
  async createAccount(): Promise<MailAccount> {
    // Get available domains
    const domainsResponse = await fetch(`${API_BASE}/domains`);
    if (!domainsResponse.ok) throw new Error('Failed to fetch domains');
    
    const domains = await domainsResponse.json();
    const domain = domains['hydra:member'][0].domain;
    
    // Generate random username and password
    const username = generateRandomString(10);
    const password = generatePassword();
    const email = `${username}@${domain}`;
    
    // Create account
    const createResponse = await fetch(`${API_BASE}/accounts`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ address: email, password }),
    });
    
    if (!createResponse.ok) throw new Error('Failed to create account');
    
    // Login to get token
    const loginResponse = await fetch(`${API_BASE}/token`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ address: email, password }),
    });
    
    if (!loginResponse.ok) throw new Error('Failed to login');
    
    const { token } = await loginResponse.json();
    
    return { email, password, token };
  },

  async getMessages(token: string): Promise<Message[]> {
    const response = await fetch(`${API_BASE}/messages`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    
    if (!response.ok) throw new Error('Failed to fetch messages');
    
    const data = await response.json();
    return data['hydra:member'] || [];
  },

  async getMessage(token: string, messageId: string): Promise<MessageDetail> {
    const response = await fetch(`${API_BASE}/messages/${messageId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    
    if (!response.ok) throw new Error('Failed to fetch message');
    
    return await response.json();
  },
};
