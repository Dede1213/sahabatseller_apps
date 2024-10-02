import { Alert, ScrollView, StyleSheet, Text, View } from 'react-native'
import React, { useState } from 'react'
import { TouchableOpacity } from 'react-native'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useGlobalContext, transaction } from '../../../../context/globalProvider'
import { useNavigation } from '@react-navigation/native';
import { CapitalizeEachWord, FormatAmount } from '../../../../lib/globalFunction';
import CustomButton from '../../../../components/CustomButton';
import { set } from 'date-fns';
import { Modal } from 'react-native';
import { ActivityIndicator } from 'react-native';
import { fetchData } from '../../../../lib/fetchData';
import { API_HOST } from '@env';
import FormField from '../../../../components/FormField';
import { Button } from 'react-native';
import { TextInput } from 'react-native';

const Cart = () => {
  const navigation = useNavigation();
  const { user, transaction, setTransaction } = useGlobalContext()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isLoading, setIsLoading] = useState(true);
  const [modalCustomerVisible, setModalCustomerVisible] = useState(false);
  const [dataCustomer, setDataCustomer] = useState([]);
  const [searchQueryCustomer, setSearchQueryCustomer] = useState('');

  const [modalSalesVisible, setModalSalesVisible] = useState(false);
  const [dataSales, setDataSales] = useState([]);
  const [searchQuerySales, setSearchQuerySales] = useState('');

  const handleModalCustomer = async () => {
    setIsLoading(true);
    try {
      var keyword = ''
      if (searchQueryCustomer !== '') {
        var keyword = `&keyword=${searchQueryCustomer}`
      }
      const response = await fetchData(`${API_HOST}/customer/location?no_encrypt=YES&page=1&limit=50&order_by=id desc${keyword}`,
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
          setDataCustomer(response.data.rows);
          setModalCustomerVisible(true);
          setIsLoading(false);
        }
      } else {
        Alert.alert(response.message)
      }
    } catch (error) {
      Alert.alert(error.message);
    }
  }

  const handleModalSales = async () => {
    setIsLoading(true);
    try {
      var keyword = ''
      if (searchQuerySales !== '') {
        var keyword = `&keyword=${searchQuerySales}`
      }
      const response = await fetchData(`${API_HOST}/sales/location?no_encrypt=YES&page=1&limit=100&order_by=id desc${keyword}`,
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
          setDataSales(response.data.rows);
          setModalSalesVisible(true);
          setIsLoading(false);
        }
      } else {
        Alert.alert(response.message)
      }
    } catch (error) {
      Alert.alert(error.message);
    }
  }

  return (
    <View className="flex-1 bg-white">
      <ScrollView className="flex-1">
        <View className="flex-row items-center ml-[10%] mt-4 w-[80%] justify-between">
          <TouchableOpacity
            onPress={() => { handleModalCustomer() }}
            activeOpacity={0.5}
          >
            <View className="mr-4 items-center">
              <Icon name={'human-dolly'} color="gray" size={35} />
              <Text className="text-xs font-PoppinsSemiBold text-gray-100">Pelanggan</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => { handleModalSales() }}
            activeOpacity={0.5}
          >
            <View className="mr-4 items-center">
              <Icon name={'human-male-board-poll'} color="gray" size={35} />
              <Text className="text-xs font-PoppinsSemiBold text-gray-100">Sales</Text>
            </View>
          </TouchableOpacity>

          <View className="mr-4 items-center">
            <Icon name={'sale'} color="gray" size={35} />
            <Text className="text-xs font-PoppinsSemiBold text-gray-100">Diskon</Text>
          </View>
          <View className="mr-4 items-center">
            <Icon name={'bank'} color="gray" size={35} />
            <Text className="text-xs font-PoppinsSemiBold text-gray-100">Pajak</Text>
          </View>
          <View className="mr-4 items-center">
            <Icon name={'notebook-edit'} color="gray" size={35} />
            <Text className="text-xs font-PoppinsSemiBold text-gray-100">Catatan</Text>
          </View>
          {/* <View className="">
            <Text className="text-sm font-PoppinsSemiBold text-gray-100">Harga Grosir Aktif</Text>
          </View> */}
          {/* <View>
            <TouchableOpacity className="flex-row items-center" onPress={() => showAlert("Harga Grosir", wholesaleList)}>
              <Icon name={'information-outline'} color="gray" size={23} />
              <Text className="text-base font-PoppinsRegular text-white">Info</Text>
            </TouchableOpacity>
          </View> */}
        </View>

        <View className="border-b-4 border-gray-200 px-4 py-1 "></View>

        {transaction.items.map((item, index) => (
          <TouchableOpacity key={index}
            className="border-b border-gray-200 px-4 py-4"
            onPress={() => {
              navigation.navigate('Transaction', {
                screen: 'CreateTransactionStack'
              })
            }}
          >
            <View className="flex-row" testID="item-001">
              <Text className="text-sm font-PoppinsSemiBold text-gray-100 font-bold">{item.item_name ? CapitalizeEachWord(item.item_name) : ''} - </Text>
              <Text className="text-sm font-PoppinsSemiBold text-gray-100 font-bold">{item.variant_name ? CapitalizeEachWord(item.variant_name) : ''}</Text>
            </View>

            <View className="flex-row justify-between" testID="item-001">
              <View className="flex-row items-center">
                <Text className="text-sm font-PoppinsSemiBold text-gray-100">Rp. {item.price ? FormatAmount(item.price) : 0}  x</Text>
                <Text className="text-sm font-PoppinsSemiBold text-gray-100">{item.quantity}</Text>
              </View>
              <View>
                <Text className="text-sm font-PoppinsSemiBold text-gray-100 mr-3">Rp. {item.sub_total ? FormatAmount(item.sub_total) : 0}</Text>
              </View>
            </View>

            <View className="" testID="item-001">
              <Text className="text-sm font-PoppinsSemiBold text-gray-100">Diskon Harga (- Rp.{item.disc_amount ? FormatAmount(item.disc_amount) : 0})</Text>
            </View>
          </TouchableOpacity>
        ))}

        <View className="border-b-4 border-gray-200 px-4 mt-60"></View>
        <View className="flex-row px-4 py-1">
          <View className="flex-row items-center">
            <View className="mr-5">
              <Text className="text-sm font-PoppinsSemiBold text-gray-100">Pelanggan </Text>
              <Text className="text-sm font-PoppinsSemiBold text-gray-100">Sales</Text>
              <Text className="text-sm font-PoppinsSemiBold text-gray-100">Diskon</Text>
              <Text className="text-sm font-PoppinsSemiBold text-gray-100">Pajak</Text>
              <Text className="text-xl font-PoppinsSemiBold text-gray-100">Total Harga</Text>
            </View>
            <View className="ml-2">
              <Text className="text-sm font-PoppinsSemiBold text-gray-100"> : </Text>
              <Text className="text-sm font-PoppinsSemiBold text-gray-100"> : </Text>
              <Text className="text-sm font-PoppinsSemiBold text-gray-100"> : </Text>
              <Text className="text-sm font-PoppinsSemiBold text-gray-100"> : </Text>
              <Text className="text-lg font-PoppinsSemiBold text-gray-100"> : </Text>
            </View>
          </View>
          <View>
            <Text className="text-sm font-PoppinsSemiBold text-gray-100">{transaction.customer_name ? CapitalizeEachWord(transaction.customer_name) : ''}</Text>
            <Text className="text-sm font-PoppinsSemiBold text-gray-100">-</Text>
            <Text className="text-sm font-PoppinsSemiBold text-gray-100">-</Text>
            <Text className="text-sm font-PoppinsSemiBold text-gray-100">-</Text>
            <Text className="text-xl font-PoppinsSemiBold text-gray-100">Rp. {transaction.total_amount ? FormatAmount(transaction.total_amount) : 0}</Text>
          </View>
        </View>
        <View className="w-[90%] ml-[5%]">
          <CustomButton
            title="Simpan Transaksi"
            handlePress={() => {
              console.log(transaction)
              // navigation.navigate('Transaction', {
              //   screen: 'CreateTransactionStack'
              // })
            }}
            containerStyles={"mt-10 bg-secondary-200"}
            textStyles="text-white"
            isLoading={isSubmitting}
            testId="btn001"
          />
        </View>


        {/* Modal Customer */}
        <Modal
          visible={modalCustomerVisible}
          animationType="fade"
          transparent={true}
          onRequestClose={() => setModalCustomerVisible(false)}
        >
          <View style={styles.modalBackground}>
            <View style={styles.modalContainer}>
              {isLoading ? (
                <ActivityIndicator size="large" color="#0000ff" />
              ) : (
                <View>
                  <Text style={styles.modalTitle}>Pilih Pelanggan</Text>
                  <View className="max-h-[300px]">
                    <View className="flex-row mb-4">
                      <TextInput
                        className="w-[70%] border border-gray-300 rounded-lg px-4 py-2 mr-2 h-[40px]"
                        placeholder="Cari Nama Pelanggan"
                        value={searchQueryCustomer}
                        onChangeText={(value) => setSearchQueryCustomer(value)}
                        testID="txt001"
                      />
                      <View className='border border-secondary-200 rounded-lg bg-secondary-200 h-[40px] items-center justify-center px-4'>
                        <TouchableOpacity
                          onPress={() => {
                            handleModalCustomer();
                          }}
                          activeOpacity={0.7}
                        >
                          <Icon name="account-search-outline" size={25} color="#fff" testID='btn004' />
                        </TouchableOpacity>
                      </View>

                    </View>
                    <View style={styles.tableHeader} className="">
                      <View className="w-[250px]">
                        <Text>Pelanggan</Text>
                      </View>
                      <View className="w-[60px]">
                        <Text className="text-right">Aksi</Text>
                      </View>
                    </View>

                    <ScrollView>
                      {dataCustomer?.length == 0 && (
                        <View>
                          <Text className="text-center">Belum ada data pelanggan</Text>
                        </View>
                      )}
                      {dataCustomer?.map((item, index) => (
                        <View key={index} style={styles.tableRow}>
                          <View className="w-[260px]">
                            <Text style={styles.tableCell} className="text-left">{item.name}</Text>
                            <Text style={styles.tableCell} className="text-left">{item.address} {item.phone ? ' - ' + item.phone : ''}</Text>
                          </View>
                          <View className="w-[25px] items-center ml-4">
                            <TouchableOpacity
                              onPress={() => {
                                setTransaction(prevTransaction => ({ ...prevTransaction, customer_id: item.id, customer_name: item.name }));
                                setModalCustomerVisible(false);
                              }}
                              activeOpacity={0.7}
                              className=''
                            >
                              <Icon name="account-plus-outline" size={25} color="gray" testID='btn004' />
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
                    onPress={() => { navigation.navigate('Customer', { screen: 'CustomerStack' }) }}
                    activeOpacity={0.7}
                    className='rounded-[3px] min-h-[30px] min-w-[155px] justify-center bg-secondary'
                  >
                    <View className="flex-row items-center justify-center">
                      <View>
                        <Icon name="plus" size={17} color="white" />
                      </View>
                      <View className="ml-0.5" />
                      <Text className='font-PoppinsRegular text-m text-white' testID='btn005'>
                        Tambah Pelanggan
                      </Text>
                    </View>
                  </TouchableOpacity>
                </View>
                <View className="mr-2">
                  <TouchableOpacity
                    onPress={() => setModalCustomerVisible(false)}
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
        {/*End Modal Customer */}

        {/* Modal Sales */}
        <Modal
          visible={modalSalesVisible}
          animationType="fade"
          transparent={true}
          onRequestClose={() => setModalSalesVisible(false)}
        >
          <View style={styles.modalBackground}>
            <View style={styles.modalContainer}>
              {isLoading ? (
                <ActivityIndicator size="large" color="#0000ff" />
              ) : (
                <View>
                  <Text style={styles.modalTitle}>Pilih Sales</Text>
                  <View className="max-h-[300px]">
                    <View className="flex-row mb-4">
                      <TextInput
                        className="w-[70%] border border-gray-300 rounded-lg px-4 py-2 mr-2 h-[40px]"
                        placeholder="Cari Nama Sales"
                        value={searchQuerySales}
                        onChangeText={(value) => setSearchQuerySales(value)}
                        testID="txt001"
                      />
                      <View className='border border-secondary-200 rounded-lg bg-secondary-200 h-[40px] items-center justify-center px-4'>
                        <TouchableOpacity
                          onPress={() => {
                            handleModalSales();
                          }}
                          activeOpacity={0.7}
                        >
                          <Icon name="account-search-outline" size={25} color="#fff" testID='btn004' />
                        </TouchableOpacity>
                      </View>

                    </View>
                    <View style={styles.tableHeader} className="">
                      <View className="w-[250px]">
                        <Text>Sales</Text>
                      </View>
                      <View className="w-[60px]">
                        <Text className="text-right">Aksi</Text>
                      </View>
                    </View>

                    <ScrollView>
                      {dataSales?.length == 0 && (
                        <View>
                          <Text className="text-center">Belum ada data sales</Text>
                        </View>
                      )}
                      {dataSales?.map((item, index) => (
                        <View key={index} style={styles.tableRow}>
                          <View className="w-[260px]">
                            <Text style={styles.tableCell} className="text-left">{item.name}</Text>
                            <Text style={styles.tableCell} className="text-left">{item.address} {item.phone ? ' - ' + item.phone : ''}</Text>
                          </View>
                          <View className="w-[25px] items-center ml-4">
                            <TouchableOpacity
                              onPress={() => {
                                setTransaction(prevTransaction => ({ ...prevTransaction, sales_id: item.id, sales_name: item.name }));
                                setModalSalesVisible(false);
                              }}
                              activeOpacity={0.7}
                              className=''
                            >
                              <Icon name="account-plus-outline" size={25} color="gray" testID='btn004' />
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
                    onPress={() => { navigation.navigate('Sales', { screen: 'SalesStack' }) }}
                    activeOpacity={0.7}
                    className='rounded-[3px] min-h-[30px] min-w-[155px] justify-center bg-secondary'
                  >
                    <View className="flex-row items-center justify-center">
                      <View>
                        <Icon name="plus" size={17} color="white" />
                      </View>
                      <View className="ml-0.5" />
                      <Text className='font-PoppinsRegular text-m text-white' testID='btn005'>
                        Tambah Sales
                      </Text>
                    </View>
                  </TouchableOpacity>
                </View>
                <View className="mr-2">
                  <TouchableOpacity
                    onPress={() => setModalCustomerVisible(false)}
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
        {/*End Modal Sales */}

      </ScrollView>
    </View>
  )
}

export default Cart

const styles = StyleSheet.create({
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