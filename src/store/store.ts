import { configureStore } from "@reduxjs/toolkit";
import { tickerApi } from "../api/ticker";
import portfolioReducer from "./portfolioSlice";

export const store = configureStore({
  reducer: {
    portfolio: portfolioReducer,
    [tickerApi.reducerPath]: tickerApi.reducer,
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(tickerApi.middleware),
});

export type RootState = ReturnType<typeof store.getState>;

export type AppDispatch = typeof store.dispatch;
