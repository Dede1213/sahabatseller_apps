import React from 'react'
import { SplashScreen } from 'expo-router'
import { useFonts } from 'expo-font'
import { useEffect } from 'react'
import { createStackNavigator } from '@react-navigation/stack';
import { SafeAreaProvider } from 'react-native-safe-area-context'
import { NavigationContainer, useLinking } from '@react-navigation/native';
import GlobalProvider from '../context/globalProvider.jsx'
import { Linking } from 'react-native';


import MainDrawer from './modules/MainDrawer.jsx'
import SignIn from './(auth)/sign-in.jsx'
import SignUp from './(auth)/sign-up.jsx'
import IndexScreen from './IndexScreen.jsx'
import PrintExample from './print-example/print-example.jsx';

SplashScreen.preventAutoHideAsync();

const linking = {
    prefixes: ['sahabatseller://'],
    config: {
      screens: {
        IndexScreen: 'index',
        MainDrawer: 'main',
        SignIn: 'sign-in',
        SignUp: 'sign-up',
      },
    },
  };

export default function App() {
    const [fontsLoaded, error] = useFonts({
        "PoppinsBlack": require("../assets/fonts/Poppins-Black.ttf"),
        "PoppinsBold": require("../assets/fonts/Poppins-Bold.ttf"),
        "PoppinsMedium": require("../assets/fonts/Poppins-Medium.ttf"),
        "PoppinsSemiBold": require("../assets/fonts/Poppins-SemiBold.ttf"),
        "PoppinsExtraLight": require("../assets/fonts/Poppins-ExtraLight.ttf"),
        "PoppinsExtraBold": require("../assets/fonts/Poppins-ExtraBold.ttf"),
        "PoppinsThin": require("../assets/fonts/Poppins-Thin.ttf"),
        "PoppinsLight": require("../assets/fonts/Poppins-Light.ttf"),
        "PoppinsRegular": require("../assets/fonts/Poppins-Regular.ttf"),
    });

    useEffect(() => {
        if (error) throw error;
        if (fontsLoaded) SplashScreen.hideAsync();
    }, [fontsLoaded, error]);

    if (!fontsLoaded && !error) {
        return null;
    }

    const Stack = createStackNavigator();

    return (
        <GlobalProvider>
            <NavigationContainer independent={true} linking={linking}>
                <SafeAreaProvider>
                    <Stack.Navigator initialRouteName="IndexScreen" screenOptions={{ headerShown: false }}>
                        <Stack.Screen name="IndexScreen">
                            {(props) => <IndexScreen {...props} />}
                        </Stack.Screen>
                        <Stack.Screen name="MainDrawer">
                            {(props) => <MainDrawer {...props} />}
                        </Stack.Screen>
                        <Stack.Screen name="SignIn">
                            {(props) => <SignIn {...props} />}
                        </Stack.Screen>
                        <Stack.Screen name="SignUp">
                            {(props) => <SignUp {...props} />}
                        </Stack.Screen>
                        <Stack.Screen name="PrintExample">
                            {(props) => <PrintExample {...props} />}
                        </Stack.Screen>
                    </Stack.Navigator>
                </SafeAreaProvider>
            </NavigationContainer>
        </GlobalProvider>
    )
}