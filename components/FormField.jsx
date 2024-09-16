import { StyleSheet, Text, TextInput, TouchableOpacity, View, Image, Alert } from 'react-native'
import React, { useState } from 'react'
import { icons } from '../constants'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const FormField = ({ title, value, handleChangeText, otherStyles, otherTextInputStyles, placeholder, keyboardType, handleBlur, editable, info, multiline, numberOfLines, testId, ...proops }) => {
    const [showPassword, setShowPassword] = useState(false)
    const [showPasswordConfirm, setShowPasswordConfirm] = useState(false)
    const [showPasswordNew, setShowPasswordNew] = useState(false)
    return (
        <View className={`space-y-2 ${otherStyles}`}>
            <View className="flex-row">
                <Text className="text-base font-PoppinsMedium text-gray-100">{title}</Text>
                {info &&
                    <TouchableOpacity className="ml-1 flex-row items-center" onPress={() => Alert.alert("Informasi", info)}>
                        <Icon name={'information-outline'} color="#7b7b8b" size={23} />
                        <Text className="text-sm font-PoppinsRegular text-gray-50">Info</Text>
                    </TouchableOpacity>
                }
            </View>
            <View className={`border-2 border-gray-200 w-full px-4 rounded-xl focus:border-secondary items-center flex-row ${otherTextInputStyles}`}>
                <TextInput
                    className="flex-1 text-gray-100 font-poppinsSemiBold text-base"
                    value={value}
                    placeholder={placeholder}
                    placeholderTextColor="#7b7b8b"
                    onChangeText={handleChangeText}
                    onBlur={handleBlur}
                    secureTextEntry={title === 'Password' && !showPassword || title === 'Password Baru' && !showPasswordNew || title === 'Konfirmasi Password Baru' && !showPasswordConfirm}
                    keyboardType={keyboardType}
                    editable={editable}
                    multiline={multiline ? multiline : false}
                    numberOfLines={numberOfLines ? numberOfLines : 2}
                    testID={testId ? testId : ''}
                />

                {title === 'Password' && (
                    <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                        <Image source={showPassword ? icons.eye : icons.eyeHide} className="w-6 h-6 py-[21px]" resizeMode='contain' />
                    </TouchableOpacity>
                )}

                {title === 'Password Baru' && (
                    <TouchableOpacity onPress={() => setShowPasswordNew(!showPasswordNew)}>
                        <Image source={showPasswordNew ? icons.eye : icons.eyeHide} className="w-6 h-6 py-[21px]" resizeMode='contain' />
                    </TouchableOpacity>
                )}

                {title === 'Konfirmasi Password Baru' && (
                    <TouchableOpacity onPress={() => setShowPasswordConfirm(!showPasswordConfirm)}>
                        <Image source={showPasswordConfirm ? icons.eye : icons.eyeHide} className="w-6 h-6 py-[21px]" resizeMode='contain' />
                    </TouchableOpacity>
                )}

                {title === 'Pilih Produk' && (
                    <Image source={icons.search} className="w-6 h-6 py-[21px]" resizeMode='contain' />
                )}
            </View>
        </View>
    )
}

export
    default FormField