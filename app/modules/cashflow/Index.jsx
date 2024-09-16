import { ScrollView, StyleSheet, Text, View } from 'react-native'
import React, { useState } from 'react'
import { TouchableOpacity } from 'react-native'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useGlobalContext } from '../../../context/globalProvider'
import { useNavigation } from '@react-navigation/native';
import AlertModal from '../../../components/AlertModal';

const Index = () => {
    const navigation = useNavigation();
    const { user} = useGlobalContext()
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
                <TouchableOpacity
                    className="border-b border-gray-200 px-4 py-4"
                    onPress={() => {
                        navigation.navigate('CashFlow', {
                            screen: 'CashFlowViewStack'
                        })
                    }}
                >
                    <View className="flex-row items-center" testID="item-001">
                        <Icon name={'arrow-right-bold'} color="gray-100" size={25} />
                        <Text className="text-base font-PoppinsSemiBold text-gray-100 ml-3">{'Arus Kas'}</Text>
                    </View>
                </TouchableOpacity>

                {moduleAccessArray.includes(14) && (
                    <TouchableOpacity
                        className="border-b border-gray-200 px-4 py-4"
                        onPress={() => {
                            if (user?.is_head_office == 'YA') {
                                navigation.navigate('CashFlow', {
                                    screen: 'CatFlowViewStack'
                                })
                            } else {
                                showAlert('Warning!', 'Lokasi anda bukan pusat.');
                            }
                        }}
                    >
                        <View className="flex-row items-center" testID="item-002">
                            <Icon name={'arrow-right-bold'} color="gray-100" size={25} />
                            <Text className="text-base font-PoppinsSemiBold text-gray-100 ml-3">{'Kategori Arus Kas'}</Text>
                        </View>
                    </TouchableOpacity>
                )}
            </ScrollView>
        </View>
    )
}

export default Index

const styles = StyleSheet.create({})