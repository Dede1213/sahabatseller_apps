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

import ItemIndex from './item/Index';
import ItemViewIndex from './item/item/Index';
import ItemEdit from './item/item/Edit';
import ItemCreate from './item/item/Create';

import ItemVariantIndex from './item/variant/Index';
import ItemVariantEdit from './item/variant/Edit';
import ItemVariantCreate from './item/variant/Create';
import ItemVariantAdjust from './item/variant/Adjust';

import ItemCategoryIndex from './item/category/Index';
import ItemCategoryEdit from './item/category/Edit';
import ItemCategoryCreate from './item/category/Create';

import ItemBrandIndex from './item/brand/Index';
import ItemBrandEdit from './item/brand/Edit';
import ItemBrandCreate from './item/brand/Create';

import ItemMaterialIndex from './item/material/Index';
import ItemMaterialEdit from './item/material/Edit';
import ItemMaterialCreate from './item/material/Create';
import ItemMaterialAdjust from './item/material/Adjust';

import PromotionIndex from './promotion/Index';
import ItemBundlingIndex from './promotion/bundling/Index';
import ItemBundlingItem from './promotion/bundling/Item';
import ItemBundlingVariant from './promotion/bundling/Variant';
import DiscountIndex from './promotion/discount/Index';
import DiscountCreate from './promotion/discount/Create';
import DiscountEdit from './promotion/discount/Edit';

import TransactionIndex from './transaction/Index';
import TransactionCreate from './transaction/create/Index';
import TransactionHistory from './transaction/history/Index';
import TransactionDetail from './transaction/history/Detail';
import TransactionVariant from './transaction/create/Variant';
import TransactionCart from './transaction/create/Cart';

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
const ItemStack = createStackNavigator();
const PromotionStack = createStackNavigator();
const TransactionStack = createStackNavigator();

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
          headerLeft: () => <CustomHeaderLeftBack onPress={() => navigation.navigate('Employee', { screen: 'EmployeeStack' })} />,
          headerTitle: 'Pegawai',
        }}
      />
      <EmployeeStack.Screen name="EmployeeAddStack" component={EmployeeAdd}
        options={{
          headerShown: true,
          headerLeft: () => <CustomHeaderLeftBack onPress={() => navigation.navigate('Employee', { screen: 'EmployeeViewStack' })} />,
          headerTitle: 'Tambah Pegawai',
        }}
      />
      <EmployeeStack.Screen name="EmployeeEditStack" component={EmployeeEdit}
        options={{
          headerShown: true,
          headerLeft: () => <CustomHeaderLeftBack onPress={() => navigation.navigate('Employee', { screen: 'EmployeeViewStack' })} />,
          headerTitle: 'Ubah Pegawai',
        }}
      />
      <EmployeeStack.Screen name="RoleViewStack" component={RoleView}
        options={{
          headerShown: true,
          headerLeft: () => <CustomHeaderLeftBack onPress={() => navigation.navigate('Employee', { screen: 'EmployeeStack' })} />,
          headerTitle: 'Hak Akses',
        }}
      />
      <EmployeeStack.Screen name="RoleAddStack" component={RoleAdd}
        options={{
          headerShown: true,
          headerLeft: () => <CustomHeaderLeftBack onPress={() => navigation.navigate('Employee', { screen: 'RoleViewStack' })} />,
          headerTitle: 'Tambah Hak Akses',
        }}
      />
      <EmployeeStack.Screen name="RoleEditStack" component={RoleEdit}
        options={{
          headerShown: true,
          headerLeft: () => <CustomHeaderLeftBack onPress={() => navigation.navigate('Employee', { screen: 'RoleViewStack' })} />,
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
          headerLeft: () => <CustomHeaderLeftBack onPress={() => navigation.navigate('CashFlow', { screen: 'CashFlowStack' })} />,
          headerTitle: 'Arus Kas',
        }}
      />
      <CashFlowStack.Screen name="CashFlowCreateStack" component={CreateCashFlow}
        options={{
          headerShown: true,
          headerLeft: () => <CustomHeaderLeftBack onPress={() => navigation.navigate('CashFlow', { screen: 'CashFlowViewStack' })} />,
          headerTitle: 'Tambah Arus Kas',
        }}
      />
      <CashFlowStack.Screen name="CashFlowEditStack" component={EditCashFlow}
        options={{
          headerShown: true,
          headerLeft: () => <CustomHeaderLeftBack onPress={() => navigation.navigate('CashFlow', { screen: 'CashFlowViewStack' })} />,
          headerTitle: 'Ubah Arus Kas',
        }}
      />
      <CashFlowStack.Screen name="CatFlowViewStack" component={ViewCatFlow}
        options={{
          headerShown: true,
          headerLeft: () => <CustomHeaderLeftBack onPress={() => navigation.navigate('CashFlow', { screen: 'CashFlowStack' })} />,
          headerTitle: 'Kategori Arus Kas',
        }}
      />
      <CashFlowStack.Screen name="CatFlowCreateStack" component={CreateCatFlow}
        options={{
          headerShown: true,
          headerLeft: () => <CustomHeaderLeftBack onPress={() => navigation.navigate('CashFlow', { screen: 'CatFlowViewStack' })} />,
          headerTitle: 'Tambah Kategori Arus Kas',
        }}
      />
      <CashFlowStack.Screen name="CatFlowEditStack" component={EditCatFlow}
        options={{
          headerShown: true,
          headerLeft: () => <CustomHeaderLeftBack onPress={() => navigation.navigate('CashFlow', { screen: 'CatFlowViewStack' })} />,
          headerTitle: 'Ubah Kategori Arus Kas',
        }}
      />
    </CashFlowStack.Navigator>
  );
}

