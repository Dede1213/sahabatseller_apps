import { TouchableOpacity, Text } from 'react-native'
import React from 'react'

const CustomButton = ({ title, handlePress, containerStyles, textStyles, isLoading }) => {
    return (
        <TouchableOpacity
            onPress={handlePress}
            activeOpacity={0.7}
            className={`rounded-[25px] min-h-[48px] justify-center items-center ${containerStyles} ${isLoading ? 'opacity-50' : ''}`}
            disabled={isLoading}
        >
            <Text className={`font-PoppinsRegular text-xl ${textStyles}`}>
                {isLoading ? 'Loading...' : title}
            </Text>
        </TouchableOpacity>
    )
}

export default CustomButton
