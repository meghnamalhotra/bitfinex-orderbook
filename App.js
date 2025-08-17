import React from "react";
import { Provider } from "react-redux";
import store from "./src/store";
import OrderBook from "./src/components/OrderBook";

export default function App() {
  return (
    <Provider store={store}>
      <OrderBook />
    </Provider>
  );
}
