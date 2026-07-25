import { workspaceSliceActions } from './workspace-slice';
import { workspaceSelectors } from './workspace-selectors';

/** Marketplace workspace actions */
export const workspaceA = { ...workspaceSliceActions };

/** Marketplace workspace selectors */
export const workspaceS = workspaceSelectors;

export * from './workspace-slice';
export * as WorkspaceTypes from './workspace-types';
