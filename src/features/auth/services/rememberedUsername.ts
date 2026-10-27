// rememberedUsername.ts — storage adapter for the "Remember Me" username.
//
// FLAG (scope decision, confirmed with the requester): no native storage module
// is installed, and adding one requires a native rebuild. This adapter therefore
// persists for the lifetime of the JS process only. It is the single seam to
// replace once `@react-native-async-storage/async-storage` (username only, never
// the password) or a Keychain/Keystore-backed store is added.
//
// Deliberate: the PASSWORD is never written anywhere. "Remember Me" stores the
// username and extends the session lifetime; it does not keep credentials.

const KEY = 'auth.rememberedUsername';

let store = new Map<string, string>();

export const rememberedUsernameStore = {
  async read(): Promise<string | null> {
    return store.get(KEY) ?? null;
  },

  async write(username: string): Promise<void> {
    const value = username.trim();
    if (!value) {
      store.delete(KEY);
      return;
    }
    store.set(KEY, value);
  },

  async clear(): Promise<void> {
    store.delete(KEY);
  },

  /** Test-only. */
  __resetForTests(): void {
    store = new Map();
  },
};

export default rememberedUsernameStore;
