import React, { ReactElement } from "react";
import { Button, View } from "react-native";

type Props = {
  title: string;
  onPressAction: () => void;
};

const HistoryOptionButton = ({ title, onPressAction }: Props): ReactElement => {
  return (
    <View style={{ flex: 1 }}>
      <Button title={title} onPress={onPressAction}></Button>;
    </View>
  );
};

export default HistoryOptionButton;
