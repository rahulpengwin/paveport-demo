import axios, { AxiosInstance, InternalAxiosRequestConfig, AxiosResponse } from 'axios';

// Centralized Axios API client configured for PavePort
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || '/api/v1';

export const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});

// Request interceptor: attaches simulated Bearer token and tenant header
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // In prototype/demo mode, attach client authorization context
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('paveport_demo_store_v1');
      if (stored) {
        try {
          const parsed = JSON.parse(stored);
          const role = parsed?.state?.currentRole || 'SUPER_ADMIN';
          const businessId = parsed?.state?.activeBusinessId || 'biz-lakshmi';
          config.headers.set('Authorization', `Bearer demo-token-${role.toLowerCase()}`);
          config.headers.set('X-PavePort-Role', role);
          config.headers.set('X-PavePort-Tenant', businessId);
        } catch {
          // fallback
        }
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor: standard structured response wrapper
apiClient.interceptors.response.use(
  (response: AxiosResponse) => response,
  (error) => {
    const customError = {
      status: error.response?.status || 500,
      message: error.response?.data?.message || error.message || 'An unexpected API error occurred',
      timestamp: new Date().toISOString(),
    };
    return Promise.reject(customError);
  }
);

