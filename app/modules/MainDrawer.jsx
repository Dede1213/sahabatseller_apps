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
import IndexProfile from './profile/Index';

import CreateLocation from './location/Create';
import IndexLocation from './location/Index';
import Switch from './location/Switch';
import EditLocation from './location/Edit';

import CreateCustomer from './customer/Create';
import IndexCustomer from './customer/Index';
import EditCustomer from './customer/Edit';

import IndexCashFlow from './cashflow/Index';
import ViewCashFlow from './cashflow/cashflow/Index';
import CreateCashFlow from './cashflow/cashflow/Create';
import EditCashFlow from './cashflow/cashflow/Edit';
import ViewCatFlow from './cashflow/category/Index';
import CreateCatFlow from './cashflow/category/Create';
import EditCatFlow from './cashflow/category/Edit';

import EmployeeIndex from './employee/Index';
import EmployeeView from './employee/Employee';
import EmployeeAdd from './employee/EmployeeAdd';
import EmployeeEdit from './employee/EmployeeEdit';
import RoleView from './employee/Role';
import RoleAdd from './employee/RoleAdd';
import RoleEdit from './employee/RoleEdit';

const CustomHeaderLeft = ({ onPress }) => (
  <TouchableOpacity onPress={onPress} className="ml-2">
    <Icon name="menu" color="#000" size={25} testID="open-drawer-button" />
  </TouchableOpacity>
);

const CustomHeaderLeftBack = ({ onPress }) => (
  <TouchableOpacity onPress={onPress} className="ml-2">
    <Icon name="arrow-left" color="#000" size={25} testID="menu-back-button" />
  </TouchableOpacity>
);


const HomeScreen = () => {
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
const CustomerStack = createStackNavigator();
const CashFlowStack = createStackNavigator();

function HomeStackNavigator() {
  return (
    <HomeStack.Navigator>
      <HomeStack.Screen name="HomeStack" component={HomeScreen}
        options={({ navigation }) => ({
          headerShown: true,
          headerLeft: () => <CustomHeaderLeft onPress={() => navigation.openDrawer()} />,
          headerTitle: 'Beranda',
        })}
      />
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
      <ProfileStack.Screen name="ProfileStack" component={IndexProfile}
        options={({ navigation }) => ({
          headerShown: true,
          headerLeft: () => <CustomHeaderLeft onPress={() => navigation.openDrawer()} />,
          headerTitle: 'Profil',
        })}
      />
      <ProfileStack.Screen name="ProfileUserStack" component={ProfileUser}
        options={({ navigation }) => ({
          headerShown: true,
          headerLeft: () => <CustomHeaderLeftBack onPress={() => navigation.popToTop()} />,
          headerTitle: 'Profil Pengguna',
        })}
      />
      <ProfileStack.Screen name="ProfileStoreStack" component={ProfileStore}
        options={({ navigation }) => ({
          headerShown: true,
          headerLeft: () => <CustomHeaderLeftBack onPress={() => navigation.popToTop()} />,
          headerTitle: 'Profil Toko',
        })}
      />
      <ProfileStack.Screen name="Privacy" component={Privacy}
        options={({ navigation }) => ({
          headerShown: true,
          headerLeft: () => <CustomHeaderLeftBack onPress={() => navigation.popToTop()} />,
          headerTitle: 'Privasi',
        })}
      />
      <ProfileStack.Screen name="TermAndCondition" component={TermAndCondition}
        options={({ navigation }) => ({
          headerShown: true,
          headerLeft: () => <CustomHeaderLeftBack onPress={() => navigation.popToTop()} />,
          headerTitle: 'Syarat dan Ketentuan',
        })}
      />
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
      <LocationStoreStack.Screen name="LocationStoreStack" component={IndexLocation}
        options={{
          headerShown: true,
          headerLeft: () => <CustomHeaderLeft onPress={() => navigation.openDrawer()} />,
          headerTitle: 'Lokasi',
        }}
      />
      <LocationStoreStack.Screen name="SwitchLocationStack" component={Switch}
        options={{
          headerShown: true,
          headerLeft: () => <CustomHeaderLeft onPress={() => navigation.openDrawer()} />,
          headerTitle: 'Pilih Lokasi',
        }}
      />
      <LocationStoreStack.Screen name="LocationCreateStack" component={CreateLocation}
        options={{
          headerShown: true,
          headerLeft: () => <CustomHeaderLeftBack onPress={() => navigation.popToTop()} />,
          headerTitle: 'Tambah Lokasi',
        }}
      />
      <LocationStoreStack.Screen name="LocationEditStoreStack" component={EditLocation}
        options={{
          headerShown: true,
          headerLeft: () => <CustomHeaderLeftBack onPress={() => navigation.popToTop()} />,
          headerTitle: 'Ubah Lokasi',
        }}
      />
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
        headerLeft: () => <CustomHeaderLeft onPress={() => navigation.openDrawer()} />,
        headerTitle: 'Pegawai',
      }} />
      <EmployeeStack.Screen name="EmployeeViewStack" component={EmployeeView}
        options={{
          headerShown: true,
          headerLeft: () => <CustomHeaderLeftBack onPress={() => navigation.popToTop()} />,
          headerTitle: 'Pegawai',
        }}
      />
      <EmployeeStack.Screen name="EmployeeAddStack" component={EmployeeAdd}
        options={{
          headerShown: true,
          headerLeft: () => <CustomHeaderLeftBack onPress={() => navigation.popToTop()} />,
          headerTitle: 'Tambah Pegawai',
        }}
      />
      <EmployeeStack.Screen name="EmployeeEditStack" component={EmployeeEdit}
        options={{
          headerShown: true,
          headerLeft: () => <CustomHeaderLeftBack onPress={() => navigation.popToTop()} />,
          headerTitle: 'Ubah Pegawai',
        }}
      />
      <EmployeeStack.Screen name="RoleViewStack" component={RoleView}
        options={{
          headerShown: true,
          headerLeft: () => <CustomHeaderLeftBack onPress={() => navigation.popToTop()} />,
          headerTitle: 'Hak Akses',
        }}
      />
      <EmployeeStack.Screen name="RoleAddStack" component={RoleAdd}
        options={{
          headerShown: true,
          headerLeft: () => <CustomHeaderLeftBack onPress={() => navigation.popToTop()} />,
          headerTitle: 'Tambah Hak Akses',
        }}
      />
      <EmployeeStack.Screen name="RoleEditStack" component={RoleEdit}
        options={{
          headerShown: true,
          headerLeft: () => <CustomHeaderLeftBack onPress={() => navigation.popToTop()} />,
          headerTitle: 'Ubah Hak Akses',
        }}
      />
    </EmployeeStack.Navigator>

  );
}

