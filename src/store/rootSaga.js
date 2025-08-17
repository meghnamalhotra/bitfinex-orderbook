import { all } from "redux-saga/effects";
import orderBookSaga from "./orderBook/saga";

export default function* rootSaga() {
  yield all([orderBookSaga()]);
}
