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
import { FormatAmount, FormatDate, FormatDateForQuery } from '../../../../lib/globalFunction';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Dropdown } from 'react-native-element-dropdown';
import AlertModal from '../../../../components/AlertModal';
import { useRef } from 'react';

const Index = () => {
  const navigation = useNavigation();
  const { user, refreshTrigger, setRefreshTrigger } = useGlobalContext()
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [refetchTrigger, setRefetchTrigger] = useState(0);


  const [modalVisible, setModalVisible] = useState(false);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [orderBy, setOrderBy] = useState('desc');
  const [searchQuery, setSearchQuery] = useState('');
  const [showStartPicker, setShowStartPicker] = useState(false);
  const [showEndPicker, setShowEndPicker] = useState(false);
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

  const now = new Date();
  const onRefresh = () => {
    setIsLoading(true);
    setData([]);
    setOrderBy('desc');
    setSearchQuery('');
    setStartDate('');
    setEndDate('');
    setPage(1);
    setRefetchTrigger(prev => prev + 1);
  }

  const onReset = () => {
    setIsLoading(true);
    setData([]);
    setOrderBy('desc');
    setSearchQuery('');
    setStartDate('');
    setEndDate('');
    setPage(1);
    scrollToTop();
    setRefreshTrigger(false);
  }

  useEffect(() => {
    const getData = async () => {
      setIsLoading(true);
      try {
        var keyword = ''
        if (searchQuery !== '') {
          keyword = `&keyword=${searchQuery}`
        }
        var paramOrder = ''
        if (orderBy !== '') {
          paramOrder = `&order_by=id ${orderBy}`
        }
        var rangeDate = ''
        if (startDate !== '' && endDate !== '') {
          rangeDate = `&start_date=${FormatDateForQuery(startDate)}&end_date=${FormatDateForQuery(endDate)}`
        }

        const response = await fetchData(`${API_HOST}/cash-flow/location?page=${page}&limit=20${keyword}${paramOrder}${rangeDate}`,
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
    if (startDate != '' && endDate == '') {
      showAlert('Notifikasi', 'Mohon pilih tanggal akhir.');
    } else if (startDate == '' && endDate != '') {
      showAlert('Notifikasi', 'Mohon pilih tanggal awal.');
    } else {
      setModalVisible(false);
      setData([]);
      setRefetchTrigger(prev => prev + 1);
    }
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
                navigation.navigate('CashFlow', {
                  screen: 'CashFlowEditStack',
                  params: { id: item.id }
                });
              }}
            >
              <View className="flex-row items-center w-full" testID={`item-${index}`} >
                <View>
                  <View className="flex-row w-full items-center justify-between">
                    <View className="flex-row items-center">
                      <View className="mt-0.5">
                        {item.types == "IN" &&
                          <Icon name={'cash-plus'} color="green" size={25} />
                        }

                        {item.types == "OUT" &&
                          <Icon name={'cash-minus'} color="red" size={25} />
                        }
                      </View>
                      <View className="ml-1">
                        <Text className="text-base font-PoppinsSemiBold text-blue-200 text-lg">
                          {FormatAmount(item.amount)}
                        </Text>
                      </View>
                    </View>
                    <View>
                      <Text className="text-base font-PoppinsSemiBold text-blue-200 text-sm items-center">
                        {FormatDate(item.transaction_date)}
                      </Text>
                    </View>
                  </View>
                  <View className="">
                    <Text className="text-base font-PoppinsSemiBold text-gray-100 ml-1 text-sm">
                      {item.category_name} {item.note ? `- ${item.note}` : ''}
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
                  placeholder={'Cari (Nominal/Catatan)'}
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
        <TouchableOpacity style={styles.circleButton} onPress={() =>
          navigation.navigate('CashFlow', { screen: 'CashFlowCreateStack' })}>
          <View testID="btn002">
            <Icon name="plus" size={30} color="#fff" />
          </View>
        </TouchableOpacity>

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
                <Text className="text-m font-PoppinsMedium text-gray-100">Tanggal Awal Transaksi :</Text>
                <View className='flex-row'>
                  <View className="w-full">
                    <TouchableOpacity onPress={() => setShowStartPicker(true)}>
                      <View className={`border-2 border-gray-200 w-full px-2 rounded-lg focus:border-secondary items-center flex-row`}>
                        <View className="flex-1 py-1">
                          <Text className="text-gray-100 font-poppinsSemiBold text-m">
                            {startDate ? startDate.toLocaleDateString() : '--/--/----'}
                          </Text>
                        </View>
                        <Icon name="calendar-month" color="gray" size={20} testID="txt002" />
                      </View>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>

              <View className={`space-y-2`}>
                <Text className="text-m font-PoppinsMedium text-gray-100 mt-2">Tanggal Akhir Transaksi :</Text>
                <View className='flex-row'>
                  <View className="w-full">
                    <TouchableOpacity onPress={() => setShowEndPicker(true)}>
                      <View className={`border-2 border-gray-200 w-full px-2 rounded-lg focus:border-secondary items-center flex-row`}>
                        <View className="flex-1 py-1">
                          <Text className="text-gray-100 font-poppinsSemiBold text-m">
                            {endDate ? endDate.toLocaleDateString() : '--/--/----'}
                          </Text>
                        </View>
                        <Icon name="calendar-month" color="gray" size={20} testID="txt003" />
                      </View>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>

              {showStartPicker && (
                <DateTimePicker
                  value={startDate ? startDate : now}
                  mode="date"
                  display="default"
                  onChange={(event, selectedDate) => {
                    setShowStartPicker(false);
                    setStartDate(selectedDate || startDate);
                  }}
                />
              )}

              {showEndPicker && (
                <DateTimePicker
                  value={endDate ? endDate : now}
                  mode="date"
                  display="default"
                  onChange={(event, selectedDate) => {
                    setShowEndPicker(false);
                    setEndDate(selectedDate || endDate);
                  }}
                />
              )}

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