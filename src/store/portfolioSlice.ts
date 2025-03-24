import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

export interface PortfolioItem {
  symbol: string;
  name: string;
  count: number;
  currentPrice: number;
  totalPrice: number;
  change24hrPercent: number;
  portfolioPercentPart: string;
}

interface CounterState {
  portfolio: PortfolioItem[];
  totalPortfolioValue: number;
}

// Define the initial state using that type
const initialState: CounterState = {
  portfolio: [],
  totalPortfolioValue: 0,
};

export const portfolioSlice = createSlice({
  name: "portfolio",
  initialState,
  reducers: {
    addToPortfolio: (state, action: PayloadAction<PortfolioItem>) => {
      state.totalPortfolioValue += action.payload.totalPrice;
      if (state.portfolio.find((e) => e.symbol === action.payload.symbol)) {
        state.portfolio = state.portfolio.map((e) => {
          if (e.symbol === action.payload.symbol) {
            return {
              ...e,
              count: e.count + action.payload.count,
              totalPrice: e.totalPrice + action.payload.totalPrice,
              portfolioPercentPart: (
                ((e.count * e.currentPrice) / state.totalPortfolioValue) *
                100
              ).toFixed(2),
            };
          } else {
            return e;
          }
        });
      } else {
        state.portfolio = [
          ...state.portfolio.map((e) => {
            return {
              ...e,
              portfolioPercentPart: (
                ((e.count * e.currentPrice) / state.totalPortfolioValue) *
                100
              ).toFixed(2),
            };
          }),
          action.payload,
        ];
      }
    },
    changePrice: (
      state,
      action: PayloadAction<{ symbol: string; newPrice: string; percentChange: string }>
    ) => {
      const item = state.portfolio.find((e) => e.symbol === action.payload.symbol);
      if (item) {
        state.totalPortfolioValue -= item.totalPrice;
        item.currentPrice = parseFloat(action.payload.newPrice);
        item.totalPrice = item.count * item.currentPrice;
        item.change24hrPercent = parseFloat(action.payload.percentChange);
        state.totalPortfolioValue += item.totalPrice;
        state.portfolio = state.portfolio.map((e) => {
          if (e.symbol === action.payload.symbol) {
            return {
              ...e,
              portfolioPercentPart: (
                ((e.count * e.currentPrice) / state.totalPortfolioValue) *
                100
              ).toFixed(2),
            };
          } else {
            return e;
          }
        });
      }
    },
    deletePortfolioItem: (state, action: PayloadAction<{ symbol: string }>) => {
      const item = state.portfolio.find((e) => e.symbol === action.payload.symbol);
      if (item) {
        state.totalPortfolioValue -= item.totalPrice;
        state.portfolio = state.portfolio.filter((e) => e.symbol !== action.payload.symbol);
      }
    },
  },
});

export const { addToPortfolio, changePrice, deletePortfolioItem } = portfolioSlice.actions;

export default portfolioSlice.reducer;