function ItemStackNavigator({ navigation }) {
  return (
    <ItemStack.Navigator>
      <ItemStack.Screen name="ItemStack" component={ItemIndex}
        options={({ navigation }) => ({
          headerShown: true,
          headerLeft: () => <CustomHeaderLeft onPress={() => navigation.openDrawer()} />,
          headerTitle: 'Kelola Produk',
        })}
      />
      <ItemStack.Screen name="ItemViewStack" component={ItemViewIndex}
        options={{
          headerShown: true,
          headerLeft: () => <CustomHeaderLeftBack onPress={() => navigation.navigate('Item', { screen: 'ItemStack' })} />,
          headerTitle: 'Produk',
        }}
      />
      <ItemStack.Screen name="ItemCreateStack" component={ItemCreate}
        options={{
          headerShown: true,
          headerLeft: () => <CustomHeaderLeftBack onPress={() => navigation.navigate('Item', { screen: 'ItemViewStack' })} />,
          headerTitle: 'Tambah Produk',
        }}
      />
      <ItemStack.Screen name="ItemEditStack" component={ItemEdit}
        options={{
          headerShown: true,
          headerLeft: () => <CustomHeaderLeftBack onPress={() => navigation.navigate('Item', { screen: 'ItemViewStack' })} />,
          headerTitle: 'Ubah Produk',
        }}
      />
      <ItemStack.Screen name="ItemCategoryStack" component={ItemCategoryIndex}
        options={{
          headerShown: true,
          headerLeft: () => <CustomHeaderLeftBack onPress={() => navigation.navigate('Item', { screen: 'ItemStack' })} />,
          headerTitle: 'Kategori Produk',
        }}
      />
      <ItemStack.Screen name="ItemCategoryCreateStack" component={ItemCategoryCreate}
        options={{
          headerShown: true,
          headerLeft: () => <CustomHeaderLeftBack onPress={() => navigation.navigate('Item', { screen: 'ItemCategoryStack' })} />,
          headerTitle: 'Tambah Kategori Produk',
        }}
      />
      <ItemStack.Screen name="ItemCategoryEditStack" component={ItemCategoryEdit}
        options={{
          headerShown: true,
          headerLeft: () => <CustomHeaderLeftBack onPress={() => navigation.navigate('Item', { screen: 'ItemCategoryStack' })} />,
          headerTitle: 'Ubah Kategori Produk',
        }}
      />
      <ItemStack.Screen name="ItemBrandStack" component={ItemBrandIndex}
        options={{
          headerShown: true,
          headerLeft: () => <CustomHeaderLeftBack onPress={() => navigation.navigate('Item', { screen: 'ItemStack' })} />,
          headerTitle: 'Merek Produk',
        }}
      />
      <ItemStack.Screen name="ItemBrandCreateStack" component={ItemBrandCreate}
        options={{
          headerShown: true,
          headerLeft: () => <CustomHeaderLeftBack onPress={() => navigation.navigate('Item', { screen: 'ItemBrandStack' })} />,
          headerTitle: 'Tambah Merek Produk',
        }}
      />
      <ItemStack.Screen name="ItemBrandEditStack" component={ItemBrandEdit}
        options={{
          headerShown: true,
          headerLeft: () => <CustomHeaderLeftBack onPress={() => navigation.navigate('Item', { screen: 'ItemBrandStack' })} />,
          headerTitle: 'Ubah Merek Produk',
        }}
      />

      <ItemStack.Screen name="ItemVariantStack" component={ItemVariantIndex}
        options={{
          headerShown: true,
          headerLeft: () => <CustomHeaderLeftBack onPress={() => navigation.navigate('Item', { screen: 'ItemViewStack' })} />,
          headerTitle: 'Variasi Produk',
        }}
      />
      <ItemStack.Screen name="ItemVariantCreateStack" component={ItemVariantCreate}
        options={{
          headerShown: true,
          headerLeft: () => <CustomHeaderLeftBack onPress={() => navigation.navigate('Item', { screen: 'ItemVariantStack' })} />,
          headerTitle: 'Tambah Variasi Produk',
        }}
      />
      <ItemStack.Screen name="ItemVariantEditStack" component={ItemVariantEdit}
        options={{
          headerShown: true,
          headerLeft: () => <CustomHeaderLeftBack onPress={() => navigation.navigate('Item', { screen: 'ItemVariantStack' })} />,
          headerTitle: 'Ubah Variasi Produk',
        }}
      />
      <ItemStack.Screen name="ItemVariantAdjustStack" component={ItemVariantAdjust}
        options={{
          headerShown: true,
          headerLeft: () => <CustomHeaderLeftBack onPress={() => navigation.navigate('Item', { screen: 'ItemViewStack' })} />,
          headerTitle: 'Tambah Stok Variasi Produk',
        }}
      />
      <ItemStack.Screen name="ItemMaterialStack" component={ItemMaterialIndex}
        options={{
          headerShown: true,
          headerLeft: () => <CustomHeaderLeftBack onPress={() => navigation.navigate('Item', { screen: 'ItemStack' })} />,
          headerTitle: 'Bahan Baku Produk',
        }}
      />
      <ItemStack.Screen name="ItemMaterialCreateStack" component={ItemMaterialCreate}
        options={{
          headerShown: true,
          headerLeft: () => <CustomHeaderLeftBack onPress={() => navigation.navigate('Item', { screen: 'ItemMaterialStack' })} />,
          headerTitle: 'Tambah Bahan Baku Produk',
        }}
      />
      <ItemStack.Screen name="ItemMaterialEditStack" component={ItemMaterialEdit}
        options={{
          headerShown: true,
          headerLeft: () => <CustomHeaderLeftBack onPress={() => navigation.navigate('Item', { screen: 'ItemMaterialStack' })} />,
          headerTitle: 'Ubah Bahan Baku Produk',
        }}
      />
      <ItemStack.Screen name="ItemMaterialAdjustStack" component={ItemMaterialAdjust}
        options={{
          headerShown: true,
          headerLeft: () => <CustomHeaderLeftBack onPress={() => navigation.navigate('Item', { screen: 'ItemMaterialStack' })} />,
          headerTitle: 'Tambah Stok Bahan Baku',
        }}
      />
      
    </ItemStack.Navigator>

  );
}

