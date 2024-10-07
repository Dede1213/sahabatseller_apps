import { Text, View, Alert, StyleSheet, FlatList, TouchableOpacity, RefreshControl, Modal, ActivityIndicator } from 'react-native'
import React, { useEffect, useState } from 'react'
import { useGlobalContext } from '../../../../context/globalProvider'
import { fetchData } from '../../../../lib/fetchData'
import { API_HOST } from '@env';
import EmptyState from '../../../../components/EmptyState'
import SearchInput from '../../../../components/SearchInput'
import { SafeAreaView } from 'react-native-safe-area-context'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useNavigation } from '@react-navigation/native';
import { Dropdown } from 'react-native-element-dropdown';
import AlertModal from '../../../../components/AlertModal';
import { useRef } from 'react';
import { CapitalizeEachWord } from '../../../../lib/globalFunction';

const Index = () => {
  const navigation = useNavigation();
  const { user, refreshTrigger, setRefreshTrigger, transaction } = useGlobalContext()
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [refetchTrigger, setRefetchTrigger] = useState(0);


  const [modalVisible, setModalVisible] = useState(false);
  const [categorys, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);
  const [categoryId, setCategoryId] = useState('');
  const [brandId, setBrandId] = useState('');
  const [orderBy, setOrderBy] = useState('desc');
  const [searchQuery, setSearchQuery] = useState('');
  const [page, setPage] = useState(1);
  const [totalPage, setTotalPage] = useState(0);

  /* Alert */
  const [isAlertVisible, setIsAlertVisible] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [alertTitle, setAlertTitle] = useState('');
  const showAlert = (title, message) => {
    setAlertTitle(title);
    setAlertMessage(message);
    setIsAlertVisible(true);
  };
  const closeAlert = () => {
    setIsAlertVisible(false);
  };
  /* End Alert */

  const typeSort = [
    { label: 'Terbaru', value: 'desc' },
    { label: 'Terlama', value: 'asc' },
  ];

  const flatListRef = useRef(null);
  const scrollToTop = () => {
    flatListRef.current.scrollToOffset({ offset: 0, animated: true });
  };

  const handleScroll = (event) => {
    const { layoutMeasurement, contentOffset, contentSize } = event.nativeEvent;
    const isBottom = layoutMeasurement.height + contentOffset.y >= contentSize.height - 20; // nilai -20 untuk memberi toleransi
    if (isBottom && !isLoading) {
      if (page < totalPage) {
        setIsLoading(true);
        setPage(prevPage => prevPage + 1);
        setRefetchTrigger(prev => prev + 1);
      }
    }
  };

  const onRefresh = () => {
    setIsLoading(true);
    setData([]);
    setOrderBy('desc');
    setSearchQuery('');
    setCategoryId('');
    setBrandId('');
    setPage(1);
    setRefetchTrigger(prev => prev + 1);
  }

  const onReset = () => {
    setIsLoading(true);
    setData([]);
    setOrderBy('desc');
    setSearchQuery('');
    setCategoryId('');
    setBrandId('');
    setPage(1);
    scrollToTop();
    setRefreshTrigger(false);
  }

  useEffect(() => {
    setIsLoading(true);
    const getDataCategory = async () => {
      try {
        const response = await fetchData(`${API_HOST}/item-category/list/store`,
          {
            headers: {
              'X-access-token': user.token,
              'Content-Type': 'application/json',
              'Accept': 'application/json',
            },
            method: 'get',
          });
        if (response.code) {
          if (response.code === 200) {
            const formattedData = response.data.map(item => ({
              label: item.name,
              value: item.id,
            }));
            setCategories(formattedData);
          }
        } else {
          Alert.alert(response.message)
        }
      } catch (error) {
        Alert.alert(error.message);
      }
    }
    getDataCategory();

    const getDataBrand = async () => {
      try {
        const response = await fetchData(`${API_HOST}/item-brand/list/store`,
          {
            headers: {
              'X-access-token': user.token,
              'Content-Type': 'application/json',
              'Accept': 'application/json',
            },
            method: 'get',
          });
        if (response.code) {
          if (response.code === 200) {
            const formattedData = response.data.map(item => ({
              label: item.name,
              value: item.id,
            }));
            setBrands(formattedData);
          }
        } else {
          Alert.alert(response.message)
        }
      } catch (error) {
        Alert.alert(error.message);
      }
    }
    getDataBrand();

    const getData = async () => {
      setIsLoading(true);
      try {
        var keyword = ''
        if (searchQuery !== '') {
          keyword = `&keyword=${searchQuery}`
        }
        var paramOrder = ''
        var paramCategory = ''
        var paramBrand = ''

        if (orderBy !== '') {
          paramOrder = `&order_by=id ${orderBy}`
        }
        if (categoryId > 0) {
          paramCategory = `&category_id=${parseInt(categoryId)}`
        }
        if (brandId > 0) {
          paramBrand = `&brand_id=${parseInt(brandId)}`
        }

        const response = await fetchData(`${API_HOST}/item/store/exclude-variant?page=${page}&limit=20${keyword}${paramOrder}${paramBrand}${paramCategory}`,
          {
            headers: {
              'X-access-token': user.token,
              'Content-Type': 'application/json',
              'Accept': 'application/json',
            },
            method: 'get',
          });

        if (response.code) {
          if (response.code === 200) {
            setTotalPage(response.data.total_pages);
            setData(prevData => [...prevData, ...response.data.rows]);
          }
        } else {
          Alert.alert(response.message)
        }
      } catch (error) {
        Alert.alert(error.message);
      } finally {
        setIsLoading(false);
      }
    };

    if (refreshTrigger) {
      onReset();
    } else {
      getData();
    }

  }, [refetchTrigger, searchQuery, page, refreshTrigger]);

  const renderEmptyComponent = () => {
    if (!isLoading) {
      return <EmptyState title="data tidak ditemukan" subtitle="Data yang anda cari tidak ditemukan." />;
    }
  };

  const handleFilter = () => {
    setModalVisible(false);
    setData([]);
    setRefetchTrigger(prev => prev + 1);
  };

  return (
    <SafeAreaView edges={['bottom', 'left', 'right']} style={{ flex: 1 }}>
      <View className="w-full h-full justify-center px-4 bg-primary">
        <AlertModal visible={isAlertVisible} header={alertTitle} message={alertMessage} onClose={closeAlert} />
        <FlatList
          ref={flatListRef}
          data={data ?? []}
          keyExtractor={(item, index) => (item.$id ? item.$id.toString() : index.toString())}
          renderItem={({ item, index }) => (
            <TouchableOpacity
              className="border-b border-gray-200 px-1 py-3"
              onPress={() => {
                navigation.navigate('Transaction', {
                  screen: 'VariantTransactionStack',
                  params: { id: item.id }
                });
              }}
            >
              <View className="flex-row items-center w-full" testID={`item-${index}`} >
                <View>
                  <View className="flex-row w-full items-center justify-between">
                    <View className="flex-row items-center">
                      <View className="ml-1">
                        <Text className="text-base font-PoppinsSemiBold text-blue-200 text-lg">
                          {CapitalizeEachWord(item.name ? item.name : '')}
                        </Text>
                      </View>
                    </View>
                  </View>
                  <View className="">
                    <Text className="text-base font-PoppinsSemiBold text-gray-100 ml-1 text-sm">
                      {CapitalizeEachWord(item.category_name ? item.category_name : '')} - {CapitalizeEachWord(item.brand_name ? item.brand_name : '')}
                    </Text>
                  </View>
                </View>
              </View>
            </TouchableOpacity>
          )}
          ListHeaderComponent={() => (
            <View className="">
              <View className="mb-5">
                <SearchInput
                  searchQuery={searchQuery}
                  setSearchQuery={setSearchQuery}
                  orderBy={orderBy}
                  setOrderBy={setOrderBy}
                  setModalVisible={setModalVisible}
                  setIsloading={setIsLoading}
                  placeholder={'Cari Produk...'}
                  searchStyle="w-[85%] mt-4"
                  setData={setData}
                  txtId="txt001"
                  btnId="btn001"
                />
              </View>
            </View>
          )}

          ListEmptyComponent={() => (renderEmptyComponent())}
          refreshControl={<RefreshControl refreshing={isLoading} onRefresh={onRefresh} />}
          onScroll={handleScroll}
        />

        {transaction.items.length > 0 &&
          <TouchableOpacity style={styles.circleButton} onPress={() =>
            navigation.navigate('Transaction', { screen: 'CartTransactionStack' })}>
            <View className="flex-row items-center justify-center" testID="btn002">
              <View className="mr-2">
                <Icon name="cart-outline" size={30} color="#fff" />
              </View>
              <View>
                <Text className="text-xl font-PoppinsSemiBold text-white">{transaction.items.length} Produk Dalam Keranjang</Text>
              </View>
            </View>
          </TouchableOpacity>
        }


        <Modal
          visible={modalVisible}
          animationType="fade"
          transparent={true}
          onRequestClose={() => setModalVisible(false)}
        >
          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
            <View style={{ width: 320, padding: 20, backgroundColor: 'white', borderRadius: 10 }}>
              <Text className="text-lg font-PoppinsMedium text-gray-100 mb-4">Filter Pencarian</Text>

              <View className={`space-y-2`}>
                <Text className="text-m font-PoppinsMedium text-gray-100 mt-3">Kategori</Text>
                <Dropdown
                  testID="txt002"
                  style={styles.dropdown}
                  placeholder='Pilih'
                  placeholderStyle={styles.placeholderStyle}
                  selectedTextStyle={styles.selectedTextStyle}
                  iconStyle={styles.iconStyle}
                  itemTextStyle={styles.itemTextStyle}
                  data={categorys}
                  maxHeight={300}
                  labelField="label"
                  valueField="value"
                  searchPlaceholder="Search..."
                  value={categoryId}
                  onChange={item => {
                    setCategoryId(item.value)
                  }}
                  renderLeftIcon={() => (
                    <Icon name="chevron-down" color="gray" size={20} testID="mn001" />
                  )}
                />
              </View>

              <View className={`space-y-2`}>
                <Text className="text-m font-PoppinsMedium text-gray-100 mt-3">Merek</Text>
                <Dropdown
                  testID="txt003"
                  style={styles.dropdown}
                  placeholder='Pilih'
                  placeholderStyle={styles.placeholderStyle}
                  selectedTextStyle={styles.selectedTextStyle}
                  iconStyle={styles.iconStyle}
                  itemTextStyle={styles.itemTextStyle}
                  data={brands}
                  maxHeight={300}
                  labelField="label"
                  valueField="value"
                  searchPlaceholder="Search..."
                  value={brandId}
                  onChange={item => {
                    setBrandId(item.value)
                  }}
                  renderLeftIcon={() => (
                    <Icon name="chevron-down" color="gray" size={20} testID="mn001" />
                  )}
                />
              </View>

              <View className={`space-y-2`}>
                <Text className="text-m font-PoppinsMedium text-gray-100 mt-3">Urutkan data :</Text>
                <Dropdown
                  testID="txt004"
                  style={styles.dropdown}
                  placeholder='Pilih'
                  placeholderStyle={styles.placeholderStyle}
                  selectedTextStyle={styles.selectedTextStyle}
                  iconStyle={styles.iconStyle}
                  itemTextStyle={styles.itemTextStyle}
                  data={typeSort}
                  maxHeight={300}
                  labelField="label"
                  valueField="value"
                  searchPlaceholder="Search..."
                  value={orderBy}
                  onChange={item => {
                    setOrderBy(item.value)
                  }}
                  renderLeftIcon={() => (
                    <Icon name="chevron-down" color="gray" size={20} testID="mn001" />
                  )}
                />
              </View>
              <View className="flex-row mt-4">
                <View className="mr-2">
                  <TouchableOpacity
                    onPress={handleFilter}
                    activeOpacity={0.7}
                    className='rounded-[3px] min-h-[30px] justify-center items-center bg-secondary'
                  >
                    <Text className='font-PoppinsRegular text-m text-white px-2' testID='btn003'>
                      Terapkan
                    </Text>
                  </TouchableOpacity>
                </View>
                <View className="mr-2">
                  <TouchableOpacity
                    onPress={() => setModalVisible(false)}
                    activeOpacity={0.7}
                    className='rounded-[3px] min-h-[30px] justify-center items-center bg-yellow-400'
                  >
                    <Text className='font-PoppinsRegular text-m text-white px-6' testID='btn004'>
                      Batal
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </View>
        </Modal>
      </View >
    </SafeAreaView >
  )
}

export default Index

const styles = StyleSheet.create({
  circleButton: {
    position: 'absolute',
    bottom: 30,
    right: 30,
    backgroundColor: '#1a7dcf',
    borderRadius: 10,
    width: '93%',
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 5,
  },
  itemTextStyle: {
    fontSize: 13,
    color: '#494952',
    marginTop: -5,
    marginBottom: -5
  },
  dropdown: {
    height: 32,
    borderColor: '#e5e7eb',
    borderWidth: 2,
    borderRadius: 8,
    paddingHorizontal: 8,
  },
  icon: {
    marginRight: 5,
  },
  placeholderStyle: {
    fontSize: 13,
    color: '#494952',
  },
  selectedTextStyle: {
    fontSize: 13,
    color: '#494952',
  },
  iconStyle: {
    width: 15,
    height: 15,
  },
})