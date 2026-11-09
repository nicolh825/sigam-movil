// src/core/http/apiClient.ts
import axios from 'axios';

export const apiClient = axios.create({
  // Apunta directamente a tu backend local en tu red Wi-Fi
  baseURL: 'http://192.168.101.29:3000',
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
  },
});