function PromotionStackNavigator({ navigation }) {
  return (
    <PromotionStack.Navigator
      screenOptions={{
        headerStyle: styles.borderBottomStyle,
      }}
    >
      <PromotionStack.Screen name="PromotionStack" component={PromotionIndex}
        options={{
          headerShown: true,
          headerLeft: () => <CustomHeaderLeft onPress={() => navigation.openDrawer()} />,
          headerTitle: 'Promosi Produk',
        }}
      />
      <PromotionStack.Screen name="ItemBundlingStack" component={ItemBundlingIndex}
        options={{
          headerShown: true,
          headerLeft: () => <CustomHeaderLeftBack onPress={() => navigation.navigate('Promotion', { screen: 'PromotionStack' })} />,
          headerTitle: 'Produk Bundling',
        }}
      />
      <PromotionStack.Screen name="ItemBundlingItemStack" component={ItemBundlingItem}
        options={{
          headerShown: true,
          headerLeft: () => <CustomHeaderLeftBack onPress={() => navigation.navigate('Promotion', { screen: 'ItemBundlingStack' })} />,
          headerTitle: 'Komponen Produk Bundling',
        }}
      />
      <PromotionStack.Screen name="ItemBundlingVariantStack" component={ItemBundlingVariant}
        options={{
          headerShown: true,
          headerLeft: () => <CustomHeaderLeftBack onPress={() => navigation.navigate('Promotion', { screen: 'ItemBundlingStack' })} />,
          headerTitle: 'Komponen Variasi Produk Bundling',
        }}
      />
      <PromotionStack.Screen name="DiscountStack" component={DiscountIndex}
        options={{
          headerShown: true,
          headerLeft: () => <CustomHeaderLeftBack onPress={() => navigation.navigate('Promotion', { screen: 'PromotionStack' })} />,
          headerTitle: 'Diskon Produk',
        }}
      />
      <PromotionStack.Screen name="DiscountCreateStack" component={DiscountCreate}
        options={{
          headerShown: true,
          headerLeft: () => <CustomHeaderLeftBack onPress={() => navigation.navigate('Promotion', { screen: 'DiscountStack' })} />,
          headerTitle: 'Tambah Diskon Produk',
        }}
      />
      <PromotionStack.Screen name="DiscountEditStack" component={DiscountEdit}
        options={{
          headerShown: true,
          headerLeft: () => <CustomHeaderLeftBack onPress={() => navigation.navigate('Promotion', { screen: 'DiscountStack' })} />,
          headerTitle: 'Ubah Diskon Produk',
        }}
      />
    </PromotionStack.Navigator>
  );
}

