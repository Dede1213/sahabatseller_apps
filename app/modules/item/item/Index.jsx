import { Text, View, Alert, StyleSheet, FlatList, TouchableOpacity } from 'react-native'
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
import { useNavigation } from '@react-navigation/native';
import { CapitalizeEachWord } from '../../../../lib/globalFunction';
import { Image } from 'react-native';

const Index = () => {
  const navigation = useNavigation();
  const { user, refreshTrigger, setRefreshTrigger, setItemId, setItemName } = useGlobalContext()
  const [searchQuery, setSearchQuery] = useState('');
  const [orderBy, setOrderBy] = useState('desc');
  const [data, setData] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [refetchTrigger, setRefetchTrigger] = useState(0);

  const onRefresh = () => {
    setRefreshing(true);
    setRefetchTrigger(prev => prev + 1);
    setRefreshing(false);
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
        const response = await fetchData(`${API_HOST}/item/store?page=1&limit=100${keyword}${paramOrder}`,
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
    getData();
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
                <View className="border-2 border-gray-200 rounded w-[24%] items-center">
                  <TouchableOpacity
                    className=""
                    onPress={() => {
                      navigation.navigate('Item', {
                        screen: 'ItemEditStack',
                        params: { id: item.id }
                      });
                    }}
                  >
                    <Image
                      source={{ uri: `${API_HOST}/item/images/${item.photo ? item.photo : 'default.png'}` }}
                      resizeMode="cover"
                      className="w-[87px] h-[85px]"
                    />
                  </TouchableOpacity>
                </View>
                <View className="w-[75%] ml-1">
                  <TouchableOpacity
                    className=""
                    onPress={() => {
                      navigation.navigate('Item', {
                        screen: 'ItemEditStack',
                        params: { id: item.id }
                      });
                    }}
                  >
                    <View className="">
                      <Text className="text-sm font-PoppinsSemiBold text-blue-200 ml-1" testID='btn-001'>
                        {(item.name).length > 31 ? (CapitalizeEachWord(item.name ? item.name : '')).substring(0, 32) + '...' : (CapitalizeEachWord(item.name ? item.name : ''))}
                      </Text>
                    </View>
                    <View className="flex-row w-[95%] justify-between mt-1">
                      <View className="flex-row">
                        <Text className="w-[76px] text-base font-PoppinsSemiBold text-gray-100 ml-1 text-xs">
                          Total Stok
                        </Text>
                        <Text className="w-[45px]  text-base font-PoppinsSemiBold text-gray-100 ml-1 text-xs">
                          : {item.total_stock}
                        </Text>
                      </View>
                      <View className="flex-row">
                        <Text className="w-[60px] text-base font-PoppinsSemiBold text-gray-100 ml-1 text-xs">
                          Favorit
                        </Text>
                        <Text className="w-[50px] text-base font-PoppinsSemiBold text-gray-100 ml-1 text-xs">
                          : {item.is_favorite}
                        </Text>
                      </View>

                    </View>
                    <View className="flex-row w-[95%] justify-between mt-1 ml-1">
                      <View className="flex-row">
                        <Text className="w-[80px]  text-base font-PoppinsSemiBold text-gray-100 text-xs">
                          Katalog Online
                        </Text>
                        <Text className="text-base font-PoppinsSemiBold text-gray-100 text-xs">
                          : {item.show_online_catalog == 'YA' ? 'Tampil' : 'Tidak Tampil'}
                        </Text>
                      </View>
                      {/* <View className="flex-row">
                        <Text className="w-[70px] text-base font-PoppinsSemiBold text-gray-100 text-xs">
                          Grosir
                        </Text>
                        <Text className="text-base font-PoppinsSemiBold text-gray-100 text-xs">
                          : {item.is_wholesale}
                        </Text>
                      </View> */}
                    </View>
                  </TouchableOpacity>

                  <View className="flex-row mt-1.5 ml-1">
                    <View className="mr-2">
                      <TouchableOpacity
                        onPress={() => { setItemId(item.id); setItemName(item.name); navigation.navigate('Item', { screen: 'ItemVariantStack' }) }}
                        activeOpacity={0.7}
                        className='rounded-[3px] min-h-[20px] min-w-[95px] justify-center bg-secondary px-0.5'
                      >
                        <View className="flex-row">
                          <Icon name="widgets-outline" size={17} color="white" />
                          <Text className='font-PoppinsRegular text-xs text-white' testID='btn002'>
                            Atur Variasi
                          </Text>
                        </View>
                      </TouchableOpacity>
                    </View>
                    <View className="mr-2">
                      <TouchableOpacity
                        onPress={() => { setItemId(item.id); navigation.navigate('Item', { screen: 'ItemVariantAdjustStack' }) }}
                        activeOpacity={0.7}
                        className='rounded-[3px] min-h-[20px] min-w-[100px] justify-center bg-green-500 px-0.5'
                      >
                        <View className="flex-row">
                          <Icon name="text-box-plus-outline" size={17} color="white" />
                          <Text className='font-PoppinsRegular text-xs text-white' testID='btn003'>
                            Tambah Stok
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
                  placeholder={'Cari Kategori Produk...'}
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
              navigation.navigate('Item', { screen: 'ItemCreateStack' })}>
              <View testID="btn003">
                <Icon name="plus" size={30} color="#fff" />
              </View>
            </TouchableOpacity>
          </View>
        }

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
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 5,
  },
})