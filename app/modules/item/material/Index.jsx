import { Text, View, Alert, StyleSheet, FlatList, TouchableOpacity, ScrollView } from 'react-native'
import React, { useEffect, useState } from 'react'
import { useGlobalContext } from '../../../../context/globalProvider'
import { fetchData } from '../../../../lib/fetchData'
import { API_HOST } from '@env';
import EmptyState from '../../../../components/EmptyState'

import SearchInput from '../../../../components/SearchInput'
import { SafeAreaView } from 'react-native-safe-area-context'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { RefreshControl } from 'react-native'
import { ActivityIndicator } from 'react-native'
import { useNavigation, useRoute } from '@react-navigation/native';
import { CapitalizeEachWord, FormatAmount, FormatDate, FormatDateTime } from '../../../../lib/globalFunction';
import { Image } from 'react-native';
import { Modal } from 'react-native';
import { Button } from 'react-native';

const Index = () => {
  const navigation = useNavigation();
  const { user, refreshTrigger, setRefreshTrigger, itemId } = useGlobalContext()
  const [searchQuery, setSearchQuery] = useState('');
  const [orderBy, setOrderBy] = useState('desc');
  const [data, setData] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [refetchTrigger, setRefetchTrigger] = useState(0);

  const [modalVisible, setModalVisible] = useState(false);
  const [modalActive, setModalActive] = useState('');
  const [dataModal, setDataModal] = useState([]);

  const onRefresh = () => {
    setRefreshing(true);
    setRefetchTrigger(prev => prev + 1);
    setRefreshing(false);
  }

  const handleModal = async (id, param) => {

    setModalActive(param);
    setIsLoading(true);
    try {
      const response = await fetchData(`${API_HOST}/history-material/${param}/${id}?page=1&limit=50&order_by=id desc`,
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
          setDataModal(response.data.rows);
          setModalVisible(true);
          setIsLoading(false);
        }
      } else {
        Alert.alert(response.message)
      }
    } catch (error) {
      Alert.alert(error.message);
    }
  }

  useEffect(() => {
    const getData = async () => {
      try {
        var keyword = ''
        if (searchQuery !== '') {
          var keyword = `&keyword=${searchQuery}`
        }
        var paramOrder = ''
        if (orderBy !== '') {
          var paramOrder = `&order_by=id ${orderBy}`
        }
        const response = await fetchData(`${API_HOST}/material/store?page=1&limit=100${keyword}${paramOrder}`,
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
            setRefreshTrigger(false);
            setData(response.data.rows);
            setIsLoading(false);
          }
        } else {
          Alert.alert(response.message)
        }
      } catch (error) {
        Alert.alert(error.message);
      }
    };

    if (!modalVisible) {
      getData();
    }

  }, [refetchTrigger, searchQuery, refreshTrigger, orderBy]);

  const renderEmptyComponent = () => {
    if (isLoading) {
      return <ActivityIndicator size="large" color="#494952" />;
    }
    return <EmptyState title="data tidak ditemukan" subtitle="Data yang anda cari tidak ditemukan." />;
  };

  return (
    <SafeAreaView edges={['bottom', 'left', 'right']} style={{ flex: 1 }}>
      <View className="w-full h-full justify-center px-2 bg-primary">
        <FlatList
          data={data ?? []}
          keyExtractor={(item, index) => (item.$id ? item.$id.toString() : index.toString())}
          renderItem={({ item, index }) => (

            <View className="flex-row border-b border-gray-200 py-2" testID={`item-${index}`} >
              <View className="flex-row">
                <View className="w-[75%] ml-1">
                  <TouchableOpacity
                    className=""
                    onPress={() => {
                      navigation.navigate('Item', {
                        screen: 'ItemMaterialEditStack',
                        params: { id: item.id }
                      });
                    }}
                  >
                    <View className="">
                      <Text className="text-base font-PoppinsSemiBold text-blue-200 ml-1" testID='btn-001'>
                        {(item.name).length > 31 ? (CapitalizeEachWord(item.name ? item.name : '')).substring(0, 32) + '...' : (CapitalizeEachWord(item.name ? item.name : ''))}
                      </Text>
                    </View>
                    <View className="flex-row w-[95%] justify-between mt-2">
                      <View className="flex-row">
                        <Text className="w-[33px] font-PoppinsSemiBold text-gray-100 ml-1 text-xs">
                          Harga
                        </Text>
                        <Text className="w-[85px] font-PoppinsSemiBold text-gray-100 ml-1 text-xs">
                          : {FormatAmount(item.price)}
                        </Text>
                      </View>
                      <View className="flex-row">
                        <Text className="w-[30px] font-PoppinsSemiBold text-gray-100 text-xs">
                          Stok
                        </Text>
                        <Text className="w-[50px] font-PoppinsSemiBold text-gray-100 text-xs">
                          : {item.stock}
                        </Text>
                      </View>
                    </View>
                  </TouchableOpacity>

                  <View className="flex-row mt-4 ml-1">
                    <View className="mr-2">
                      <TouchableOpacity
                        onPress={() => {
                          navigation.navigate('Item', {
                            screen: 'ItemMaterialAdjustStack',
                            params: { id: item.id }
                          });
                        }}
                        activeOpacity={0.5}
                        className='rounded-[3px] min-h-[20px] min-w-[100px] justify-center bg-secondary px-0.5'
                      >
                        <View className="flex-row">
                          <Icon name="plus-box-outline" size={17} color="white" />
                          <View className="ml-0.5" />
                          <Text className='font-PoppinsRegular text-xs text-white' testID='btn003'>
                            Tambah Stok
                          </Text>
                        </View>
                      </TouchableOpacity>
                    </View>

                    <View className="mr-2">
                      <TouchableOpacity
                        onPress={() => { handleModal(item.id, 'price') }}
                        activeOpacity={0.5}
                        className='rounded-[3px] min-h-[20px] min-w-[60px] justify-center bg-gray-500 px-0.5'
                      >
                        <View className="flex-row">
                          <Icon name="history" size={17} color="white" />
                          <View className="ml-0.5" />
                          <Text className='font-PoppinsRegular text-xs text-white' testID='btn002'>
                            Harga
                          </Text>
                        </View>
                      </TouchableOpacity>
                    </View>

                    <View className="mr-2">
                      <TouchableOpacity
                        onPress={() => { handleModal(item.id, 'stock') }}
                        activeOpacity={0.5}
                        className='rounded-[3px] min-h-[20px] min-w-[60px] justify-center bg-gray-500 px-0.5'
                      >
                        <View className="flex-row">
                          <Icon name="history" size={17} color="white" />
                          <View className="ml-0.5" />
                          <Text className='font-PoppinsRegular text-xs text-white' testID='btn003'>
                            Stok
                          </Text>
                        </View>
                      </TouchableOpacity>
                    </View>
                  </View>

                </View>
              </View>
            </View>
          )}
          ListHeaderComponent={() => (
            <View className="">
              <View className="mb-5">
                <SearchInput
                  searchQuery={searchQuery}
                  setSearchQuery={setSearchQuery}
                  orderBy={orderBy}
                  setOrderBy={setOrderBy}
                  setIsloading={setIsLoading}
                  placeholder={'Cari Variasi Produk...'}
                  searchStyle="w-[85%] mt-4"
                  txtId="txt002"
                  btnId="btn002"
                />
              </View>
            </View>
          )}

          ListEmptyComponent={() => (renderEmptyComponent())}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        />
        {user?.is_head_office == 'YA' &&
          <View>
            <TouchableOpacity style={styles.circleButton} onPress={() =>
              navigation.navigate('Item', { screen: 'ItemMaterialCreateStack' })}>
              <View testID="btn003">
                <Icon name="plus" size={30} color="#fff" />
              </View>
            </TouchableOpacity>
          </View>
        }


        {/* Modal History */}
        <Modal
          visible={modalVisible}
          animationType="fade"
          transparent={true}
          onRequestClose={() => setModalVisible(false)}
        >
          <View style={styles.modalBackground}>
            <View style={styles.modalContainer}>
              {isLoading ? (
                <ActivityIndicator size="large" color="#0000ff" />
              ) : (
                <View>
                  {modalActive == 'price' && (
                    <Text style={styles.modalTitle}>Riwayat Harga</Text>
                  )}
                  {modalActive == 'stock' && (
                    <Text style={styles.modalTitle}>Riwayat Stok</Text>
                  )}
                  <View className="max-h-[300px]">

                    {modalActive == 'price' && (
                      <View style={styles.tableHeader} className="">
                        <Text style={styles.tableHeaderText}>Waktu</Text>
                        <Text style={styles.tableHeaderText}>Harga Lama</Text>
                        <Text style={styles.tableHeaderText}>Harga Baru</Text>
                        <Text style={styles.tableHeaderText} className="mr-3">Keterangan</Text>
                      </View>
                    )}

                    {modalActive == 'stock' && (
                      <View style={styles.tableHeader} className="">
                        <Text style={styles.tableHeaderText}>Waktu</Text>
                        <Text style={styles.tableHeaderText}>Stok Lama</Text>
                        <Text style={styles.tableHeaderText}>Stok Baru</Text>
                        <Text style={styles.tableHeaderText}>Keterangan</Text>
                      </View>
                    )}

                    <ScrollView>
                      {dataModal?.map((item, index) => (
                        <View key={index} style={styles.tableRow}>
                          <View className="w-[70px]">
                            <Text style={styles.tableCell} className="text-left">{ item.created_at ? FormatDateTime(item.created_at) : '-'}</Text>
                          </View>
                          <View className="w-[70px]">
                            <Text style={styles.tableCell} className="text-right">{modalActive == 'price' ? FormatAmount(item.old_price) : FormatAmount(item.old_stock)}</Text>
                          </View>
                          <View className="w-[70px] mr-4">
                            <Text style={styles.tableCell} className="text-right">{modalActive == 'price' ? FormatAmount(item.new_price) : FormatAmount(item.new_stock)}</Text>
                          </View>
                          <View className="w-[105px]">
                            <Text style={styles.tableCell} className="text-left">{item.reason + " Oleh : " + item.created_by_name}</Text>
                          </View>
                        </View>
                      ))}
                    </ScrollView>
                  </View>
                </View>
              )}
              <View className="flex-row mt-4">
                <View className="mr-2">
                  <TouchableOpacity
                    onPress={() => setModalVisible(false)}
                    activeOpacity={0.7}
                    className='rounded-[3px] min-h-[30px] justify-center items-center bg-secondary'
                  >
                    <Text className='font-PoppinsRegular text-m text-white px-6' testID='btn004'>
                      Tutup
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </View>
        </Modal>
        {/*End Modal History */}

      </View>
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
    borderRadius: 50,
    width: 60,
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#333',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 5,
  },
  modalBackground: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContainer: {
    width: 350,
    padding: 10,
    backgroundColor: 'white',
    borderRadius: 10,
  },
  modalTitle: {
    marginBottom: 15,
    fontWeight: 'bold',
    fontSize: 15,
    fontFamily: 'Poppins',
    color: '#494952',
    textAlign: 'center',
  },
  tableHeader: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: 'gray',
    paddingBottom: 5,
    marginBottom: 5,
  },
  tableHeaderText: {
    flex: 1,
    fontWeight: 'bold',
    fontSize: 12,
    fontFamily: 'Poppins',
    color: '#494952',
    textAlign: 'left',
  },
  tableRow: {
    flexDirection: 'row',
    paddingVertical: 5,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  tableCell: {
    flex: 1,
    fontSize: 12,
    fontFamily: 'Poppins',
    color: '#494952',
  },
})