function TransactionStackNavigator({ navigation }) {
  return (
    <TransactionStack.Navigator
      screenOptions={{
        headerStyle: styles.borderBottomStyle,
      }}
    >
      <TransactionStack.Screen name="TransactionStack" component={TransactionIndex}
        options={{
          headerShown: true,
          headerLeft: () => <CustomHeaderLeft onPress={() => navigation.openDrawer()} />,
          headerTitle: 'Tambah Transaksi',
        }}
      />
      <TransactionStack.Screen name="CreateTransactionStack" component={TransactionCreate}
        options={{
          headerShown: true,
          headerLeft: () => <CustomHeaderLeftBack onPress={() => navigation.navigate('Transaction', { screen: 'TransactionStack' })} />,
          headerTitle: 'Tambah Transaksi',
        }}
      />
      <TransactionStack.Screen name="HistoryTransactionStack" component={TransactionHistory}
        options={{
          headerShown: true,
          headerLeft: () => <CustomHeaderLeftBack onPress={() => navigation.navigate('Transaction', { screen: 'TransactionStack' })} />,
          headerTitle: 'Riwayat Transaksi',
        }}
      />
      <TransactionStack.Screen name="DetailTransactionStack" component={TransactionDetail}
        options={{
          headerShown: true,
          headerLeft: () => <CustomHeaderLeftBack onPress={() => navigation.navigate('Transaction', { screen: 'DetailTransactionStack' })} />,
          headerTitle: 'Detail Transaksi',
        }}
      />
      <TransactionStack.Screen name="VariantTransactionStack" component={TransactionVariant}
        options={{
          headerShown: true,
          headerLeft: () => <CustomHeaderLeftBack onPress={() => navigation.navigate('Transaction', { screen: 'CreateTransactionStack' })} />,
          headerTitle: 'Tambah Transaksi',
        }}
      />
      <TransactionStack.Screen name="CartTransactionStack" component={TransactionCart}
        options={{
          headerShown: true,
          headerLeft: () => <CustomHeaderLeftBack onPress={() => navigation.navigate('Transaction', { screen: 'TransactionStack' })} />,
          headerTitle: 'Keranjang Belanja',
        }}
      />
    </TransactionStack.Navigator>
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
        <Drawer.Screen name="Item" component={ItemStackNavigator} options={{ title: 'Kelola Produk', headerShown: false }} />
        <Drawer.Screen name="Promotion" component={PromotionStackNavigator} options={{ title: 'Promosi', headerShown: false }} />
        <Drawer.Screen name="Transaction" component={TransactionStackNavigator} options={{ title: 'Transaksi', headerShown: false }} />
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