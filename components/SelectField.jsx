import React, { useState } from 'react';
import { View, Text, StyleSheet, Alert } from 'react-native';
import { Dropdown } from 'react-native-element-dropdown';
import AntDesign from '@expo/vector-icons/AntDesign';
import { TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';


const SelectField = ({ title, data, value, onValueChange, otherStyles, placeholder, handleChangeText, handleBlur, info, dropdownPosition, testId }) => {
    const [isFocus, setIsFocus] = useState(false);
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
            <View>

                <Dropdown
                    testID={testId ? testId : ''}
                    dropdownPosition={dropdownPosition ? dropdownPosition : "bottom"}
                    style={[styles.dropdown, isFocus && { borderColor: '#1a7dcf' }]}
                    placeholderStyle={styles.placeholderStyle}
                    selectedTextStyle={styles.selectedTextStyle}
                    inputSearchStyle={styles.inputSearchStyle}
                    iconStyle={styles.iconStyle}
                    itemTextStyle={styles.itemTextStyle}
                    data={data}
                    search
                    maxHeight={300}
                    labelField="label"
                    valueField="value"
                    placeholder={!isFocus ? placeholder : '...'}
                    searchPlaceholder="Search..."
                    value={value}
                    onFocus={() => setIsFocus(true)}
                    onBlur={() => {
                        setIsFocus(false)
                        handleBlur
                    }
                    }
                    onChange={item => {
                        handleChangeText
                        onValueChange(item.value);
                        setIsFocus(false);
                    }}
                    renderLeftIcon={() => (
                        <AntDesign
                            style={styles.icon}
                            color={isFocus ? '#1a7dcf' : '#494952'}
                            name="Safety"
                            size={20}
                        />
                    )}
                />
            </View>
        </View>
    );
}

export default SelectField

const styles = StyleSheet.create({
    itemTextStyle: {
        fontSize: 16,
        color: '#494952',
    },
    dropdown: {
        height: 50,
        borderColor: '#e5e7eb',
        borderWidth: 2,
        borderRadius: 8,
        paddingHorizontal: 8,
    },
    icon: {
        marginRight: 5,
    },
    placeholderStyle: {
        fontSize: 16,
        color: '#494952',
    },
    selectedTextStyle: {
        fontSize: 16,
        color: '#494952',
    },
    iconStyle: {
        width: 20,
        height: 20,
    },
    inputSearchStyle: {
        height: 40,
        fontSize: 16,
        color: '#494952',
    },
});