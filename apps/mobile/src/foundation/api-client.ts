import { createApiClient } from '@focushub/api-client';

import { getAccessToken } from '@/features/auth/secure-token-storage.native';

const apiBaseUrl = process.env.EXPO_PUBLIC_API_URL;

export const apiClient = apiBaseUrl
  ? createApiClient({
      baseUrl: apiBaseUrl,
      getToken: getAccessToken,
    })
  : null;

export const requireApiClient = () => {
  if (!apiClient) {
    throw new Error('The mobile API URL is not configured. Set EXPO_PUBLIC_API_URL.');
  }

  return apiClient;
};
