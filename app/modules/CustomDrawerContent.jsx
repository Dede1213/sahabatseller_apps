import React, { useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { DrawerContentScrollView, DrawerItem } from '@react-navigation/drawer';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Constants from 'expo-constants';
import { useNavigation } from '@react-navigation/native';
import { useGlobalContext } from '../../context/globalProvider'
import { API_HOST } from '@env';

const CustomDrawerContent = (props) => {

  const { isLoading, isLoggedIn } = useGlobalContext();

  useEffect(() => {
    if (!isLoading && !isLoggedIn) {
      return navigation.replace('SignIn');
    }
  }, [isLoading, isLoggedIn]);


  const { user } = useGlobalContext();
  const appVersion = Constants.expoConfig?.version || 'Unknown';
  const navigation = useNavigation();
  const moduleAccess = user?.module_access;
  const moduleAccessArray = moduleAccess ? moduleAccess.split(',').map(Number) : [];

  return (
    <SafeAreaView style={{ flex: 1 }} edges={['left', 'right', 'bottom']}>
      <DrawerContentScrollView {...props}>
        <TouchableOpacity style={styles.userInfoSection} onPress={() => navigation.navigate('Profile')}>
          <Image source={{ uri: user ? `${API_HOST}/profile/images/${user.photo}` : `${API_HOST}/profile/default.png` }} style={styles.profileImage} />
          <View style={styles.premiumBadge}>
            <Text style={styles.premiumText}>Premium</Text>
          </View>
          <View style={styles.userDetails}>
            <Text className="text-gray-100 text-lg font-PoppinsBold">{user?.fullname ? user.fullname.substr(0, 15) : ''}</Text>
            <Text style={styles.role}>{user?.role == 1 ? 'Pemilik' : user?.role_title}</Text>
          </View>

          <View style={styles.iconArrow}>
            <Icon name="chevron-right" color="#000" size={20} />
          </View>
        </TouchableOpacity>

        <View style={styles.divider} />

        <View style={styles.outletSection}>
          <View>
            <Text className="text-gray-100 font-PoppinsBold text-lg">{user?.store_name ? user.store_name : ''}</Text>
            <Text className="text-gray-100">{user?.location_name ? user.location_name : ''}</Text>
          </View>

          <TouchableOpacity style={styles.outletButton} onPress={() => navigation.navigate('LocationStore', { screen: 'SwitchLocationStack' })}>
            <Text style={styles.outletButtonText}>Pilih Lokasi</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.divider} />

        {moduleAccessArray.includes(1) && (
          <DrawerItem
            label="Beranda"
            onPress={() => { navigation.navigate('Home'); }}
            icon={() => <Icon name="home-outline" color="gray" size={25} />}
            labelStyle={{ marginLeft: -20, color: '#494952', fontFamily: 'PoppinsRegular', marginTop: 5 }}
            style={{ marginTop: -15 }}
          />
        )}

        {moduleAccessArray.includes(2) && (
          <DrawerItem
            label="Absensi"
            onPress={() => { }}
            icon={() => <Icon name="account-clock-outline" color="gray" size={25} />}
            labelStyle={{ marginLeft: -20, color: '#494952', fontFamily: 'PoppinsRegular', marginTop: 5 }}
            style={{ marginTop: -15 }}
          />
        )}

        {moduleAccessArray.includes(3) && (
          <DrawerItem
            label="Kelola Produk"
            onPress={() => { }}
            icon={() => <Icon name="package-variant-closed" color="gray" size={25} />}
            labelStyle={{ marginLeft: -20, color: '#494952', fontFamily: 'PoppinsRegular', marginTop: 5 }}
            style={{ marginTop: -15 }}
          />
        )}

        {moduleAccessArray.includes(4) && (
          <DrawerItem
            label="Transaksi"
            onPress={() => { }}
            icon={() => <Icon name="calculator" color="gray" size={25} />}
            labelStyle={{ marginLeft: -20, color: '#494952', fontFamily: 'PoppinsRegular', marginTop: 5 }}
            style={{ marginTop: -15 }}
          />
        )}

        {moduleAccessArray.includes(5) && (
          <DrawerItem
            label="Riwayat Transaksi"
            onPress={() => { }}
            icon={() => <Icon name="text-box-search-outline" color="gray" size={25} />}
            labelStyle={{ marginLeft: -20, color: '#494952', fontFamily: 'PoppinsRegular', marginTop: 5 }}
            style={{ marginTop: -15 }}
          />
        )}

        {moduleAccessArray.includes(6) && (
          <DrawerItem
            label="Rekap Kas"
            onPress={() => { }}
            icon={() => <Icon name="cash-check" color="gray" size={25} />}
            labelStyle={{ marginLeft: -20, color: '#494952', fontFamily: 'PoppinsRegular', marginTop: 5 }}
            style={{ marginTop: -15 }}
          />
        )}

        {moduleAccessArray.includes(7) && (
          <DrawerItem
            label="Pelanggan"
            onPress={() => { }}
            icon={() => <Icon name="contacts-outline" color="gray" size={25} />}
            labelStyle={{ marginLeft: -20, color: '#494952', fontFamily: 'PoppinsRegular', marginTop: 5 }}
            style={{ marginTop: -15 }}
          />
        )}

        {moduleAccessArray.includes(8) && (
          <DrawerItem
            label="Pegawai"
            onPress={() => { navigation.navigate('Employee', { screen: 'EmployeeStack' }) }}
            icon={() => <Icon name="human-male-board-poll" color="gray" size={25} />}
            labelStyle={{ marginLeft: -20, color: '#494952', fontFamily: 'PoppinsRegular', marginTop: 5 }}
            style={{ marginTop: -15 }}
          />
        )}

        {moduleAccessArray.includes(9) && (
          <DrawerItem
            label="Lokasi Toko"
            onPress={() => navigation.navigate('LocationStore', { screen: 'LocationStoreStack' })}
            icon={() => <Icon name="google-maps" color="gray" size={25} />}
            labelStyle={{ marginLeft: -20, color: '#494952', fontFamily: 'PoppinsRegular', marginTop: 5 }}
            style={{ marginTop: -15 }}
          />
        )}

        {moduleAccessArray.includes(10) && (
          <DrawerItem
            label="Inventaris"
            onPress={() => { }}
            icon={() => <Icon name="warehouse" color="gray" size={25} />}
            labelStyle={{ marginLeft: -20, color: '#494952', fontFamily: 'PoppinsRegular', marginTop: 5 }}
            style={{ marginTop: -15 }}
          />
        )}

        {moduleAccessArray.includes(11) && (
          <DrawerItem
            label="Laporan"
            onPress={() => { }}
            icon={() => <Icon name="file-document-edit-outline" color="gray" size={25} />}
            labelStyle={{ marginLeft: -20, color: '#494952', fontFamily: 'PoppinsRegular', marginTop: 5 }}
            style={{ marginTop: -15 }}
          />
        )}

        {moduleAccessArray.includes(12) && (
          <DrawerItem
            label="Katalog Online"
            onPress={() => { }}
            icon={() => <Icon name="web" color="gray" size={25} />}
            labelStyle={{ marginLeft: -20, color: '#494952', fontFamily: 'PoppinsRegular', marginTop: 5 }}
            style={{ marginTop: -15 }}
          />
        )}

        {moduleAccessArray.includes(13) && (
          <DrawerItem
            label="Komunitas Penjual"
            onPress={() => { }}
            icon={() => <Icon name="storefront-outline" color="gray" size={25} />}
            labelStyle={{ marginLeft: -20, color: '#494952', fontFamily: 'PoppinsRegular', marginTop: 5 }}
            style={{ marginTop: -15 }}
          />
        )}

        {moduleAccessArray.includes(14) && (
          <DrawerItem
            label="Pengaturan"
            onPress={() => { navigation.navigate('Pengaturan'); }}
            icon={() => <Icon name="cog-outline" color="gray" size={25} />}
            labelStyle={{ marginLeft: -20, color: '#494952', fontFamily: 'PoppinsRegular', marginTop: 5 }}
            style={{ marginTop: -15 }}
          />
        )}

        <DrawerItem
          label="Petunjuk"
          onPress={() => { }}
          icon={() => <Icon name="information-outline" color="gray" size={25} />}
          labelStyle={{ marginLeft: -20, color: '#494952', fontFamily: 'PoppinsRegular', marginTop: 5 }}
          style={{ marginTop: -15 }}
        />

        <DrawerItem
          label="Bantuan"
          onPress={() => { }}
          icon={() => <Icon name="whatsapp" color="gray" size={25} />}
          labelStyle={{ marginLeft: -20, color: '#494952', fontFamily: 'PoppinsRegular', marginTop: 5 }}
          style={{ marginTop: -15 }}
        />

        <View style={styles.divider} />

        <View className="w-full items-center justify-center" >
          <Image source={require('../../assets/images/logotext.png')} className="w-60 h-10" resizeMode='contain' />
        </View>

        <View style={styles.versionContainer}>
          <Text style={styles.versionText}>Version: {appVersion}</Text>
        </View>
      </DrawerContentScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  versionContainer: {
    marginTop: 'auto', // Pushes version info to the bottom
  },
  versionText: {
    textAlign: 'center',
    color: '#666',
  },
  premiumBadge: {
    position: 'absolute',
    top: 50,
    left: 20,
    backgroundColor: '#1a7dcf',
    borderRadius: 10,
    padding: 3,
  },
  userInfoSection: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },
  profileImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  userDetails: {
    marginLeft: 15,
  },
  role: {
    fontSize: 14,
    color: '#666',
  },
  iconArrow: {
    paddingVertical: 3,
    paddingHorizontal: 10,
    borderRadius: 5,
    marginLeft: 'auto',
  },
  premiumText: {
    color: '#fff',
    fontSize: 11,
    fontWeight: 'bold',
  },
  outletSection: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },
  outletButton: {
    backgroundColor: '#1a7dcf',
    paddingVertical: 5,
    paddingHorizontal: 15,
    borderRadius: 5,
    marginLeft: 'auto',
  },
  outletButtonText: {
    color: '#fff',
    fontSize: 14,
  },
  divider: {
    height: 1,
    backgroundColor: '#ddd',
    marginVertical: 10,
    marginHorizontal: 20,
  },
});

export default CustomDrawerContent;
