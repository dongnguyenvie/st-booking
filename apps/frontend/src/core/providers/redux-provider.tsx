'use client';

import { store, persistor } from '@/store/store';
import { initStoreAccessor } from '@/store/store-core';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';

// Initialize store accessor so actions can call getDispatch() outside components
initStoreAccessor(store);

/** Wraps children with the Redux store and persistence gate — placed in root layout */
export function ReduxProvider({ children }: { children: React.ReactNode }) {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        {children}
      </PersistGate>
    </Provider>
  );
}
