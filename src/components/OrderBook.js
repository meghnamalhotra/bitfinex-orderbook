import React, { useEffect, useCallback, useTransition } from "react";
import { View, Text, TouchableOpacity, FlatList, StyleSheet, Dimensions } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { fetchOrderBook, connect, disconnect, setPrecision } from "../store/orderBook/actions";
import { Plus, Minus } from "lucide-react-native";

const precisions = ["P0", "P1", "P2", "P3", "R0"];
const { width } = Dimensions.get("window");
const ROW_HEIGHT = 26;

function Row({ bid, ask, maxBid, maxAsk }) {
  if (!bid || !ask) return null;

  const bidWidth = (bid.amount / maxBid) * (width / 2);
  const askWidth = (ask.amount / maxAsk) * (width / 2);

  return (
    <View style={styles.row}>
      {/* Bids (left side, green) */}
      <View style={styles.side}>
        <View style={[styles.depthBar, styles.greenBg, { width: bidWidth, right: 0 }]} />
        <Text style={[styles.text, styles.col]}>{bid.amount.toFixed(4)}</Text>
        <Text style={[styles.text, styles.col]}>{bid.price.toFixed(2)}</Text>
      </View>

      {/* Asks (right side, red) */}
      <View style={styles.side}>
        <View style={[styles.depthBar, styles.redBg, { width: askWidth, left: 0 }]} />
        <Text style={[styles.text, styles.col]}>{ask.price.toFixed(2)}</Text>
        <Text style={[styles.text, styles.col]}>{ask.amount.toFixed(4)}</Text>
      </View>
    </View>
  );
}

const MemoRow = React.memo(Row);

export default function OrderBook() {
  const dispatch = useDispatch();
  const { bids, asks, precision } = useSelector((s) => s.orderBook);

  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    dispatch(fetchOrderBook(precision));
    dispatch(connect());
    return () => dispatch(disconnect());
  }, [precision]);

  // Handle + / - clicks
  const changePrecision = (dir) => {
    startTransition(() => {
      const idx = precisions.indexOf(precision);
      if (dir === "inc" && idx < precisions.length - 1) {
        dispatch(setPrecision(precisions[idx + 1]));
      } else if (dir === "dec" && idx > 0) {
        dispatch(setPrecision(precisions[idx - 1]));
      }
    });
  };


  const maxBid = Math.max(...bids.map((b) => b.amount), 1);
  const maxAsk = Math.max(...asks.map((a) => a.amount), 1);

  const renderRow = useCallback(
    ({ index }) => {
      const bid = bids[index];
      const ask = asks[index];
      return <MemoRow bid={bid} ask={ask} maxBid={maxBid} maxAsk={maxAsk} />;
    },
    [bids, asks, maxBid, maxAsk]
  );

  return (
    <View style={styles.container}>
      {/* Header with precision controls */}
      <View style={styles.header}>
        <Text style={styles.title}>
          Order Book (Precision: {precision}) {isPending ? "fetching...." : ""}
        </Text>
        <View style={styles.actions}>
          <TouchableOpacity onPress={() => changePrecision("dec")} style={styles.iconBtn}>
            <Minus size={20} color="white" />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => changePrecision("inc")} style={styles.iconBtn}>
            <Plus size={20} color="white" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Column Titles */}
      <View style={styles.columnHeader}>
        <View style={styles.side}>
          <Text style={styles.headerText}>AMOUNT</Text>
          <Text style={styles.headerText}>PRICE</Text>
        </View>
        <View style={styles.side}>
          <Text style={styles.headerText}>PRICE</Text>
          <Text style={styles.headerText}>AMOUNT</Text>
        </View>
      </View>

      {/* Order Book */}
      <FlatList
        data={Array.from({ length: Math.min(bids.length, asks.length) })}
        keyExtractor={(_, i) => `row-${i}`}
        renderItem={renderRow}
        getItemLayout={(_, index) => ({
          length: ROW_HEIGHT,
          offset: ROW_HEIGHT * index,
          index,
        })}
        initialNumToRender={30}
        maxToRenderPerBatch={30}
        windowSize={10}
        removeClippedSubviews
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#152330", padding: 8 },
  header: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 10 },
  title: { color: "white", fontSize: 18 },
  actions: { flexDirection: "row" },
  iconBtn: { marginLeft: 8, padding: 6, backgroundColor: "#222", borderRadius: 6 },

  columnHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 6,
    paddingHorizontal: 4,
  },
  headerText: { color: "#aaa", fontSize: 12, width: 60, textAlign: "center" },

  row: { flexDirection: "row", height: ROW_HEIGHT },
  side: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-evenly",
    position: "relative",
    overflow: "hidden",
  },

  text: { fontSize: 12, color: "white", marginHorizontal: 6, zIndex: 2, minWidth: 60, textAlign: "center" },

  depthBar: { position: "absolute", top: 0, bottom: 0, zIndex: 1 },
  greenBg: { backgroundColor: "rgba(35,76,75,255)" },
  redBg: { backgroundColor: "rgba(65,46,54,255)" },
});
