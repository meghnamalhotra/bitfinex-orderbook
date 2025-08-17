import { ORDERBOOK_UPDATE, WS_UPDATE, SET_PRECISION } from "./actions";

const initialState = {
  bids: [],
  asks: [],
  precision: "P0",
};

function mergeUpdates(state, updates) {
  let bids = [...state.bids];
  let asks = [...state.asks];

  updates.forEach(([price, count, amount]) => {
    if (count === 0) {
      bids = bids.filter((b) => b.price !== price);
      asks = asks.filter((a) => a.price !== price);
    } else if (amount > 0) {
      const idx = bids.findIndex((b) => b.price === price);
      if (idx >= 0) bids[idx] = { price, count, amount };
      else bids.push({ price, count, amount });
    } else if (amount < 0) {
      const idx = asks.findIndex((a) => a.price === price);
      if (idx >= 0) asks[idx] = { price, count, amount: Math.abs(amount) };
      else asks.push({ price, count, amount: Math.abs(amount) });
    }
  });

  return {
    ...state,
    bids: bids.sort((a, b) => b.price - a.price).slice(0, 25),
    asks: asks.sort((a, b) => a.price - b.price).slice(0, 25),
  };
}

export default function orderBookReducer(state = initialState, action) {
  switch (action.type) {
    case ORDERBOOK_UPDATE:
      return { ...state, bids: action.payload.bids, asks: action.payload.asks };
    case WS_UPDATE:
      return mergeUpdates(state, action.payload);
    case SET_PRECISION:
      return { ...state, precision: action.precision, bids: [], asks: [] };
    default:
      return state;
  }
}
