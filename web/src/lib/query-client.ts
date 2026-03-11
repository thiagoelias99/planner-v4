import { QueryClient, } from "@tanstack/react-query"

export const queryClient = new QueryClient()

export const queriesKeys = {
  users: "users",
  profile: "profile",
  tickers: "tickers",
  tickerOrders: "tickerOrders",
  fixedIncome: "fixedIncome",
}