import { Alert, ScrollView, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { TouchableOpacity } from 'react-native'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useGlobalContext } from '../../../context/globalProvider'
import { useNavigation } from '@react-navigation/native';
import * as SecureStore from 'expo-secure-store';
import { useIsFocused } from '@react-navigation/native';

const Index = () => {
    const navigation = useNavigation();
    const isFocused = useIsFocused();
    const { user, setUser, setIsLoggedIn } = useGlobalContext()
    const moduleAccess = user?.module_access;
    const moduleAccessArray = moduleAccess ? moduleAccess.split(',').map(Number) : [];

    return (
        <View className="flex-1 bg-white">
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
                                Alert.alert('Lokasi anda bukan pusat.')
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