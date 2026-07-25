import { createPersistedState } from 'pinia-plugin-persistedstate';

/** Register pinia-plugin-persistedstate for client-side store persistence */
export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.$pinia.use(createPersistedState());
});
