import axios from "axios";

const api = axios.create({
  baseURL: "https://api-pub.bitfinex.com/v2",
  timeout: 8000,
});

api.interceptors.response.use(
  (response) => response.data,
  (error) => Promise.reject(error)
);

export const getOrderBook = (symbol = "tBTCUSD", precision = "P0") =>
  api.get(`/book/${symbol}/${precision}?len=25`);
