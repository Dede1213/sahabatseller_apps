import { StyleSheet, Text, View, Image } from 'react-native'
import React from 'react'
import { images } from '../constants'
import CustomButton from './CustomButton'
import { router } from 'expo-router'

const EmptyState = ({ title, subtitle }) => {
  return (
    <View className="justify-center px-4 items-center">
        <Image source={images.empty} className="w-[270px] h-[215px]"  resizeMode='contain' />
        <Text className="text-sm font-PoppinsMedium text-gray-100">{subtitle}</Text>
        <Text className="text-xl font-PoppinsSemiBold text-white mt-2">{title}</Text>

        <CustomButton
          title="Create Video"
          handlePress={() => router.push('/create')}
          containerStyles="w-full my-5" 
          textStyles="text-white"
        />
    </View>
  )
}

export default EmptyState
