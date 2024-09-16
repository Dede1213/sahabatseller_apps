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
import AlertConfirmModal from '../../../../components/AlertConfirmModal';
import AlertModal from '../../../../components/AlertModal';
import { Formik } from 'formik';
import * as Yup from 'yup';
import FormField from '../../../../components/FormField';

const validationSchema = Yup.object().shape({
  material_id: Yup.string().required('*bahan baku wajib diisi'),
  material_qty: Yup.string().required('*qty wajib diisi'),
});

const validationWholesaleSchema = Yup.object().shape({
  wholesale_price: Yup.string().required('*harga jual wajib diisi').matches(/^[0-9]+$/, '*harga jual harus berupa angka'),
  wholesale_min_order: Yup.string().required('*minimal beli wajib diisi').matches(/^[0-9]+$/, '*minimal beli harus berupa angka'),
});

const Index = () => {
  const navigation = useNavigation();
  const { user, refreshTrigger, setRefreshTrigger, itemId, variantId, setVariantId, itemName, variantName, setVariantName } = useGlobalContext()
  const [searchQuery, setSearchQuery] = useState('');
  const [orderBy, setOrderBy] = useState('desc');
  const [data, setData] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [refetchTrigger, setRefetchTrigger] = useState(0);

  const [modalVisible, setModalVisible] = useState(false);
  const [modalActive, setModalActive] = useState('');
  const [dataModal, setDataModal] = useState([]);

  const [modalMaterialVisible, setModalMaterialVisible] = useState(false);
  const [dataMaterial, setDataMaterial] = useState([]);

  const [modalListMaterial, setModalListMaterial] = useState(false);
  const [dataListMaterial, setDataListMaterial] = useState([]);

  const [modalWholesaleVisible, setModalWholesaleVisible] = useState(false);
  const [dataWholesale, setDataWholesale] = useState([]);

  const [modalMenuHistoryVisible, setModalMenuHistoryVisible] = useState(false);

  const [modalFormWholesaleVisible, setModalFormWholesaleVisible] = useState(false);
  const [initialWholesaleValues, setInitialWholesaleValues] = useState({
    wholesale_price: '',
  });

  const [modalFormMaterialVisible, setModalFormMaterialVisible] = useState(false);
  const [initialValues, setInitialValues] = useState({
    material_id: '',
    material_name: '',
    material_qty: '',
  });

  const onRefresh = () => {
    setRefreshing(true);
    setRefetchTrigger(prev => prev + 1);
    setRefreshing(false);
  }

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
    if (alertConfirmFlag === 'material') {
      handleDeleteMaterial(alertConfirmId);
    }
    if (alertConfirmFlag === 'wholesale') {
      handleDeleteWholesale(alertConfirmId);
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
    navigation.navigate('Item', {
      screen: 'ItemVariantStack',
    });
  };
  /* End Alert */

  const handleDeleteMaterial = async (id) => {
    try {
      setIsLoading(true)
      const response = await fetchData(`${API_HOST}/item/material/delete/${id}`, {
        method: 'delete',
        headers: {
          'X-access-token': user.token,
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
      });

      if (response.code) {
        if (response.code === 200) {
          showAlert('Notifikasi', 'Bahan baku berhasil dihapus.');
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

  const handleDeleteWholesale = async (id) => {
    try {
      setIsLoading(true)
      const response = await fetchData(`${API_HOST}/item-wholesale/delete/${id}`, {
        method: 'delete',
        headers: {
          'X-access-token': user.token,
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
      });

      if (response.code) {
        if (response.code === 200) {
          showAlert('Notifikasi', 'Harga grosir berhasil dihapus.');
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

  const handleModal = async (param) => {

    setModalActive(param);
    setIsLoading(true);
    try {
      const response = await fetchData(`${API_HOST}/history/${param}/${variantId}?page=1&limit=50&order_by=id desc`,
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

  const handleModalListMaterial = async () => {
    setIsLoading(true);
    var keyword = ''
    if (searchQuery !== '') {
      var keyword = `&keyword=${searchQuery}`
    }
    try {
      const response = await fetchData(`${API_HOST}/material/store?page=1&limit=50&order_by=id desc${keyword}`,
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
          setDataListMaterial(response.data.rows);
          setModalListMaterial(true);
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

  const handleValues = (id, name) => {
    setInitialValues({ material_id: id, material_name: name });
    setSearchQuery('')
    setModalListMaterial(false)
  }

  const submitAction = async (form) => {
    try {
      setIsLoading(true)
      const response = await fetchData(`${API_HOST}/item/material/create`, {
        method: 'post',
        headers: {
          'X-access-token': user.token,
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        data: {
          item_id: itemId,
          variant_id: variantId,
          material_id: form.material_id,
          quantity: parseInt(form.material_qty ? form.material_qty : 0),
        },
      });

      if (response.code) {
        if (response.code === 200) {
          setModalFormMaterialVisible(false);
          setInitialValues({ material_id: '', material_name: '', material_qty: '' });
          showAlert('Notifikasi', 'Bahan baku berhasil ditambah.');
        }
      } else {
        Alert.alert(response.message)
      }
    } catch (error) {
      Alert.alert(error.message)
    } finally {
      setIsLoading(false)
    }
  }

  const submitActionWholesale = async (form) => {
    try {
      setIsLoading(true)
      const response = await fetchData(`${API_HOST}/item-wholesale/create`, {
        method: 'post',
        headers: {
          'X-access-token': user.token,
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        data: {
          item_id: itemId,
          variant_id: variantId,
          min_order: parseInt(form.wholesale_min_order ? form.wholesale_min_order : 0),
          price: parseInt(form.wholesale_price ? form.wholesale_price : 0),
        },
      });

      if (response.code) {
        if (response.code === 200) {
          setModalFormWholesaleVisible(false);
          setInitialWholesaleValues({ wholesale_min_order: '', wholesale_price: '' });
          showAlert('Notifikasi', 'Harga grosir berhasil ditambah.');
        }
      } else {
        Alert.alert(response.message)
      }
    } catch (error) {
      Alert.alert(error.message)
    } finally {
      setIsLoading(false)
    }
  }



  useEffect(() => {
    if (modalWholesaleVisible) {
      const getDataWholesale = async () => {
        setIsLoading(true);
        try {
          const response = await fetchData(`${API_HOST}/item-wholesale/location?item_id=${itemId}&variant_id=${variantId}`,
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
              setDataWholesale(response.data);
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
      getDataWholesale();
      return
    }

    if (modalListMaterial) {
      handleModalListMaterial();
      return
    }

    if (modalMaterialVisible && !modalListMaterial) {
      const getDataMaterial = async () => {
        setIsLoading(true);
        try {
          const response = await fetchData(`${API_HOST}/item/material?item_id=${itemId}&variant_id=${variantId}`,
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
              setDataMaterial(response.data);
              setIsLoading(false);
            }
          } else {
            Alert.alert(response.message)
          }
        } catch (error) {
          Alert.alert(error.message);
        }
      };

      getDataMaterial();
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
        const response = await fetchData(`${API_HOST}/item-variant/store/item?item_id=${itemId}&page=1&limit=100${keyword}${paramOrder}`,
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

    if (!modalVisible && !modalMaterialVisible) {
      getData();
    }

  }, [refetchTrigger, searchQuery, refreshTrigger, orderBy, modalMaterialVisible, modalWholesaleVisible]);

  const renderEmptyComponent = () => {
    if (isLoading) {
      return <ActivityIndicator size="large" color="#494952" />;
    }
    return <EmptyState title="data tidak ditemukan" subtitle="Data yang anda cari tidak ditemukan." />;
  };

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
                <View className="border-2 border-gray-200 rounded w-[24%] items-center">
                  <TouchableOpacity
                    className=""
                    onPress={() => {
                      navigation.navigate('Item', {
                        screen: 'ItemVariantEditStack',
                        params: { id: item.id }
                      });
                    }}
                  >
                    <Image
                      source={{ uri: `${API_HOST}/variant/images/${item.photo ? item.photo : 'default.png'}` }}
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
                        screen: 'ItemVariantEditStack',
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
                        <Text className="w-[33px] text-base font-PoppinsSemiBold text-gray-100 ml-1 text-xs">
                          Harga
                        </Text>
                        <Text className="w-[85px]  text-base font-PoppinsSemiBold text-gray-100 ml-1 text-xs">
                          : {FormatAmount(item.price)}
                        </Text>
                      </View>
                      <View className="flex-row">
                        <Text className="w-[55px]  text-base font-PoppinsSemiBold text-gray-100 text-xs">
                          Stok
                        </Text>
                        <Text className="w-[50px] text-base font-PoppinsSemiBold text-gray-100 text-xs">
                          : {item.stock}
                        </Text>
                      </View>
                    </View>
                    <View className="flex-row w-[95%] justify-between mt-1">
                      <View className="flex-row">
                        <Text className="w-[33px] text-base font-PoppinsSemiBold text-gray-100 ml-1 text-xs">
                          HPP
                        </Text>
                        <Text className="w-[85px] text-base font-PoppinsSemiBold text-gray-100 ml-1 text-xs">
                          : {FormatAmount(item.hpp)}
                        </Text>
                      </View>
                      <View className="flex-row">
                        <Text className="w-[55px] text-base font-PoppinsSemiBold text-gray-100 text-xs">
                          Min. Stok
                        </Text>
                        <Text className="w-[50px] text-base font-PoppinsSemiBold text-gray-100 text-xs">
                          : {item.minimum_stock}
                        </Text>
                      </View>
                    </View>
                  </TouchableOpacity>
                  <View className="flex-row mt-1.5 ml-1">
                    <View className="mr-2">
                      <TouchableOpacity
                        onPress={() => { setVariantId(item.id); setVariantName(item.name); setModalMaterialVisible(true); }}
                        activeOpacity={0.7}
                        className='rounded-[3px] min-h-[20px] min-w-[87px] justify-center bg-orange-500 px-0.5'
                      >
                        <View className="flex-row">
                          <Icon name="widgets-outline" size={17} color="white" />
                          <Text className='font-PoppinsRegular text-xs text-white' testID='btn004'>
                            Bahan Baku
                          </Text>
                        </View>
                      </TouchableOpacity>
                    </View>
                    <View className="mr-2">
                      <TouchableOpacity
                        onPress={() => { setVariantId(item.id); setVariantName(item.name); setModalWholesaleVisible(true); }}
                        activeOpacity={0.7}
                        className='rounded-[3px] min-h-[20px] min-w-[60px] justify-center bg-secondary px-0.5'
                      >
                        <View className="flex-row">
                          <Icon name="tag-outline" size={17} color="white" />
                          <Text className='font-PoppinsRegular text-xs text-white' testID='btn004'>
                            Grosir
                          </Text>
                        </View>
                      </TouchableOpacity>
                    </View>
                    <View className="mr-2">
                      <TouchableOpacity
                        onPress={() => { setVariantId(item.id); setVariantName(item.name); setModalMenuHistoryVisible(true); }}
                        activeOpacity={0.5}
                        className='rounded-[3px] min-h-[20px] min-w-[100px] justify-center bg-gray-500 px-0.5'
                      >
                        <View className="flex-row">
                          <Icon name="history" size={17} color="white" />
                          <View className="ml-0.5" />
                          <Text className='font-PoppinsRegular text-xs text-white' testID='btn002'>
                            Riwayat Data
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
              navigation.navigate('Item', { screen: 'ItemVariantCreateStack' })}>
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
                  {modalActive == 'hpp' && (
                    <Text style={styles.modalTitle}>Riwayat HPP</Text>
                  )}
                  {modalActive == 'stock' && (
                    <Text style={styles.modalTitle}>Riwayat Stok</Text>
                  )}
                  {modalActive == 'wholesale' && (
                    <Text style={styles.modalTitle}>Riwayat Grosir</Text>
                  )}

                  <Text className="text-center mt-[-10px] mb-5 text-sm text-gray-100">{itemName} - {variantName}</Text>

                  <View className="max-h-[300px]">
                    {modalActive == 'hpp' && (
                      <View style={styles.tableHeader} className="">
                        <Text style={styles.tableHeaderText}>Waktu</Text>
                        <Text style={styles.tableHeaderText}>HPP Lama</Text>
                        <Text style={styles.tableHeaderText}>HPP Baru</Text>
                        <Text style={styles.tableHeaderText}>Keterangan</Text>
                      </View>
                    )}

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

                    {modalActive == 'wholesale' && (
                      <View style={styles.tableHeader} className="">
                        <Text style={styles.tableHeaderText}>Waktu</Text>
                        <Text style={styles.tableHeaderText}>Minimal Beli</Text>
                        <Text style={styles.tableHeaderText}>Harga</Text>
                        <Text style={styles.tableHeaderText}>Keterangan</Text>
                      </View>
                    )}

                    <ScrollView>
                      {dataModal?.map((item, index) => (
                        <View key={index} style={styles.tableRow}>
                          <View className="w-[70px]">
                            <Text style={styles.tableCell} className="text-left">{item.created_at ? FormatDateTime(item.created_at) : '-'}</Text>
                          </View>
                          <View className="w-[70px]">
                            <Text style={styles.tableCell} className="text-right">{modalActive == 'hpp' ? FormatAmount(item.old_hpp) : modalActive == 'price' ? FormatAmount(item.old_price) : modalActive == 'stock' ? FormatAmount(item.old_stock) : FormatAmount(item.min_order)}</Text>
                          </View>
                          <View className="w-[70px] mr-4">
                            <Text style={styles.tableCell} className="text-right">{modalActive == 'hpp' ? FormatAmount(item.new_hpp) : modalActive == 'price' ? FormatAmount(item.new_price) : modalActive == 'stock' ? FormatAmount(item.new_stock) : FormatAmount(item.price)}</Text>
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

        {/* Modal Material */}
        <Modal
          visible={modalMaterialVisible}
          animationType="fade"
          transparent={true}
          onRequestClose={() => setModalMaterialVisible(false)}
        >
          <View style={styles.modalBackground}>
            <View style={styles.modalContainer}>
              {isLoading ? (
                <ActivityIndicator size="large" color="#0000ff" />
              ) : (
                <View>
                  <Text style={styles.modalTitle}>Bahan Baku</Text>
                  <Text className="text-center mt-[-10px] mb-5">{itemName} - {variantName}</Text>
                  <View className="max-h-[300px]">
                    <View style={styles.tableHeader} className="">
                      <View className="w-[200px]">
                        <Text>Nama Bahan Baku</Text>
                      </View>
                      <View className="w-[60px]">
                        <Text className="text-right">Qty</Text>
                      </View>
                      <View className="w-[60px]">
                        <Text className="text-right">Aksi</Text>
                      </View>
                    </View>

                    <ScrollView>
                      {dataMaterial?.length == 0 && (
                        <View>
                          <Text className="text-center">Belum ada bahan baku</Text>
                        </View>
                      )}
                      {dataMaterial?.map((item, index) => (
                        <View key={index} style={styles.tableRow}>
                          <View className="w-[200px]">
                            <Text style={styles.tableCell} className="text-left">{item.material_name}</Text>
                          </View>
                          <View className="w-[60px]">
                            <Text style={styles.tableCell} className="text-right">{FormatAmount(item.quantity)}</Text>
                          </View>
                          {user?.is_head_office == 'YA' && (
                            <View className="w-[60px] items-center ml-4">
                              <TouchableOpacity
                                onPress={() => { showAlertConfirm('Konfirmasi', 'Apakah Anda yakin ingin menghapus bahan baku ini?', 'material', item.id) }}
                                activeOpacity={0.7}
                                className=''
                              >
                                <Icon name="trash-can-outline" size={25} color="#C70039" testID='btn004' />
                              </TouchableOpacity>
                            </View>
                          )}
                        </View>
                      ))}
                    </ScrollView>
                  </View>
                </View>
              )}
              <View className="flex-row mt-5">
                {user?.is_head_office == 'YA' && (
                  <View className="mr-2">
                    <TouchableOpacity
                      onPress={() => { setModalFormMaterialVisible(true) }}
                      activeOpacity={0.7}
                      className='rounded-[3px] min-h-[30px] min-w-[115px] justify-center bg-secondary'
                    >
                      <View className="flex-row items-center justify-center">
                        <View>
                          <Icon name="plus" size={17} color="white" />
                        </View>
                        <View className="ml-0.5" />
                        <Text className='font-PoppinsRegular text-m text-white' testID='btn005'>
                          Bahan Baku
                        </Text>
                      </View>
                    </TouchableOpacity>
                  </View>
                )}
                <View className="mr-2">
                  <TouchableOpacity
                    onPress={() => setModalMaterialVisible(false)}
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
        {/*End Modal Item Bundling */}

        {/* Modal Form Item Bundling */}
        <Modal
          visible={modalFormMaterialVisible}
          animationType="fade"
          transparent={true}
          onRequestClose={() => setModalFormMaterialVisible(false)}
        >
          <View style={styles.modalBackground}>
            <View style={styles.modalContainer}>
              {isLoading ? (
                <ActivityIndicator size="large" color="#0000ff" />
              ) : (
                <View>
                  <Text style={styles.modalTitle}>Bahan Baku</Text>
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
                              onPress={() => handleModalListMaterial()}
                              activeOpacity={0.7}
                              className=''
                            >
                              <FormField
                                title="Pilih Bahan Baku"
                                placeholder="Pilih Bahan Baku"
                                value={values.material_name}
                                handleChangeText={handleChange('material_name')}
                                handleBlur={handleBlur('material_name')}
                                otherStyles="mt-2"
                                testId="txt001"
                                multiline={true}
                                numberOfLines={3}
                                editable={false}
                              />
                            </TouchableOpacity>
                          </View>
                          {touched.material_name && errors.material_name && <Text className="text-gray-50">{errors.material_name}</Text>}

                          <View className="">
                            <FormField
                              title="Qty"
                              value={values.material_qty}
                              handleChangeText={handleChange('material_qty')}
                              handleBlur={handleBlur('material_qty')}
                              otherStyles="mt-2"
                              testId="txt003"
                              keyboardType="number-pad"
                            />
                          </View>
                          {touched.material_qty && errors.material_qty && <Text className="text-gray-50">{errors.material_qty}</Text>}

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
                                onPress={() => { setInitialValues({ material_id: '', material_name: '', material_qty: '' }); setModalFormMaterialVisible(false); }}
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
        {/*End Modal Form Item Bundling */}

        {/* Modal List Material */}
        <Modal
          visible={modalListMaterial}
          animationType="fade"
          transparent={true}
          onRequestClose={() => setModalListMaterial(false)}
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
                      data={dataListMaterial ?? []}
                      keyExtractor={(item, index) => (item.$id ? item.$id.toString() : index.toString())}
                      renderItem={({ item, index }) => (

                        <View className="flex-row border-b border-gray-200 py-2" testID={`item-${index}`} >
                          <View className="flex-row">
                            <View className="w-full ml-1">
                              <TouchableOpacity
                                className=""
                                onPress={() => { handleValues(item.id, item.name) }}
                              >
                                <View className="">
                                  <Text className="text-sm font-PoppinsSemiBold text-blue-200 ml-1" testID='btn-001'>
                                    {CapitalizeEachWord(item.name)}
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
                    onPress={() => { setSearchQuery(''); setModalListMaterial(false); }}
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
        {/*End Modal List Material */}

        {/* Modal Wholesale */}
        <Modal
          visible={modalWholesaleVisible}
          animationType="fade"
          transparent={true}
          onRequestClose={() => setModalWholesaleVisible(false)}
        >
          <View style={styles.modalBackground}>
            <View style={styles.modalContainer}>
              {isLoading ? (
                <ActivityIndicator size="large" color="#0000ff" />
              ) : (
                <View>
                  <Text style={styles.modalTitle}>Harga Grosir</Text>
                  <Text className="text-center mt-[-10px] mb-5">{itemName} - {variantName}</Text>
                  <View className="max-h-[300px]">
                    <View style={styles.tableHeader} className="">
                      <View className="w-[100px]">
                        <Text>Minimal Order</Text>
                      </View>
                      <View className="w-[100px]">
                        <Text className="text-right">Harga</Text>
                      </View>
                      <View className="w-[100px]">
                        <Text className="text-right">Aksi</Text>
                      </View>
                    </View>

                    <ScrollView>
                      {dataWholesale?.length == 0 && (
                        <View>
                          <Text className="text-center">Belum ada harga grosir</Text>
                        </View>
                      )}
                      {dataWholesale?.map((item, index) => (
                        <View key={index} style={styles.tableRow}>
                          <View className="w-[140px]">
                            <Text style={styles.tableCell} className="text-left">{item.min_order}</Text>
                          </View>
                          <View className="w-[60px]">
                            <Text style={styles.tableCell} className="text-right">{FormatAmount(item.price)}</Text>
                          </View>
                          <View className="w-[140px] items-center ml-4">
                            <TouchableOpacity
                              onPress={() => { showAlertConfirm('Konfirmasi', 'Apakah Anda yakin ingin menghapus harga grosir ini?', 'wholesale', item.id) }}
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
                    onPress={() => { setModalFormWholesaleVisible(true) }}
                    activeOpacity={0.7}
                    className='rounded-[3px] min-h-[30px] min-w-[115px] justify-center bg-secondary'
                  >
                    <View className="flex-row items-center justify-center">
                      <View>
                        <Icon name="plus" size={17} color="white" />
                      </View>
                      <View className="ml-0.5" />
                      <Text className='font-PoppinsRegular text-m text-white' testID='btn009'>
                        Harga Grosir
                      </Text>
                    </View>
                  </TouchableOpacity>
                </View>
                <View className="mr-2">
                  <TouchableOpacity
                    onPress={() => setModalWholesaleVisible(false)}
                    activeOpacity={0.7}
                    className='rounded-[3px] min-h-[30px] justify-center items-center bg-orange-400'
                  >
                    <Text className='font-PoppinsRegular text-m text-white px-6' testID='btn010'>
                      Tutup
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </View>
        </Modal>
        {/*End Modal Wholesale */}

        {/* Modal Form Wholesale */}
        <Modal
          visible={modalFormWholesaleVisible}
          animationType="fade"
          transparent={true}
          onRequestClose={() => setModalFormWholesaleVisible(false)}
        >
          <View style={styles.modalBackground}>
            <View style={styles.modalContainer}>
              {isLoading ? (
                <ActivityIndicator size="large" color="#0000ff" />
              ) : (
                <View>
                  <Text style={styles.modalTitle}>Tambah Harga Grosir</Text>
                  <View className="max-h-[300px]">

                    <Formik
                      initialValues={initialWholesaleValues}
                      validationSchema={validationWholesaleSchema}
                      onSubmit={(values) => {
                        submitActionWholesale(values);
                      }}
                      enableReinitialize
                    >
                      {({ handleChange, handleBlur, handleSubmit, values, errors, touched }) => (
                        <View>

                          <View className="">
                            <FormField
                              title="Minimal Beli"
                              value={values.wholesale_min_order}
                              handleChangeText={handleChange('wholesale_min_order')}
                              handleBlur={handleBlur('wholesale_min_order')}
                              otherStyles="mt-2"
                              testId="txt004"
                              keyboardType="number-pad"
                            />
                          </View>
                          {touched.wholesale_min_order && errors.wholesale_min_order && <Text className="text-gray-50">{errors.wholesale_min_order}</Text>}

                          <View className="">
                            <FormField
                              title="Harga Grosir"
                              value={values.wholesale_price}
                              handleChangeText={handleChange('wholesale_price')}
                              handleBlur={handleBlur('wholesale_price')}
                              otherStyles="mt-2"
                              testId="txt005"
                              keyboardType="number-pad"
                            />
                          </View>
                          {touched.wholesale_price && errors.wholesale_price && <Text className="text-gray-50">{errors.wholesale_price}</Text>}

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
                                onPress={() => { setInitialValues({ wholesale_min_order: '', wholesale_price: '' }); setModalFormWholesaleVisible(false); }}
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
        {/*End Modal Form Wholesale */}

        {/* Modal Menu History */}
        <Modal
          visible={modalMenuHistoryVisible}
          animationType="fade"
          transparent={true}
          onRequestClose={() => setModalMenuHistoryVisible(false)}
        >
          <View style={styles.modalBackground}>
            <View style={styles.modalContainer}>
              <TouchableOpacity
                className="border-b border-gray-200 px-4 py-2"
                onPress={() => { handleModal('hpp'); }}
              >
                <View className="flex-row items-center" testID="item-001">
                  <Icon name={'history'} color="#48a7f6" size={25} />
                  <Text className="text-sm font-PoppinsSemiBold text-secondary ml-3">{'Riwayat HPP'}</Text>
                </View>
              </TouchableOpacity>

              <TouchableOpacity
                className="border-b border-gray-200 px-4 py-2"
                onPress={() => { handleModal('price'); }}
              >
                <View className="flex-row items-center" testID="item-001">
                  <Icon name={'history'} color="#48a7f6" size={25} />
                  <Text className="text-sm font-PoppinsSemiBold text-secondary ml-3">{'Riwayat Harga'}</Text>
                </View>
              </TouchableOpacity>

              <TouchableOpacity
                className="border-b border-gray-200 px-4 py-2"
                onPress={() => { handleModal('stock'); }}
              >
                <View className="flex-row items-center" testID="item-001">
                  <Icon name={'history'} color="#48a7f6" size={25} />
                  <Text className="text-sm font-PoppinsSemiBold text-secondary ml-3">{'Riwayat Stok'}</Text>
                </View>
              </TouchableOpacity>

              <TouchableOpacity
                className="border-b border-gray-200 px-4 py-2"
                onPress={() => { handleModal('wholesale'); }}
              >
                <View className="flex-row items-center" testID="item-001">
                  <Icon name={'history'} color="#48a7f6" size={25} />
                  <Text className="text-sm font-PoppinsSemiBold text-secondary ml-3">{'Riwayat Grosir'}</Text>
                </View>
              </TouchableOpacity>

              <View className="mr-2 mt-3 w-[100px]">
                <TouchableOpacity
                  onPress={() => setModalMenuHistoryVisible(false)}
                  activeOpacity={0.7}
                  className='rounded-[3px] min-h-[30px] justify-center items-center bg-secondary'
                >
                  <Text className='font-PoppinsRegular text-m text-white px-6' testID='btn011'>
                    Tutup
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
        {/*End Modal Menu History */}

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
    minHeight: 240,
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