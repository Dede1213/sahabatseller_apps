import { ScrollView, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { TouchableOpacity } from 'react-native'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useGlobalContext } from '../../../context/globalProvider'
import { useNavigation } from '@react-navigation/native';

const Index = () => {
    const navigation = useNavigation();
    const { user, setUser, setIsLoggedIn } = useGlobalContext()
    const moduleAccess = user?.module_access;
    const moduleAccessArray = moduleAccess ? moduleAccess.split(',').map(Number) : [];

    return (
        <View className="flex-1 bg-white">
            <ScrollView className="flex-1">
                <TouchableOpacity
                    className="border-b border-gray-200 px-4 py-4"
                    onPress={() => {
                        navigation.navigate('Employee', {
                            screen: 'EmployeeViewStack'
                        })
                    }}
                >
                    <View className="flex-row items-center" testID="item-001">
                        <Icon name={'human-male-board-poll'} color="gray-100" size={25} />
                        <Text className="text-base font-PoppinsSemiBold text-gray-100 ml-3">{'Data Pegawai'}</Text>
                    </View>
                </TouchableOpacity>

                {moduleAccessArray.includes(14) && (
                    <TouchableOpacity
                        className="border-b border-gray-200 px-4 py-4"
                        onPress={() => {
                            navigation.navigate('Employee', {
                                screen: 'RoleViewStack'
                            })
                        }}
                    >
                        <View className="flex-row items-center" testID="item-002">
                            <Icon name={'account-lock-outline'} color="gray-100" size={25} />
                            <Text className="text-base font-PoppinsSemiBold text-gray-100 ml-3">{'Hak Akses'}</Text>
                        </View>
                    </TouchableOpacity>
                )}
            </ScrollView>
        </View>
    )
}

export default Index

const styles = StyleSheet.create({})