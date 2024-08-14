import { Text, View, Alert, StyleSheet, FlatList, TouchableOpacity } from 'react-native'
import React, { useEffect, useState } from 'react'
import { useGlobalContext } from '../../../context/globalProvider'
import { fetchData } from '../../../lib/fetchData'
import { API_HOST } from '@env';
import EmptyState from '../../../components/EmptyState'

import SearchInput from '../../../components/SearchInput'
import { SafeAreaView } from 'react-native-safe-area-context'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { RefreshControl } from 'react-native'
import { ActivityIndicator } from 'react-native'
import { useNavigation } from '@react-navigation/native';
import { useIsFocused } from '@react-navigation/native';

const Index = () => {
  const navigation = useNavigation();
  const isFocused = useIsFocused();
  const { user } = useGlobalContext()
  const [searchQuery, setSearchQuery] = useState('');
  const [orderBy, setOrderBy] = useState('asc');
  const [dataLocation, setDataLocation] = useState([]);
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
        const response = await fetchData(`${API_HOST}/location/store?page=1&limit=100${keyword}${paramOrder}`,
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
            setDataLocation(response.data.rows);
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
  }, [refetchTrigger, searchQuery, isFocused, orderBy]);

  const renderEmptyComponent = () => {
    if (isLoading) {
      return <ActivityIndicator size="large" color="#494952" />;
    }
    return <EmptyState title="data tidak ditemukan" subtitle="Data yang anda cari tidak ditemukan." />;
  };

  return (
    <SafeAreaView edges={['bottom', 'left', 'right']} style={{ flex: 1 }}>
      <View className="w-full justify-center px-4 bg-primary">
        <FlatList
          data={dataLocation ?? []}
          keyExtractor={(item, index) => (item.$id ? item.$id.toString() : index.toString())}
          renderItem={({ item }) => (
            <TouchableOpacity
              className="border-b border-gray-200 px-4 py-4"
              onPress={() => {
                navigation.navigate('LocationStore', {
                  screen: 'LocationEditStoreStack',
                  params: { id: item.id }
                });
              }}
            >
              <View className="flex-row items-center">
                <Icon name={'google-maps'} color="gray-100" size={35} />
                <View>
                  <View className="flex-row items-center">
                    <Text className="text-base font-PoppinsSemiBold text-gray-100 ml-3 text-lg">
                      {item.name}
                    </Text>
                    {item.is_head_office == "YA" &&
                      <View className="bg-secondary rounded-sm w-[40px] h-4 justify-center items-center ml-2">
                        <Text className="text-white text-xs">Pusat</Text>
                      </View>
                    }
                  </View>
                  <Text className="text-base text-gray-100 ml-3 text-sm">
                    {item.address} {item.phone ? `(${item.phone})` : ''}
                  </Text>
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
                  setIsloading={setIsLoading}
                  placeholder={'Cari Lokasi Toko'}
                  searchStyle="w-[85%] mt-4" />
              </View>
            </View>
          )}

          ListEmptyComponent={() => (renderEmptyComponent())}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        />
        <TouchableOpacity style={styles.circleButton} onPress={() =>
          navigation.navigate('LocationStore', { screen: 'LocationCreateStack' })}>
          <Icon name="plus" size={30} color="#fff" />
        </TouchableOpacity>
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