// const CORS_PROXY = "https://cors-anywhere.herokuapp.com/";
export const CoinList = (currency: string) =>
    `https://api.coingecko.com/api/v3/coins/markets?vs_currency=${currency}&order=market_cap_desc&per_page=250&page=1&sparkline=false&price_change_percentage=24h`;
  
export const SingleCoin = (id: string) =>
    `https://api.coingecko.com/api/v3/coins/${id}`;
  
export const HistoricalChart = (id: string, days: number = 365, currency: string) =>
    `https://api.coingecko.com/api/v3/coins/${id}/market_chart?vs_currency=${currency}&days=${days}`;
  
export const TrendingCoins = (currency: string) =>
    `https://api.coingecko.com/api/v3/coins/markets?vs_currency=${currency}&order=gecko_desc&per_page=10&page=1&sparkline=false&price_change_percentage=24h`;