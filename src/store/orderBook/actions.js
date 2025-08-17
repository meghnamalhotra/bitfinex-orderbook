export const CONNECT = "CONNECT";
export const DISCONNECT = "DISCONNECT";
export const ORDERBOOK_UPDATE = "ORDERBOOK_UPDATE";
export const FETCH_ORDERBOOK = "FETCH_ORDERBOOK";
export const SET_PRECISION = "SET_PRECISION";
export const WS_UPDATE = "WS_UPDATE";

export const connect = () => ({ type: CONNECT });
export const disconnect = () => ({ type: DISCONNECT });
export const orderBookUpdate = (payload) => ({ type: ORDERBOOK_UPDATE, payload });
export const fetchOrderBook = (precision = "P0") => ({ type: FETCH_ORDERBOOK, precision });
export const setPrecision = (precision) => ({ type: SET_PRECISION, precision });
export const wsUpdate = (payload) => ({ type: WS_UPDATE, payload });
