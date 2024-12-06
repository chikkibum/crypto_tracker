// Use a CORS proxy to bypass CORS restrictions
const CORS_PROXY = "https://cors-proxy.fringe.zone/";  // This is one option, but you can use others

// Wrap the base URL with the CORS proxy
const BASE_URL = "https://api.coingecko.com/api/v3";

export const CoinList = (currency: string) =>
    `${CORS_PROXY}${BASE_URL}/coins/markets?vs_currency=${currency}&order=market_cap_desc&per_page=250&page=1&sparkline=false&price_change_percentage=24h`;
  
export const SingleCoin = (id: string) =>
    `${CORS_PROXY}${BASE_URL}/coins/${id}`;
  
export const HistoricalChart = (id: string, days: number = 365, currency: string) =>
    `${CORS_PROXY}${BASE_URL}/coins/${id}/market_chart?vs_currency=${currency}&days=${days}`;
  
export const TrendingCoins = (currency: string) =>
    `${CORS_PROXY}${BASE_URL}/coins/markets?vs_currency=${currency}&order=gecko_desc&per_page=10&page=1&sparkline=false&price_change_percentage=24h`;