/**
 * Store Accessor Layer
 * Provides lazy access to Redux store outside React components (actions, services).
 * Must call initStoreAccessor(store) once after store creation.
 */
import type { store as StoreInstance } from './store';
import type { AppDispatch } from './store';
import type { RootState } from './root-reducer';

type IStore = typeof StoreInstance;
let _store: IStore | null = null;

/** Call once in ReduxProvider after store is created */
export function initStoreAccessor(store: IStore): void {
  _store = store;
}

export function getDispatch(): AppDispatch {
  if (!_store) throw new Error('Store not initialized. Call initStoreAccessor first.');
  return _store.dispatch;
}

export function getStore(): IStore {
  if (!_store) throw new Error('Store not initialized. Call initStoreAccessor first.');
  return _store;
}

export function getState(): RootState {
  if (!_store) throw new Error('Store not initialized. Call initStoreAccessor first.');
  return _store.getState();
}
