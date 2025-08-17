import { eventChannel } from "redux-saga";
import { call, put, take, takeLatest, fork, cancel, select } from "redux-saga/effects";
import { FETCH_ORDERBOOK, CONNECT, DISCONNECT, orderBookUpdate, wsUpdate } from "./actions";
import { getOrderBook } from "../../api/orderBookApi";

const formatOrderBook = (data) => {
  const bids = [], asks = [];
  data.forEach(([price, count, amount]) => {
    if (amount > 0) bids.push({ price, count, amount });
    else if (amount < 0) asks.push({ price, count, amount: Math.abs(amount) });
  });
  return { bids, asks };
};

function* fetchOrderBookSaga(action) {
  try {
    const precision = action.precision || (yield select((s) => s.orderBook.precision));
    const response = yield call(getOrderBook, "tBTCUSD", precision);
    const { bids, asks } = formatOrderBook(response);
    yield put(orderBookUpdate({ bids, asks }));
  } catch (err) {
    console.error("OrderBook REST fetch failed:", err);
  }
}

function createWebSocketChannel(precision) {
  return eventChannel((emit) => {
    const ws = new WebSocket("wss://api-pub.bitfinex.com/ws/2");
    ws.onopen = () => {
      ws.send(JSON.stringify({
        event: "subscribe",
        channel: "book",
        symbol: "tBTCUSD",
        prec: precision,
        freq: "F0",
        len: 25,
      }));
    };
    ws.onmessage = (msg) => {
      const data = JSON.parse(msg.data);
      if (Array.isArray(data) && Array.isArray(data[1])) {
        const updates = Array.isArray(data[1][0]) ? data[1] : [data[1]];
        emit(wsUpdate(updates));
      }
    };
    return () => ws.close();
  });
}

function* watchWebSocket() {
  const precision = yield select((s) => s.orderBook.precision);
  const channel = yield call(createWebSocketChannel, precision);
  while (true) {
    const action = yield take(channel);
    yield put(action);
  }
}

export default function* orderBookSaga() {
  yield takeLatest(FETCH_ORDERBOOK, fetchOrderBookSaga);

  let wsTask;
  yield takeLatest(CONNECT, function* () {
    wsTask = yield fork(watchWebSocket);
  });
  yield takeLatest(DISCONNECT, function* () {
    if (wsTask) yield cancel(wsTask);
  });
}
