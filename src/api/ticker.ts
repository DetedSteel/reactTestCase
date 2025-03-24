import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { Ticker } from "./types/ticker";

export const tickerApi = createApi({
  reducerPath: 'tickerApi',
  baseQuery: fetchBaseQuery({ baseUrl: 'https://api.binance.com/api/v3' }),
  endpoints: (builder) => ({
    getTiker24hr: builder.query<Ticker[], null>({
      query: () => `ticker/24hr`,
    }),
  }),
})

export const { useGetTiker24hrQuery } = tickerApi
