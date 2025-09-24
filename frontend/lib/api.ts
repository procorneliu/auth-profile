import axios from 'axios';

export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000', // NestJS backend
  withCredentials: true, // so cookies are sent
});
