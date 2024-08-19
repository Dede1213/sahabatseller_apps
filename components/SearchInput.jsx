import { TextInput, TouchableOpacity, View, Image } from 'react-native'
import React, { useState } from 'react'
import { icons } from '../constants'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const SearchInput = ({ searchQuery, setSearchQuery, orderBy, setOrderBy, filter, setFilter, placeholder, setIsloading, searchStyle, txtId, btnId }) => {
    const [inputText, setInputText] = useState('');
    const handleSubmit = () => {
        setIsloading(true);
        setSearchQuery(inputText);
    };
    return (
        <View className="flex-row items-center">
            <View className={`border-2 border-gray-200 h-[50px] px-4 bg-primary rounded-xl focus:border-gray-100 items-center flex-row space-x-4 ${searchStyle}`}>
                <TextInput
                    className="text-base mt-0.5 text-gray-100 font-poppinsRegular flex-1"
                    value={inputText}
                    placeholder={searchQuery ? searchQuery : placeholder}
                    placeholderTextColor="#CDCDE0"
                    onChangeText={setInputText}
                    onSubmitEditing={handleSubmit}
                    testID={txtId ? txtId : ''}
                />

                <TouchableOpacity
                    onPress={() => {
                        handleSubmit();
                    }}
                >
                    <View className="flex-row items-center justify-center" testID={btnId ? btnId : ''}>
                        <Image
                            source={icons.search}
                            className="w-5 h-5 ml-2"
                            resizeMode='contain'
                        />
                    </View>
                </TouchableOpacity>
            </View>
            {orderBy && !filter && <TouchableOpacity
                onPress={() => {
                    setIsloading(true);
                    if (orderBy === 'asc') {
                        setOrderBy('desc');
                    } else {
                        setOrderBy('asc');
                    }
                }}
            >
                <View className="flex-row items-center justify-center ml-3 mt-4">
                    <Icon name={orderBy==='asc' ? 'sort-ascending' : 'sort-descending'} color="#1a7dcf" size={35} />
                </View>
            </TouchableOpacity>}

            {filter && <TouchableOpacity
                onPress={() => {
                    setIsloading(true);
                    if (orderBy === 'asc') {
                        setOrderBy('desc');
                    } else {
                        setOrderBy('asc');
                    }
                }}
            >
                <View className="flex-row items-center justify-center ml-3 mt-4">
                    <Icon name="filter-menu-outline" color="#1a7dcf" size={35} />
                </View>
            </TouchableOpacity>}

        </View>
    )
}

export default SearchInput