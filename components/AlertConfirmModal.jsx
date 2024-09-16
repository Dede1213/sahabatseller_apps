import React, { useState } from 'react';
import { TouchableOpacity } from 'react-native';
import { Modal, View, Text, Button, StyleSheet } from 'react-native';

const AlertConfirmModal = ({ visible, header, message, onClose, onAccept }) => {
    return (
        <Modal
            transparent={true}
            animationType="fade"
            visible={visible}
            onRequestClose={onClose}
        >
            <View style={styles.modalBackground}>
                <View style={styles.modalContainer}>
                    <Text className="text-black mb-4 text-lg">{header}</Text>
                    <Text style={styles.messageText} className="text-gray-100 font-PoppinsRegular">{message}</Text>
                    <View className="mt-4 flex-row ">
                        <View className="mr-2">
                            <TouchableOpacity
                                onPress={onClose}
                                activeOpacity={0.7}
                                className='rounded-[3px] min-h-[30px] justify-center items-center bg-secondary'
                            >
                                <Text className='font-PoppinsRegular text-m text-white px-6' testID='btn-batal'>
                                    Batal
                                </Text>
                            </TouchableOpacity>
                        </View>
                        <View className="">
                        <TouchableOpacity
                                onPress={onAccept}
                                activeOpacity={0.7}
                                className='rounded-[3px] min-h-[30px] justify-center items-center bg-yellow-400'
                            >
                                <Text className='font-PoppinsRegular text-m text-white px-6' testID='btn-lanjut'>
                                    Lanjutkan
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    modalBackground: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContainer: {
        width: 300,
        padding: 20,
        backgroundColor: 'white',
        borderRadius: 10,
        alignItems: 'left',
    },
    messageText: {
        marginBottom: 20,
        textAlign: 'left',
    },
});

export default AlertConfirmModal;
