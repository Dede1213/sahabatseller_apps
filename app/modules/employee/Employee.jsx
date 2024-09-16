import { Text, View, Alert, StyleSheet, FlatList, TouchableOpacity, Image } from 'react-native'
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
import { CapitalizeEachWord } from '../../../lib/globalFunction';

const Employee = () => {
  const navigation = useNavigation();
  const { user, refreshTrigger, setRefreshTrigger } = useGlobalContext()
  const [searchQuery, setSearchQuery] = useState('');
  const [orderBy, setOrderBy] = useState('desc');
  const [dataEmployee, setDataEmployee] = useState([]);
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
        const response = await fetchData(`${API_HOST}/user/store?page=1&limit=100${keyword}${paramOrder}`,
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
            setDataEmployee(response.data.rows);
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
      <View className="w-full h-full justify-center px-4 bg-primary">
        <FlatList
          data={dataEmployee ?? []}
          keyExtractor={(item, index) => (item.$id ? item.$id.toString() : index.toString())}
          renderItem={({ item, index }) => (
            <TouchableOpacity
              className="border-b border-gray-200 px-1 py-3"
              onPress={() => {
                navigation.navigate('Employee', {
                  screen: 'EmployeeEditStack',
                  params: { id: item.id }
                });
              }}
            >
              <View className="flex-row items-center" testID={`item-${index}`} >
                <Image source={{ uri: item.photo ? `${API_HOST}/profile/images/${item.photo}` : `${API_HOST}/profile/images/default.png` }} className="w-16 h-16 rounded-full " />
                <View>
                  <View className="flex-row items-center">
                    <Text className="text-base font-PoppinsSemiBold text-blue-200 ml-3 text-lg">
                      {CapitalizeEachWord(item.fullname)}
                    </Text>
                  </View>
                  <Text className="text-base text-gray-100 ml-3 text-sm">
                    {item.location_name} - {item.role_title}
                  </Text>
                  <Text className="text-base text-gray-100 ml-3 text-sm">
                    {item.email}
                  </Text>
                  <Text className="text-base text-gray-100 ml-3 text-sm">
                    {item.phone}
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
                  placeholder={'Cari Data Pegawai'}
                  searchStyle="w-[85%] mt-4"
                  textId="txt002"
                  btnId="btn002"
                />
              </View>
            </View>
          )}

          ListEmptyComponent={() => (renderEmptyComponent())}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        />
        <TouchableOpacity style={styles.circleButton} onPress={() =>
          navigation.navigate('Employee', { screen: 'EmployeeAddStack' })}>
          <View testID="btn001">
            <Icon name="plus" size={30} color="#fff" />
          </View>
        </TouchableOpacity>
      </View>
    </SafeAreaView >
  )
}

export default Employee

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