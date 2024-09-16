import React from 'react';
import { StyleSheet, ActivityIndicator } from 'react-native';
import { BlurView } from 'expo-blur';
import { View } from 'react-native-animatable';

const BlurComponent = () => {
    return (
        <BlurView intensity={50} style={styles.blur}>
            
        </BlurView>
    );
};

const styles = StyleSheet.create({
    blur: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(255, 255, 255, 0.5)',
    },
});

export default BlurComponent;
