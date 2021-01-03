import { useEffect, useState } from "react";
import { Keyboard } from "react-native";

type Props = {
    onHide?: () => void;
};

const useKeyboard = (props?: Props) => {
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        Keyboard.addListener("keyboardDidShow", _keyboardDidShow);
        Keyboard.addListener("keyboardDidHide", _keyboardDidHide);

        // cleanup function
        return () => {
            Keyboard.removeListener("keyboardDidShow", _keyboardDidShow);
            Keyboard.removeListener("keyboardDidHide", _keyboardDidHide);
        };
    }, []);

    const _keyboardDidShow = () => {
        setVisible(true);
    };

    const _keyboardDidHide = () => {
        setVisible(false);
        if (props?.onHide) props.onHide();
    };

    return visible;
};

export default useKeyboard;
