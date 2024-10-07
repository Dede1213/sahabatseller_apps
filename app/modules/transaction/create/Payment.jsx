import { ScrollView, StyleSheet, Text, View } from 'react-native'
import React, { useState } from 'react'
import { TouchableOpacity } from 'react-native'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useGlobalContext } from '../../../../context/globalProvider'
import { useNavigation } from '@react-navigation/native';
import AlertModal from '../../../../components/AlertModal';
import { FormatAmount } from '../../../../lib/globalFunction';

const Payment = () => {
    const navigation = useNavigation();
    const { user, transaction, setTransaction } = useGlobalContext()
    const moduleAccess = user?.module_access;
    const moduleAccessArray = moduleAccess ? moduleAccess.split(',').map(Number) : [];

    /* Alert */
    const [isAlertVisible, setIsAlertVisible] = useState(false);
    const [alertMessage, setAlertMessage] = useState('');
    const [alertTitle, setAlertTitle] = useState('');
    const showAlert = (title, message) => {
        setAlertTitle(title);
        setAlertMessage(message);
        setIsAlertVisible(true);
    };
    const closeAlert = () => {
        setIsAlertVisible(false);
    };
    /* End Alert */

    return (
        <View className="flex-1 bg-white">
            <AlertModal visible={isAlertVisible} header={alertTitle} message={alertMessage} onClose={closeAlert} />
            <ScrollView className="flex-1">
                <View className="bg-gray-200 flex items-center justify-center py-10">
                    <Text className="text-lg font-PoppinsSemiBold text-secondary-200 mb-2">Total Tagihan</Text>
                    <Text className="text-4xl font-PoppinsSemiBold text-secondary-200">Rp. {transaction.total_amount ? FormatAmount(transaction.total_amount) : 0}</Text>
                </View>
                <TouchableOpacity
                    className="border-b border-gray-200 px-4 py-4"
                    onPress={() => {
                        navigation.navigate('Transaction', {
                            screen: 'CashTransactionStack'
                        })
                    }}
                >
                    <View className="flex-row items-center" testID="item-001">
                        <Icon name={'arrow-right-bold'} color="gray-100" size={25} />
                        <Text className="text-base font-PoppinsSemiBold text-gray-100 ml-3">{'Tunai'}</Text>
                    </View>
                </TouchableOpacity>

                <TouchableOpacity
                    className="border-b border-gray-200 px-4 py-4"
                    onPress={() => {
                        navigation.navigate('Transaction', {
                            screen: 'DebtTransactionStack'
                        })
                    }}
                >
                    <View className="flex-row items-center" testID="item-001">
                        <Icon name={'arrow-right-bold'} color="gray-100" size={25} />
                        <Text className="text-base font-PoppinsSemiBold text-gray-100 ml-3">{'Hutang'}</Text>
                    </View>
                </TouchableOpacity>

                <TouchableOpacity
                    className="border-b border-gray-200 px-4 py-4"
                    onPress={() => {
                        navigation.navigate('Transaction', {
                            screen: 'OtherTransactionStack'
                        })
                    }}
                >
                    <View className="flex-row items-center" testID="item-001">
                        <Icon name={'arrow-right-bold'} color="gray-100" size={25} />
                        <Text className="text-base font-PoppinsSemiBold text-gray-100 ml-3">{'Lainya'}</Text>
                    </View>
                </TouchableOpacity>
            </ScrollView>
        </View>
    )
}

export default Payment

const styles = StyleSheet.create({})