import React from 'react'
import CustomDrawerContent from './CustomDrawerContent';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import { createDrawerNavigator } from '@react-navigation/drawer';
import { createStackNavigator } from '@react-navigation/stack';
import { StatusBar } from 'expo-status-bar';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

import ProfileUser from './profile/ProfileUser';
import Privacy from './profile/Privacy';
import TermAndCondition from './profile/TermAndCon';
import ProfileStore from './profile/ProfileStore';

import CreateLocation from './location/Create';
import IndexLocation from './location/Index';
import Switch from './location/Switch';
import IndexProfile from './profile/Index';
import EditLocation from './location/Edit';

import EmployeeIndex from './employee/Index';

const HomeScreen = () => {
  // const { user } = useGlobalContext();
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>Home Screen</Text>
    </View>
  );
};


const HomeStack = createStackNavigator();
const ProfileStack = createStackNavigator();
const LocationStoreStack = createStackNavigator();
const EmployeeStack = createStackNavigator();

function HomeStackNavigator() {
  return (
    <HomeStack.Navigator>
      <HomeStack.Screen name="HomeStack" component={HomeScreen} options={{ headerShown: false }} />
    </HomeStack.Navigator>
  );
}

function ProfileStackNavigator({ navigation }) {
  return (
    <ProfileStack.Navigator
      screenOptions={{
        headerStyle: styles.borderBottomStyle,
      }}
    >
      <ProfileStack.Screen name="ProfileStack" component={IndexProfile} options={{
        headerShown: true,
        headerLeft: () => (
          <TouchableOpacity onPress={() => navigation.goBack()} style={{ marginLeft: 10 }}>
            <Icon name="arrow-left" color="#000" size={25} />
          </TouchableOpacity>
        ),
        headerTitle: 'Profil',
      }} />
      <ProfileStack.Screen name="ProfileUserStack" component={ProfileUser} options={{ headerShown: true, headerTitle: 'Profil Pengguna' }} />
      <ProfileStack.Screen name="ProfileStoreStack" component={ProfileStore} options={{ headerShown: true, headerTitle: 'Profil Toko' }} />
      <ProfileStack.Screen name="Privacy" component={Privacy} options={{ headerShown: true, headerTitle: 'Privasi' }} />
      <ProfileStack.Screen name="TermAndCondition" component={TermAndCondition} options={{ headerShown: true, headerTitle: 'Syarat dan Ketentuan' }} />
    </ProfileStack.Navigator>
  );
}

function LocationStoreStackNavigator({ navigation }) {
  return (
    <LocationStoreStack.Navigator
      screenOptions={{
        headerStyle: styles.borderBottomStyle,
      }}
    >
      <LocationStoreStack.Screen name="LocationStoreStack" component={IndexLocation} options={{
        headerShown: true,
        headerLeft: () => (
          <TouchableOpacity onPress={() => navigation.goBack()} style={{ marginLeft: 10 }}>
            <Icon name="arrow-left" color="#000" size={25} />
          </TouchableOpacity>
        ),
        headerTitle: 'Lokasi',
      }} />
      <LocationStoreStack.Screen name="SwitchLocationStack" component={Switch} options={{
        headerShown: true,
        headerLeft: () => (
          <TouchableOpacity onPress={() => navigation.goBack()} style={{ marginLeft: 10 }}>
            <Icon name="arrow-left" color="#000" size={25} />
          </TouchableOpacity>
        ),
        headerTitle: 'Pilih Lokasi',
      }} />
      <LocationStoreStack.Screen name="LocationCreateStack" component={CreateLocation} options={{ headerShown: true, headerTitle: 'Tambah Lokasi' }} />
      <LocationStoreStack.Screen name="LocationEditStoreStack" component={EditLocation} options={{ headerShown: true, headerTitle: 'Ubah Lokasi' }} />
    </LocationStoreStack.Navigator>
  );
}

function EmployeeStackNavigator({ navigation }) {
  return (
    <EmployeeStack.Navigator
      screenOptions={{
        headerStyle: styles.borderBottomStyle,
      }}
    >
      <EmployeeStack.Screen name="EmployeeStack" component={EmployeeIndex} options={{
        headerShown: true,
        headerLeft: () => (
          <TouchableOpacity onPress={() => navigation.goBack()} style={{ marginLeft: 10 }}>
            <Icon name="arrow-left" color="#000" size={25} />
          </TouchableOpacity>
        ),
        headerTitle: 'Pegawai',
      }} />
      {/* <LocationStoreStack.Screen name="LocationEditStoreStack" component={EditLocation} options={{ headerShown: true, headerTitle: 'Ubah Lokasi' }} /> */}
    </EmployeeStack.Navigator>
  );
}

const Drawer = createDrawerNavigator();
const MainDrawer = () => {
  return (
    <>
      <Drawer.Navigator initialRouteName="Home" drawerContent={(props) => <CustomDrawerContent {...props} />}
        screenOptions={{
          headerStyle: styles.borderBottomStyle,
        }}
      >
        <Drawer.Screen name="Home" component={HomeStackNavigator} options={{ title: 'Beranda', headerShown: true }} />
        <Drawer.Screen name="Profile" component={ProfileStackNavigator} options={{ title: 'Profile', headerShown: false }} />
        <Drawer.Screen name="LocationStore" component={LocationStoreStackNavigator} options={{ title: 'Lokasi', headerShown: false }} />
        <Drawer.Screen name="Employee" component={EmployeeStackNavigator} options={{ title: 'Lokasi', headerShown: false }} />
      </Drawer.Navigator>
      <StatusBar backgroundColor='#fff' className="dark" style="light" />
    </>
  )
}

export default MainDrawer

const styles = StyleSheet.create({
  borderBottomStyle: {
    borderBottomWidth: 1,
    borderBottomColor: '#ddd', // Border color
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4, // For Android shadow
    backgroundColor: '#fff', // Background color to cover shadows properly
  },
});