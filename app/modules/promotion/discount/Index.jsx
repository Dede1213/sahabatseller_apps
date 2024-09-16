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
import { useNavigation } from '@react-navigation/native';
import { CapitalizeEachWord, FormatAmount, FormatDateTime } from '../../../../lib/globalFunction';
import { Modal } from 'react-native';
import AlertModal from '../../../../components/AlertModal';
import { Formik } from 'formik';
import * as Yup from 'yup';
import FormField from '../../../../components/FormField';
import AlertConfirmModal from '../../../../components/AlertConfirmModal';

const validationSchema = Yup.object().shape({
  item_id: Yup.string().required('*produk wajib diisi'),
});

const Index = () => {
  const navigation = useNavigation();
  const { user, refreshTrigger, setRefreshTrigger, setItemId } = useGlobalContext()
  const [searchQuery, setSearchQuery] = useState('');
  const [orderBy, setOrderBy] = useState('desc');
  const [data, setData] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [refetchTrigger, setRefetchTrigger] = useState(0);

  const [modalVisible, setModalVisible] = useState(false);
  const [dataModal, setDataModal] = useState([]);

  const [modalListItemVisible, setModalListItemVisible] = useState(false);
  const [dataListItem, setDataListItem] = useState([]);

  const [modalFormItemVisible, setModalFormItemVisible] = useState(false);

  const [discountId, setDiscountId] = useState('');
  const [discountName, setDiscountName] = useState('');
  const [initialValues, setInitialValues] = useState({
    discount_id: '',
    item_name: '',
    item_id: '',
    variant_id: '',
  });

  /* Alert Confirm */
  const [isAlertConfirmVisible, setIsAlertConfirmVisible] = useState(false);
  const [alertConfirmMessage, setAlertConfirmMessage] = useState('');
  const [alertConfirmTitle, setAlertConfirmTitle] = useState('');
  const [alertConfirmFlag, setAlertConfirmFlag] = useState('');
  const [alertConfirmId, setAlertConfirmId] = useState('');
  const showAlertConfirm = (title, message, flag, id) => {
    setAlertConfirmTitle(title);
    setAlertConfirmMessage(message);
    setAlertConfirmFlag(flag);
    setAlertConfirmId(id);
    setIsAlertConfirmVisible(true);
  };
  const closeAlertConfirm = () => {
    setIsAlertConfirmVisible(false);
  };

  const acceptAlertConfirm = () => {
    setIsAlertConfirmVisible(false);
    if (alertConfirmFlag === 'item') {
      handleDelete(alertConfirmId);
    }
  };
  /* End Alert */

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
    setRefreshTrigger(true)
    navigation.navigate('Promotion', {
      screen: 'discountStack',
    });
  };
  /* End Alert */

  const onRefresh = () => {
    setRefreshing(true);
    setRefetchTrigger(prev => prev + 1);
    setRefreshing(false);
  }

  const handleDelete = async (id) => {
    try {
      setIsLoading(true)
      const response = await fetchData(`${API_HOST}/discount/item/delete/${id}`, {
        method: 'delete',
        headers: {
          'X-access-token': user.token,
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
      });

      if (response.code) {
        if (response.code === 200) {
          showAlert('Notifikasi', 'Produk diskon berhasil dihapus.');
        }
      } else {
        Alert.alert(response.message)
      }
    } catch (error) {
      Alert.alert(error.message)
    } finally {
      setIsLoading(false)
    }
  };

  const handleModal = async (id, name) => {
    setIsLoading(true);
    setDiscountId(id);
    if (name != undefined) {
      setDiscountName(name);
    }

    try {
      const response = await fetchData(`${API_HOST}/discount/item?id=${id}`,
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
          setDataModal(response.data);
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

  const handleModalListItem = async () => {
    setIsLoading(true);
    var keyword = ''
    if (searchQuery !== '') {
      var keyword = `&keyword=${searchQuery}`
    }
    try {
      const response = await fetchData(`${API_HOST}/item/store/list?page=1&limit=50&order_by=id desc${keyword}`,
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
          setDataListItem(response.data.rows);
          setModalListItemVisible(true);
          setIsLoading(false);
          setRefreshTrigger(false);
        }
      } else {
        Alert.alert(response.message)
      }
    } catch (error) {
      Alert.alert(error.message);
    }
  }

  const handleModalFormItem = async () => {
    setIsLoading(true);
    var keyword = ''
    if (searchQuery !== '') {
      var keyword = `&keyword=${searchQuery}`
    }
    try {
      const response = await fetchData(`${API_HOST}/item/store/list?page=1&limit=50&order_by=id desc${keyword}`,
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
          setDataListItem(response.data.rows);
          setModalFormItemVisible(true);
          setIsLoading(false);
        }
      } else {
        Alert.alert(response.message)
      }
    } catch (error) {
      Alert.alert(error.message);
    }
  }

  const handleValues = (item_id, variant_id, item_name, variant_name) => {
    setInitialValues({ item_id: item_id, variant_id: variant_id, item_name: item_name + "-" + variant_name })
    setModalListItemVisible(false)
  }

  useEffect(() => {
    if (modalVisible) {
      handleModal(discountId);
      return
    }

    if (modalListItemVisible) {
      handleModalListItem();
      return
    }

    if (modalFormItemVisible) {
      handleModalFormItem();
      return
    }

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
        const response = await fetchData(`${API_HOST}/discount/location?page=1&limit=100${keyword}${paramOrder}`,
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

  const submitAction = async (form) => {
    try {
      setIsLoading(true)
      const response = await fetchData(`${API_HOST}/discount/item/create`, {
        method: 'post',
        headers: {
          'X-access-token': user.token,
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        data: {
          id: discountId,
          item_id: form.item_id,
          variant_id: form.variant_id,
        },
      });

      if (response.code) {
        if (response.code === 200) {
          setModalFormItemVisible(false);
          setInitialValues({ item_name: '' });
          showAlert('Notifikasi', 'Produk diskon berhasil ditambah.');
        }
      } else {
        Alert.alert(response.message)
      }
    } catch (error) {
      showAlert('Warning', error.message);
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <SafeAreaView edges={['bottom', 'left', 'right']} style={{ flex: 1 }}>
      <View className="w-full h-full justify-center px-2 bg-primary">
        <AlertConfirmModal visible={isAlertConfirmVisible} header={alertConfirmTitle} message={alertConfirmMessage} onClose={closeAlertConfirm} onAccept={acceptAlertConfirm} />
        <AlertModal visible={isAlertVisible} header={alertTitle} message={alertMessage} onClose={closeAlert} />
        <FlatList
          data={data ?? []}
          keyExtractor={(item, index) => (item.$id ? item.$id.toString() : index.toString())}
          renderItem={({ item, index }) => (

            <View className="flex-row border-b border-gray-200 py-2" testID={`item-${index}`} >
              <View className="flex-row">
                <View className="w-full ml-1">
                  <View className="">
                    <TouchableOpacity
                      className=""
                      onPress={() => {
                        {
                          navigation.navigate('Promotion', {
                            screen: 'DiscountEditStack',
                            params: { id: item.id }
                          });
                        }
                      }}
                    >
                      <View className="flex-row items-center" testID={`item-${index}`} >
                        <View>
                          <View className="flex-row items-center">
                            <Text className="text-base font-PoppinsSemiBold text-blue-200 ml-1 text-lg">
                              {CapitalizeEachWord(item.name)}
                            </Text>
                          </View>
                        </View>
                      </View>
                    </TouchableOpacity>

                  </View>
                  <View className="flex-row w-[95%] justify-between mt-1">
                    <View className="flex-row">
                      <Text className="w-[60px] text-base font-PoppinsSemiBold text-gray-100 ml-1 text-xs">
                        Tgl.Mulai
                      </Text>
                      <Text className="w-[150px] text-base font-PoppinsSemiBold text-gray-100 ml-1 text-xs">
                        : {item.start_date ? FormatDateTime(item.start_date) : '-'}
                      </Text>
                    </View>
                    <View className="flex-row">
                      <Text className="w-[70px] text-base font-PoppinsSemiBold text-gray-100 text-xs">
                        Tipe Diskon
                      </Text>
                      <Text className="w-[130px] text-base font-PoppinsSemiBold text-gray-100 text-xs">
                        : {item.discount_type == 'NOMINAL' ? 'Nominal' : 'Prosentase'}
                      </Text>
                    </View>
                  </View>
                  <View className="flex-row w-[95%] justify-between mt-1">
                    <View className="flex-row">
                      <Text className="w-[60px] text-base font-PoppinsSemiBold text-gray-100 ml-1 text-xs">
                        Tgl.Selesai
                      </Text>
                      <Text className="w-[150px] text-base font-PoppinsSemiBold text-gray-100 ml-1 text-xs">
                        : {item.end_date ? FormatDateTime(item.end_date) : '-'}
                      </Text>
                    </View>
                    <View className="flex-row">
                      <Text className="w-[70px] text-base font-PoppinsSemiBold text-gray-100 text-xs">
                        Discount
                      </Text>
                      <Text className="w-[130px] text-base font-PoppinsSemiBold text-gray-100 text-xs">
                        : {item.discount_type == 'NOMINAL' ? FormatAmount(item.discount) : item.discount}
                      </Text>
                    </View>
                  </View>

                  <View className="flex-row mt-4 ml-1">
                    <View className="mr-2">
                      <TouchableOpacity
                        onPress={() => { handleModal(item.id, item.name) }}
                        activeOpacity={0.5}
                        className='rounded-[3px] min-h-[20px] min-w-[100px] justify-center bg-secondary px-0.5'
                      >
                        <View className="flex-row">
                          <Icon name="format-list-group" size={17} color="white" />
                          <View className="ml-0.5" />
                          <Text className='font-PoppinsRegular text-xs text-white' testID='btn001'>
                            List Produk
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
                  placeholder={'Cari Produk Bundling...'}
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

        <View>
          <TouchableOpacity style={styles.circleButton} onPress={() => { navigation.navigate('Promotion', { screen: 'DiscountCreateStack' }) }}>
            <View testID="btn003">
              <Icon name="plus" size={30} color="#fff" />
            </View>
          </TouchableOpacity>
        </View>


        {/* Modal List Item */}
        <Modal
          visible={modalListItemVisible}
          animationType="fade"
          transparent={true}
          onRequestClose={() => setModalListItemVisible(false)}
        >
          <View style={styles.modalBackground}>
            <View style={styles.modalContainer}>
              {isLoading ? (
                <ActivityIndicator size="large" color="#0000ff" />
              ) : (
                <View>
                  <Text style={styles.modalTitle}>Pilih Produk</Text>
                  <View className="max-h-[300px]">
                    <FlatList
                      data={dataListItem ?? []}
                      keyExtractor={(item, index) => (item.$id ? item.$id.toString() : index.toString())}
                      renderItem={({ item, index }) => (

                        <View className="flex-row border-b border-gray-200 py-2" testID={`item-${index}`} >
                          <View className="flex-row">
                            <View className="w-full ml-1">
                              <TouchableOpacity
                                className=""
                                onPress={() => { handleValues(item.id, item.variant_id, item.name, item.variant_name) }}
                              >
                                <View className="">
                                  <Text className="text-sm font-PoppinsSemiBold text-blue-200 ml-1" testID='btn-001'>
                                    {CapitalizeEachWord(item.name)} - {CapitalizeEachWord(item.variant_name)}
                                  </Text>
                                </View>
                              </TouchableOpacity>
                            </View>
                          </View>
                        </View>
                      )}
                      ListHeaderComponent={() => (
                        <View className="">
                          <View className="mb-5 ml-2">
                            <SearchInput
                              searchQuery={searchQuery}
                              setSearchQuery={setSearchQuery}
                              orderBy={false}
                              setOrderBy={false}
                              setIsloading={setIsLoading}
                              placeholder={'Cari Produk'}
                              searchStyle="w-[95%] mt-4"
                              txtId="txt002"
                              btnId="btn002"
                            />
                          </View>
                        </View>
                      )}

                      ListEmptyComponent={() => (renderEmptyComponent())}
                      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
                    />
                  </View>
                </View>
              )}
              <View className="flex-row mt-4">
                <View className="mr-2">
                  <TouchableOpacity
                    onPress={() => { setSearchQuery(''); setModalListItemVisible(false) }}
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
        {/*End Modal List Item */}

        {/* Modal List Item Diskon */}
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
                  <Text style={styles.modalTitle}>List Produk Diskon</Text>
                  <Text className="text-center mt-[-10px] mb-5">{discountName}</Text>
                  <View className="max-h-[300px]">
                    <View style={styles.tableHeader} className="">
                      <View className="w-[250px]">
                        <Text>Nama Produk</Text>
                      </View>
                      <View className="w-[60px]">
                        <Text className="text-right">Aksi</Text>
                      </View>
                    </View>

                    <ScrollView>
                      {dataModal?.length == 0 && (
                        <View>
                          <Text className="text-center">Belum ada produk</Text>
                        </View>
                      )}
                      {dataModal?.map((item, index) => (
                        <View key={index} style={styles.tableRow}>
                          <View className="w-[270px]">
                            <Text style={styles.tableCell} className="text-left">{item.item_name} - {item.variant_name}</Text>
                          </View>
                          <View className="w-[20px] items-center ml-4">
                            <TouchableOpacity
                              onPress={() => { showAlertConfirm('Konfirmasi', 'Apakah Anda yakin ingin menghapus item ini?', 'item', item.id) }}
                              activeOpacity={0.7}
                              className=''
                            >
                              <Icon name="trash-can-outline" size={25} color="#C70039" testID='btn004' />
                            </TouchableOpacity>
                          </View>
                        </View>
                      ))}
                    </ScrollView>
                  </View>
                </View>
              )}
              <View className="flex-row mt-5">
                <View className="mr-2">
                  <TouchableOpacity
                    onPress={() => { setSearchQuery(''); handleModalFormItem() }}
                    activeOpacity={0.7}
                    className='rounded-[3px] min-h-[30px] min-w-[130px] justify-center bg-secondary'
                  >
                    <View className="flex-row items-center justify-center">
                      <View>
                        <Icon name="plus" size={17} color="white" />
                      </View>
                      <View className="ml-0.5" />
                      <Text className='font-PoppinsRegular text-m text-white' testID='btn005'>
                        Tambah Produk
                      </Text>
                    </View>
                  </TouchableOpacity>
                </View>
                <View className="mr-2">
                  <TouchableOpacity
                    onPress={() => setModalVisible(false)}
                    activeOpacity={0.7}
                    className='rounded-[3px] min-h-[30px] justify-center items-center bg-orange-400'
                  >
                    <Text className='font-PoppinsRegular text-m text-white px-6' testID='btn006'>
                      Tutup
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </View>
        </Modal>
        {/*End Modal List Item Diskon */}

        {/* Modal Form Diskon Item */}
        <Modal
          visible={modalFormItemVisible}
          animationType="fade"
          transparent={true}
          onRequestClose={() => setModalFormItemVisible(false)}
        >
          <View style={styles.modalBackground}>
            <View style={styles.modalContainer}>
              {isLoading ? (
                <ActivityIndicator size="large" color="#0000ff" />
              ) : (
                <View>
                  <Text style={styles.modalTitle}>Tambah Produk</Text>
                  <View className="max-h-[300px]">

                    <Formik
                      initialValues={initialValues}
                      validationSchema={validationSchema}
                      onSubmit={(values) => {
                        submitAction(values);
                      }}
                      enableReinitialize
                    >
                      {({ handleChange, handleBlur, handleSubmit, values, errors, touched }) => (
                        <View>

                          <View className="">
                            <TouchableOpacity
                              onPress={() => handleModalListItem()}
                              activeOpacity={0.7}
                              className=''
                            >
                              <FormField
                                title="Pilih Produk"
                                placeholder="Pilih Produk"
                                value={values.item_name}
                                handleChangeText={handleChange('item_name')}
                                handleBlur={handleBlur('item_name')}
                                otherStyles="mt-2"
                                testId="txt001"
                                multiline={true}
                                numberOfLines={3}
                                editable={false}
                              />
                            </TouchableOpacity>
                          </View>
                          {touched.item_name && errors.item_name && <Text className="text-gray-50">{errors.item_name}</Text>}

                          <View className="flex-row mt-5">
                            <View className="mr-2">
                              <TouchableOpacity
                                onPress={() => handleSubmit()}
                                activeOpacity={0.7}
                                className='rounded-[3px] min-h-[35px] min-w-[80px] justify-center bg-secondary'
                              >
                                <View className="flex-row items-center justify-center">
                                  <Text className='font-PoppinsRegular text-m text-white' testID='btn007'>
                                    Simpan
                                  </Text>
                                </View>
                              </TouchableOpacity>
                            </View>
                            <View className="mr-2">
                              <TouchableOpacity
                                onPress={() => { setInitialValues({ item_id: '', variant_id: '', item_name: '' }); setModalFormItemVisible(false); }}
                                activeOpacity={0.7}
                                className='rounded-[3px] min-h-[35px] justify-center items-center bg-orange-400'
                              >
                                <Text className='font-PoppinsRegular text-m text-white px-6' testID='btn008'>
                                  Batal
                                </Text>
                              </TouchableOpacity>
                            </View>
                          </View>

                        </View>
                      )}
                    </Formik>

                  </View>
                </View>
              )}

            </View>
          </View>
        </Modal>
        {/*End Modal Form Diskon Item */}

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