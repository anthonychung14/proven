import { createSelector } from "reselect";

// unnecessary optimization, but also the easiset to understand
export const getConfig = state => state.config;
export const getHasChaosStarted = createSelector([getConfig], config =>
  config.get("chaos")
);

export const getCurrenciesFromConfig = createSelector([getConfig], config =>
  config.get("currencies")
);

export const getFiatFromConfig = createSelector([getConfig], config =>
  config.get("fiat")
);
