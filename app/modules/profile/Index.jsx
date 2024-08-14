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
                        navigation.navigate('Profile', {
                            screen: 'ProfileUserStack'
                        })
                    }}
                >
                    <View className="flex-row items-center">
                        <Icon name={'account-outline'} color="gray-100" size={25} />
                        <Text className="text-base font-PoppinsSemiBold text-gray-100 ml-3">{'Profil Pengguna'}</Text>
                    </View>
                </TouchableOpacity>

                {moduleAccessArray.includes(14) && (
                    <TouchableOpacity
                        className="border-b border-gray-200 px-4 py-4"
                        onPress={() => {
                            navigation.navigate('Profile', {
                                screen: 'ProfileStoreStack'
                            })
                        }}
                    >
                        <View className="flex-row items-center">
                            <Icon name={'storefront-outline'} color="gray-100" size={25} />
                            <Text className="text-base font-PoppinsSemiBold text-gray-100 ml-3">{'Profil Usaha'}</Text>
                        </View>
                    </TouchableOpacity>
                )}

                <TouchableOpacity
                    className="border-b border-gray-200 px-4 py-4"
                    onPress={() => {
                        navigation.navigate('Profile', {
                            screen: 'TermAndCondition'
                        })
                    }}
                >
                    <View className="flex-row items-center">
                        <Icon name={'file-sign'} color="gray-100" size={25} />
                        <Text className="text-base font-PoppinsSemiBold text-gray-100 ml-3">{'Syarat dan Ketentuan'}</Text>
                    </View>
                </TouchableOpacity>

                <TouchableOpacity
                    className="border-b border-gray-200 px-4 py-4"
                    onPress={() => {
                        navigation.navigate('Profile', {
                            screen: 'Privacy'
                        })
                    }}
                >
                    <View className="flex-row items-center">
                        <Icon name={'file-sign'} color="gray-100" size={25} />
                        <Text className="text-base font-PoppinsSemiBold text-gray-100 ml-3">{'Kebijakan Privasi'}</Text>
                    </View>
                </TouchableOpacity>

                <TouchableOpacity
                    className="border-b border-gray-200 px-4 py-4"
                    onPress={() => {
                        Alert.alert(
                            'Warning',
                            'Apakah anda yakin untuk keluar akun?',
                            [
                                { text: 'Batal', onPress: () => (''), style: 'cancel' },
                                {
                                    text: 'Lanjutkan', onPress: async () => {
                                        try {
                                            await SecureStore.deleteItemAsync('userToken');
                                            await SecureStore.deleteItemAsync('userId');
                                            setUser(null);
                                            setIsLoggedIn(false);
                                            navigation.replace('SignIn');
                                        } catch (error) {
                                            Alert.alert('Warning', 'Gagal keluar akun.');
                                        }
                                    }
                                },
                            ],
                            { cancelable: false }
                        );
                    }}
                >
                    <View className="flex-row items-center">
                        <Icon name={'logout'} color="gray-100" size={25} />
                        <Text className="text-base font-PoppinsSemiBold text-gray-100 ml-3">{'Keluar Akun'}</Text>
                    </View>
                </TouchableOpacity>
            </ScrollView>
        </View>
    )
}

export default Index

const styles = StyleSheet.create({})