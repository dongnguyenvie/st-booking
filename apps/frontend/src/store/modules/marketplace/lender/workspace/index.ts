import { lenderWorkspaceSliceActions } from './workspace-slice';
import { lenderWorkspaceExtendActions } from './workspace-actions';
import { lenderWorkspaceSelectors } from './workspace-selectors';

/** Lender workspace actions */
export const lenderWorkspaceA = {
  ...lenderWorkspaceSliceActions,
  ...lenderWorkspaceExtendActions,
};

/** Lender workspace selectors */
export const lenderWorkspaceS = lenderWorkspaceSelectors;

export * from './workspace-slice';
export * as LenderWorkspaceTypes from './workspace-types';
