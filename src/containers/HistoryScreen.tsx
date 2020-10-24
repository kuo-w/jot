import React, { ReactElement } from "react";
import { useSelector } from "react-redux";
import { StyleSheet, View, FlatList, Text } from "react-native";
import { Ghost } from "react-kawaii/lib/native";
import { selectJots } from "store/jotsSlice";

const HistoryScreen = (): ReactElement => {
  const { jots } = useSelector(selectJots);

  return (
    <View style={{ flex: 1, backgroundColor: "black" }}>
      {jots.length == 0 ? (
        <View
          style={{ flex: 1, alignItems: "center", justifyContent: "center" }}
        >
          <Ghost size={250} mood="sad" color="#E0E4E8" />
          <Text style={[styles.text, { marginTop: 20 }]}>
            Nothing to see here.
          </Text>
        </View>
      ) : (
        <FlatList
          data={jots}
          keyExtractor={(_, index) => `${index}`}
          renderItem={({ item }) => {
            return (
              <View style={{ padding: 20 }}>
                <View
                  style={{
                    padding: 30,
                    flexDirection: "column",
                    backgroundColor: "#333",
                    alignSelf: "stretch",
                    borderRadius: 5,
                  }}
                >
                  <Text style={styles.dateText}>
                    {item.createdAt.toDateString()}
                  </Text>
                  <Text style={styles.text}>{item.text}</Text>
                </View>
              </View>
            );
          }}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  dateText: {
    color: "#777",
    marginBottom: 10,
  },
  text: {
    color: "#bbb",
  },
});

export default HistoryScreen;