function CustomerStackNavigator({ navigation }) {
  return (
    <CustomerStack.Navigator
      screenOptions={{
        headerStyle: styles.borderBottomStyle,
      }}
    >
      <CustomerStack.Screen name="CustomerStack" component={IndexCustomer}
        options={{
          headerShown: true,
          headerLeft: () => <CustomHeaderLeft onPress={() => navigation.openDrawer()} />,
          headerTitle: 'Pelanggan',
        }}
      />
      <CustomerStack.Screen name="CustomerCreateStack" component={CreateCustomer}
        options={{
          headerShown: true,
          headerLeft: () => <CustomHeaderLeftBack onPress={() => navigation.popToTop()} />,
          headerTitle: 'Tambah Pelanggan',
        }}
      />
      <CustomerStack.Screen name="CustomerEditStack" component={EditCustomer}
        options={{
          headerShown: true,
          headerLeft: () => <CustomHeaderLeftBack onPress={() => navigation.popToTop()} />,
          headerTitle: 'Ubah Pelanggan',
        }}
      />
    </CustomerStack.Navigator>
  );
}

function CashFlowStackNavigator({ navigation }) {
  return (
    <CashFlowStack.Navigator
      screenOptions={{
        headerStyle: styles.borderBottomStyle,
      }}
    >
      <CashFlowStack.Screen name="CashFlowStack" component={IndexCashFlow}
        options={{
          headerShown: true,
          headerLeft: () => <CustomHeaderLeft onPress={() => navigation.openDrawer()} />,
          headerTitle: 'Arus Kas',
        }}
      />
      <CashFlowStack.Screen name="CashFlowViewStack" component={ViewCashFlow}
        options={{
          headerShown: true,
          headerLeft: () => <CustomHeaderLeftBack onPress={() => navigation.popToTop()} />,
          headerTitle: 'Arus Kas',
        }}
      />
      <CashFlowStack.Screen name="CashFlowCreateStack" component={CreateCashFlow}
        options={{
          headerShown: true,
          headerLeft: () => <CustomHeaderLeftBack onPress={() => navigation.popToTop()} />,
          headerTitle: 'Tambah Arus Kas',
        }}
      />
      <CashFlowStack.Screen name="CashFlowEditStack" component={EditCashFlow}
        options={{
          headerShown: true,
          headerLeft: () => <CustomHeaderLeftBack onPress={() => navigation.popToTop()} />,
          headerTitle: 'Ubah Arus Kas',
        }}
      />
      <CashFlowStack.Screen name="CatFlowViewStack" component={ViewCatFlow}
        options={{
          headerShown: true,
          headerLeft: () => <CustomHeaderLeftBack onPress={() => navigation.popToTop()} />,
          headerTitle: 'Kategori Arus Kas',
        }}
      />
      <CashFlowStack.Screen name="CatFlowCreateStack" component={CreateCatFlow}
        options={{
          headerShown: true,
          headerLeft: () => <CustomHeaderLeftBack onPress={() => navigation.popToTop()} />,
          headerTitle: 'Tambah Kategori Arus Kas',
        }}
      />
      <CashFlowStack.Screen name="CatFlowEditStack" component={EditCatFlow}
        options={{
          headerShown: true,
          headerLeft: () => <CustomHeaderLeftBack onPress={() => navigation.popToTop()} />,
          headerTitle: 'Ubah Kategori Arus Kas',
        }}
      />
    </CashFlowStack.Navigator>
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
        <Drawer.Screen name="Home" component={HomeStackNavigator} options={{ title: 'Beranda', headerShown: false }} />
        <Drawer.Screen name="Profile" component={ProfileStackNavigator} options={{ title: 'Profile', headerShown: false }} />
        <Drawer.Screen name="LocationStore" component={LocationStoreStackNavigator} options={{ title: 'Lokasi', headerShown: false }} />
        <Drawer.Screen name="Employee" component={EmployeeStackNavigator} options={{ title: 'Lokasi', headerShown: false }} />
        <Drawer.Screen name="Customer" component={CustomerStackNavigator} options={{ title: 'Pelanggan', headerShown: false }} />
        <Drawer.Screen name="CashFlow" component={CashFlowStackNavigator} options={{ title: 'Arus Kas', headerShown: false }} />
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