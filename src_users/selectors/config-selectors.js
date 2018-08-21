import { createSelector } from "reselect";

export const getConfig = state => state.config;

export const getCurrenciesFromConfig = createSelector([getConfig], config =>
  config.get("currencies")
);

export const getFiatFromConfig = createSelector([getConfig], config =>
  config.get("fiat")
);
