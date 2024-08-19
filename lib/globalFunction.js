import { Alert } from "react-native";
import { format } from 'date-fns';
import { id } from 'date-fns/locale';

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

export const CapitalizeEachWord = (str) => {
    return str.replace(/\b\w/g, (char) => char.toUpperCase());
}

export const FormatDate = (date) => {
    return format(new Date(date), 'dd MMM yyyy', { locale: id })
}

export const FormatAmount = (amount) => {
    return new Intl.NumberFormat('id-ID').format(amount)
}