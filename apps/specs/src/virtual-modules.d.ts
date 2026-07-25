declare module 'virtual:spec-mtimes' {
  /** Spec path relative to `specs/` (e.g. `marketplace/funding-room.md`) -> ISO timestamp. */
  export const mtimes: Record<string, string>;
}
