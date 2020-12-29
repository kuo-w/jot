import { useEffect, useState } from "react";
import { Keyboard } from "react-native";

const useKeyboard = () => {
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
    };

    return visible;
};

export default useKeyboard;
