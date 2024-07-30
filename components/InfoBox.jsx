import { StyleSheet, Text, View } from 'react-native'
import React from 'react'

const InfoBox = ({ title, subtitle, containerStyles, titleStyles }) => {
    return (
        <View className={containerStyles}>
            <Text className={`text-white text-center font-poppinsemiBold ${titleStyles}`}>{title}</Text>
            <Text className={`text-sm text-gray-100 text-center font-poppinregular`}>{subtitle}</Text>
        </View>
    )
}

export default InfoBox