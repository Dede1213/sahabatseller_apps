import React from 'react'
import CustomDrawerContent from './CustomDrawerContent';
import { StyleSheet, Text, View } from 'react-native'
import { createDrawerNavigator } from '@react-navigation/drawer';
import { useGlobalContext } from '../../context/globalProvider'
import { StatusBar } from 'expo-status-bar';
import ProfileScreen from './ProfileScreen';
import ProfileUser from './profile/ProfileUser';
import Privacy from './profile/Privacy';
import TermAndCondition from './profile/TermAndCondition';
import ProfileStore from './profile/ProfileStore';


const Drawer = createDrawerNavigator();

const HomeScreen = () => {
  // const { user } = useGlobalContext();
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>Home Screen</Text>
    </View>
  );
};


const Settings = () => {
  const { user } = useGlobalContext();
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>Profile Screen {user?.email}</Text>
    </View>
  )
};

const MainDrawer = () => {
  return (
    <>
      <Drawer.Navigator initialRouteName="Beranda" drawerContent={(props) => <CustomDrawerContent {...props} />}>
        <Drawer.Screen name="Beranda" component={HomeScreen} />
        <Drawer.Screen name="Profil" component={ProfileScreen} />
        <Drawer.Screen name="Profile Pengguna" component={ProfileUser}/>
        <Drawer.Screen name="Informasi Usaha" component={ProfileStore}/>
        <Drawer.Screen name="Kebijakan Privasi" component={Privacy}/>
        <Drawer.Screen name="Syarat dan Ketentuan" component={TermAndCondition}/>
        <Drawer.Screen name="Pengaturan" component={Settings} />
      </Drawer.Navigator>
      <StatusBar backgroundColor='#fff' className="dark" style="light" />
    </>
  )
}

export default MainDrawer