import type { BuilderState } from '@vexa/tools-builder';

export type BuildStatus = 'error' | 'success' | 'waring';

export const getBuildStatus = (state: BuilderState): BuildStatus => {
  if (state.status === 'error') {
    return 'error';
  }

  if (state.compiler.err) {
    return 'error';
  }

  if (state.compiler.stats?.hasErrors()) {
    return 'error';
  }

  if (state.compiler.stats?.hasWarnings()) {
    return 'waring';
  }

  return 'success';
};
