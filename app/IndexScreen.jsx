import React, { useEffect } from 'react'
import { ScrollView, Text, View, Image, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { images } from '../constants';
import CustomButton from '../components/CustomButton';
import { useGlobalContext } from '../context/globalProvider';
import PagerView from 'react-native-pager-view';

const IndexScreen = ({ navigation }) => {
  const { isLoading, isLoggedIn } = useGlobalContext();

  useEffect(() => {
    if (!isLoading && isLoggedIn) {
      return navigation.replace('MainDrawer');
    }
  }, [isLoading, isLoggedIn, navigation]);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollView}>
        <PagerView style={styles.pagerView} initialPage={0}>
          <View style={styles.page}>
            <Image source={require('../assets/images/slide2.png')} style={styles.image} resizeMode='contain' />
            <Text className="text-center text-gray-100 font-PoppinsRegular text-[17px] mt-5 px-5">
              Manajemen Produk dan transaksi jadi lebih mudah dengan Sahabat Seller.
            </Text>
          </View>
          <View style={styles.page}>
            <Image source={require('../assets/images/slide1.png')} style={styles.image} resizeMode='contain' />
            <Text className="text-center text-gray-100 font-PoppinsRegular text-[17px] mt-5 px-5">
              Manajemen Produk dan transaksi jadi lebih mudah dengan Sahabat Seller.
            </Text>
          </View>
          <View style={styles.page}>
            <Image source={require('../assets/images/slide3.png')} style={styles.image} resizeMode='contain' />
            <Text className="text-center text-gray-100 font-PoppinsRegular text-[17px] mt-5 px-5">
              Manajemen Produk dan transaksi jadi lebih mudah dengan Sahabat Seller.
            </Text>
          </View>
          <View style={styles.page}>
            <Image source={require('../assets/images/slide4.png')} style={styles.image} resizeMode='contain' />
            <Text className="text-center text-gray-100 font-PoppinsRegular text-[17px] mt-5 px-5">
              Manajemen Produk dan transaksi jadi lebih mudah dengan Sahabat Seller.
            </Text>
          </View>
          <View style={styles.page}>
            <Image source={require('../assets/images/slide3.png')} style={styles.image} resizeMode='contain' />
            <Text className="text-center text-gray-100 font-PoppinsRegular text-[17px] mt-5 px-5">
              Manajemen Produk dan transaksi jadi lebih mudah dengan Sahabat Seller.
            </Text>
          </View>
        </PagerView>

        <View className="w-full items-center justify-center px-4">
          <View className="relative">
            <Image source={images.logotext} className="w-[250px] h-[50px]" resizeMode='contain' />
          </View>

          <CustomButton
            title="Daftar Sekarang"
            handlePress={() => navigation.replace('SignUp')}
            containerStyles="w-full mt-10 bg-secondary-200"
            textStyles="font-PoppinsRegular text-xl text-white "
            testId="btn001"
          />
          <CustomButton
            title="Masuk"
            handlePress={() => navigation.replace('SignIn')}
            containerStyles="w-full mt-3 bg-primary border border-secondary-200"
            textStyles="font-PoppinsRegular text-xl text-secondary-200 text-secondary-200"
            testId="btn002"
          />
        </View>
      </ScrollView>

      {/* <StatusBar backgroundColor='#fff' className="dark" style="light" /> */}
    </SafeAreaView>
  );

}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flexGrow: 1,
    justifyContent: 'center', // Mengatur posisi tengah secara vertikal
  },
  pagerView: {
    height: '60%', // Tinggi yang diinginkan untuk PagerView
    paddingHorizontal: 2,
  },
  page: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: '80%',
    height: '70%',
  },
});


export default IndexScreen
