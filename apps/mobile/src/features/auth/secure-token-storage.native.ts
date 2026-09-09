import * as SecureStore from "expo-secure-store";

const ACCESS_TOKEN_KEY = "focushub.access-token";

const tokenOptions: SecureStore.SecureStoreOptions = {
  // Keep the credential available only after the user unlocks this device and
  // prevent it from being migrated through an iOS backup.
  keychainAccessible: SecureStore.WHEN_UNLOCKED_THIS_DEVICE_ONLY,
};

/** Stores the server-issued JWT in Android Keystore/iOS Keychain storage. */
export const saveAccessToken = (token: string) =>
  SecureStore.setItemAsync(ACCESS_TOKEN_KEY, token, tokenOptions);

/** Returns the stored JWT, or null when the user has no native session. */
export const getAccessToken = () =>
  SecureStore.getItemAsync(ACCESS_TOKEN_KEY, tokenOptions);

/** Removes the native JWT during logout or an invalid-session recovery. */
export const deleteAccessToken = () =>
  SecureStore.deleteItemAsync(ACCESS_TOKEN_KEY, tokenOptions);
