import { Alert } from "react-native";

export const ConfirmAlert = (title, message, onConfirm) => {
    Alert.alert(
        title,
        message,
        [
            {
                text: "Batal",
                onPress: () => { },
                style: "cancel",
            },
            {
                text: "Lanjutkan",
                onPress: onConfirm,
            },
        ],
        { cancelable: true }
    );
}
