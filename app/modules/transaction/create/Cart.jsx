import { Alert, ScrollView, StyleSheet, Text, View } from 'react-native'
import React, { useEffect, useState } from 'react'
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
import { tr } from 'date-fns/locale';

const Cart = () => {
  const navigation = useNavigation();
  const { user, transaction, setTransaction, refreshTrigger, setRefreshTrigger } = useGlobalContext()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isLoading, setIsLoading] = useState(true);
  const [modalCustomerVisible, setModalCustomerVisible] = useState(false);
  const [dataCustomer, setDataCustomer] = useState([]);
  const [searchQueryCustomer, setSearchQueryCustomer] = useState('');

  const [modalSalesVisible, setModalSalesVisible] = useState(false);
  const [dataSales, setDataSales] = useState([]);
  const [searchQuerySales, setSearchQuerySales] = useState('');

  const [modalNoteVisible, setModalNoteVisible] = useState(false);
  const [note, setNote] = useState('');

  const [modalDiscountVisible, setModalDiscountVisible] = useState(false);
  const [discount, setDiscount] = useState(0);
  const [discountType, setDiscountType] = useState('');
  const [isPercent, setIsPercent] = useState(true);

  const [modalTaxVisible, setModalTaxVisible] = useState(false);
  const [tax, setTax] = useState(0);


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

  const handleTax = () => {
    let taxAmount = 0
    let discAmount = 0
    let totalAmount = 0

    transaction.items.map(item => {
      totalAmount += item.sub_total
    })

    if (discount > 0) {
      discAmount = totalAmount * discount / 100
      totalAmount = totalAmount - discAmount
    }

    taxAmount = totalAmount * tax / 100
    totalAmount = totalAmount + taxAmount

    setTransaction(prevTransaction => ({
      ...prevTransaction,
      tax: tax.toString() + '%',
      tax_amount: Math.round(taxAmount),
      total_amount: Math.round(totalAmount)
    }))
  }

  const handleDiscount = (param) => {
    let disc_amount = 0
    let total_amount = 0
    let total_discount = 0
    let discount_type = isPercent ? 'PERSEN' : 'NOMINAL'

    transaction.items.map(item => {
      total_amount += item.sub_total
      total_discount += item.discount_item_amount
    })

    if (param == 'simpan') {
      if (isPercent) {
        disc_amount = total_amount * discount / 100
        setDiscountType(discount_type)
      } else {
        disc_amount = discount
        setDiscountType(discount_type)
      }
    } else {
      setDiscountType('')
      setDiscount(0)
    }

    total_amount = total_amount - disc_amount

    if (user.tax_count == "YA" || tax > 0) {
      let taxAmount = 0
      taxAmount = total_amount * tax / 100
      setTransaction(prevTransaction => ({
        ...prevTransaction,
        tax: tax.toString() + '%',
        tax_amount: Math.round(taxAmount),
      }))
      total_amount = total_amount + taxAmount
    }

    setTransaction(prevTransaction => ({
      ...prevTransaction,
      discount: discount,
      discount_type: discount_type,
      discount_amount: Math.round(disc_amount),
      total_discount_amount: Math.round(total_discount),
      total_amount: Math.round(total_amount)
    }))
  }

  const resetCart = () => {
    setIsSubmitting(true)
    setTransaction({
      payment_type_id: '',
      payment_type_name: '',
      customer_id: '',
      customer_name: '',
      sales_id: '',
      sales_name: '',
      transaction_date: '',
      discount: 0,
      discount_type: '',
      discount_amount: 0,
      total_discount_amount: 0,
      tax: '',
      tax_amount: 0,
      total_amount: 0,
      payment_status: '',
      due_date: '',
      status: '',
      note: '',
      items: [],
    })
  }

  useEffect(() => {

    if (transaction.items.length == 0) {
      setIsSubmitting(true)
    } else {
      setIsSubmitting(false)
    }

    let totalAmount = 0
    transaction.items.map(item => {
      totalAmount += item.sub_total
    })

    if (user.tax_count == "YA") {
      let taxAmount = 0
      setTax(11)
      taxAmount = totalAmount * 11 / 100
      setTransaction(prevTransaction => ({
        ...prevTransaction,
        tax: tax.toString() + '%',
        tax_amount: Math.round(taxAmount)
      }))
      totalAmount = totalAmount + taxAmount
    }

    setTransaction(prevTransaction => ({
      ...prevTransaction,
      total_amount: Math.round(totalAmount)
    }))

    setRefreshTrigger(false);
  }, [refreshTrigger]);

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

          <TouchableOpacity
            onPress={() => { setModalDiscountVisible(true) }}
            activeOpacity={0.5}
          >
            <View className="mr-4 items-center">
              <Icon name={'sale'} color="gray" size={35} />
              <Text className="text-xs font-PoppinsSemiBold text-gray-100">Diskon</Text>
            </View>
          </TouchableOpacity>



          <TouchableOpacity
            onPress={() => { setModalTaxVisible(true) }}
            activeOpacity={0.5}
          >
            <View className="mr-4 items-center">
              <Icon name={'bank'} color="gray" size={35} />
              <Text className="text-xs font-PoppinsSemiBold text-gray-100">Pajak</Text>
            </View>
          </TouchableOpacity>



          <TouchableOpacity
            onPress={() => { setModalNoteVisible(true) }}
            activeOpacity={0.5}
          >
            <View className="mr-4 items-center">
              <Icon name={'notebook-edit'} color="gray" size={35} />
              <Text className="text-xs font-PoppinsSemiBold text-gray-100">Catatan</Text>
            </View>
          </TouchableOpacity>


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

        {transaction.items.length > 0 &&
          transaction.items.map((item, index) => (
            <TouchableOpacity key={index}
              className="border-b border-gray-200 px-4 py-4"
              onPress={() => {
                navigation.navigate('Transaction', {
                  screen: 'VariantEditTransactionStack',
                  params: { id: item.id }
                })
              }}
            >
              <View className="flex-row" testID="item-001">
                <Text className="text-sm font-PoppinsSemiBold text-secondary-200 font-bold">{item.item_name ? CapitalizeEachWord(item.item_name) : ''} - </Text>
                <Text className="text-sm font-PoppinsSemiBold text-secondary-200 font-bold">{item.variant_name ? CapitalizeEachWord(item.variant_name) : ''}</Text>
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
                <Text className="text-sm font-PoppinsSemiBold text-gray-100">Diskon Harga (- Rp.{item.discount_item_amount ? FormatAmount(item.discount_item_amount) : 0})</Text>
              </View>
            </TouchableOpacity>
          ))
        }

        {transaction.items.length == 0 &&
          <TouchableOpacity
            className=""
            onPress={() => {
              navigation.navigate('Transaction', {
                screen: 'CreateTransactionStack'
              })
            }}
          >
            <View className="flex-row items-center justify-center py-4" testID="item-001">
              <Icon name={'plus'} color="#1a7dcf" size={25} />
              <Text className="text-base font-PoppinsSemiBold text-secondary-200 ml-1">{'Tambah Produk'}</Text>
            </View>
          </TouchableOpacity>
        }

        <View className="border-b-4 border-gray-200 px-4 mt-60"></View>
        <View className="flex-row px-4 py-1">
          <View className="flex-row items-center">
            <View className="mr-5">
              <Text className="text-sm font-PoppinsSemiBold text-gray-100">Pelanggan </Text>
              <Text className="text-sm font-PoppinsSemiBold text-gray-100">Sales</Text>
              <Text className="text-sm font-PoppinsSemiBold text-gray-100">Diskon</Text>
              <Text className="text-sm font-PoppinsSemiBold text-gray-100">Pajak</Text>
              <Text className="text-sm font-PoppinsSemiBold text-gray-100">Catatan</Text>
              <Text className="text-xl font-PoppinsSemiBold text-gray-100">Total Harga</Text>
            </View>
            <View className="ml-2">
              <Text className="text-sm font-PoppinsSemiBold text-gray-100"> : </Text>
              <Text className="text-sm font-PoppinsSemiBold text-gray-100"> : </Text>
              <Text className="text-sm font-PoppinsSemiBold text-gray-100"> : </Text>
              <Text className="text-sm font-PoppinsSemiBold text-gray-100"> : </Text>
              <Text className="text-sm font-PoppinsSemiBold text-gray-100"> : </Text>
              <Text className="text-lg font-PoppinsSemiBold text-gray-100"> : </Text>
            </View>
          </View>
          <View>
            <Text className="text-sm font-PoppinsSemiBold text-gray-100">{transaction.customer_name ? CapitalizeEachWord(transaction.customer_name) : '-'}</Text>
            <Text className="text-sm font-PoppinsSemiBold text-gray-100">{transaction.sales_name ? CapitalizeEachWord(transaction.sales_name) : '-'}</Text>
            <Text className="text-sm font-PoppinsSemiBold text-gray-100">{transaction.discount_amount ? transaction.discount_type == "PERSEN" ? transaction.discount + "% (Rp." + FormatAmount(transaction.discount_amount) + ")" : "Rp." + FormatAmount(transaction.discount_amount) : '-'}</Text>
            <Text className="text-sm font-PoppinsSemiBold text-gray-100">{transaction.tax_amount ? tax + "%" + " (Rp." + FormatAmount(transaction.tax_amount) + ")" : '-'}</Text>
            <Text className="text-sm font-PoppinsSemiBold text-gray-100">{transaction.note ? CapitalizeEachWord(transaction.note) : '-'}</Text>
            <Text className="text-xl font-PoppinsSemiBold text-gray-100">Rp. {transaction.total_amount ? FormatAmount(transaction.total_amount) : 0}</Text>
          </View>
        </View>
        <View className="w-[90%] ml-[5%]">
          <CustomButton
            title="Bayar"
            handlePress={() => {
              navigation.navigate('Transaction', {
                screen: 'PaymentTransactionStack'
              })
            }}
            containerStyles={"mt-10 bg-secondary-200"}
            textStyles="text-white"
            isLoading={isSubmitting}
            testId="btn001"
            disabled={isSubmitting}
          />
          <CustomButton
            title="Kosongkan Keranjang"
            handlePress={() => resetCart()}
            containerStyles={""}
            isLoading={isSubmitting}
            textStyles={"color-red-500 underline"}
            testId="btn002"
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
                    onPress={() => setModalSalesVisible(false)}
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

        {/* Modal Notes */}
        <Modal
          visible={modalNoteVisible}
          animationType="fade"
          transparent={true}
          onRequestClose={() => setModalNoteVisible(false)}
        >
          <View style={styles.modalBackground}>
            <View style={styles.modalContainer}>
              <View>
                <Text style={styles.modalTitle}>Tambah Catatan</Text>
                <View className="max-h-[300px]">
                  <View className="flex-row mb-4">
                    <TextInput
                      className="w-full border border-gray-300 rounded-lg px-4 py-2 mr-2"
                      placeholder="Catatan"
                      value={note}
                      onChangeText={(value) => setNote(value)}
                      testID="txt001"
                      numberOfLines={4}
                      multiline={true}
                    />
                  </View>

                </View>
              </View>
              <View className="flex-row mt-5">
                <View className='rounded-[3px] min-h-[30px] justify-center items-center bg-secondary'>
                  <TouchableOpacity
                    onPress={() => {
                      setTransaction(prevTransaction => ({ ...prevTransaction, note: note }));
                      setModalNoteVisible(false);
                    }}
                    activeOpacity={0.7}
                  >
                    <Text className='font-PoppinsRegular text-m text-white px-6' testID='btn007'> Simpan </Text>
                  </TouchableOpacity>
                </View>

                <View className="ml-2">
                  <TouchableOpacity
                    onPress={() => setModalNoteVisible(false)}
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
        {/*End Modal Notes */}

        {/* Modal Discount */}
        <Modal
          visible={modalDiscountVisible}
          animationType="fade"
          transparent={true}
          onRequestClose={() => setModalDiscountVisible(false)}
        >
          <View style={styles.modalBackground}>
            <View style={styles.modalContainer}>
              <View>
                <View className="space-y-2">
                  <Text className="text-base font-PoppinsSemiBold text-gray-100">Diskon Transaksi</Text>

                  {/* Buttons to select Normal or Special Price */}
                  <View className="flex-row mt-4">
                    {/* Price Input Field */}
                    <View className="w-[60%]">
                      {/* <Text className="text-base font-PoppinsSemiBold text-gray-100">Harga</Text> */}
                      <TextInput
                        value={(!isPercent ? discount ? FormatAmount(discount) : '' : discount == 0 ? '' : discount).toString()}
                        onChangeText={(value) => { setDiscount(value); }}
                        keyboardType="numeric"
                        placeholder={isPercent ? 'Discount %' : 'Discount Nominal'}
                        className={`border-2 border-gray-200 rounded-xl px-4 py-2 mt-2 text-gray-100 font-poppinsSemiBold text-base focus:border-secondary`}
                      />
                    </View>

                    <View className="flex-row items-center">
                      {/* Normal Price Button */}
                      <TouchableOpacity
                        onPress={() => {
                          setIsPercent(true);
                          handleDiscount('');
                        }}
                        className={`ml-2 mt-2 px-3 py-3 rounded-xl ${isPercent ? 'bg-blue-500' : 'bg-gray-300'
                          }`}
                      >
                        <Icon name={'percent'} color="#ffffff" size={23} />
                      </TouchableOpacity>

                      {/* Special Price Button */}
                      <TouchableOpacity
                        onPress={() => {
                          setIsPercent(false);
                          handleDiscount('');
                        }}
                        className={`mt-2 px-3 py-3 ml-1 rounded-xl ${!isPercent ? 'bg-blue-500' : 'bg-gray-300'
                          }`}
                      >
                        <Text className="text-white font-bold text-base">RP</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
              </View>
              <View className="flex-row mt-5">
                <View className='rounded-[3px] min-h-[30px] justify-center items-center bg-secondary'>
                  <TouchableOpacity
                    onPress={() => {
                      handleDiscount('simpan');
                      setModalDiscountVisible(false);
                    }}
                    activeOpacity={0.7}
                  >
                    <Text className='font-PoppinsRegular text-m text-white px-6' testID='btn007'> Simpan </Text>
                  </TouchableOpacity>
                </View>

                <View className="ml-2">
                  <TouchableOpacity
                    onPress={() => setModalDiscountVisible(false)}
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
        {/*End Modal Discount */}

        {/* Modal Tax */}
        <Modal
          visible={modalTaxVisible}
          animationType="fade"
          transparent={true}
          onRequestClose={() => setModalTaxVisible(false)}
        >
          <View style={styles.modalBackground}>
            <View style={styles.modalContainer}>
              <View>
                <View className="space-y-2">
                  <Text className="text-base font-PoppinsSemiBold text-gray-100">Pajak Transaksi</Text>

                  {/* Buttons to select Normal or Special Price */}
                  <View className="flex-row mt-4">
                    {/* Price Input Field */}
                    <View className="w-[80%]">
                      {/* <Text className="text-base font-PoppinsSemiBold text-gray-100">Harga</Text> */}
                      <TextInput
                        value={(tax ? FormatAmount(tax) : '').toString()}
                        onChangeText={(value) => { setTax(value); }}
                        keyboardType="numeric"
                        placeholder={'Pajak'}
                        className={`border-2 border-gray-200 rounded-xl px-4 py-2 mt-2 text-gray-100 font-poppinsSemiBold text-base focus:border-secondary`}
                      />
                    </View>

                    <View className="flex-row items-center ml-2 mt-2 px-3 py-3 rounded-xl bg-blue-500">
                      <Icon name={'percent'} color="#ffffff" size={23} />
                    </View>
                  </View>
                </View>
              </View>
              <View className="flex-row mt-5">
                <View className='rounded-[3px] min-h-[30px] justify-center items-center bg-secondary'>
                  <TouchableOpacity
                    onPress={() => {
                      handleTax();
                      setModalTaxVisible(false);
                    }}
                    activeOpacity={0.7}
                  >
                    <Text className='font-PoppinsRegular text-m text-white px-6' testID='btn007'> Simpan </Text>
                  </TouchableOpacity>
                </View>

                <View className="ml-2">
                  <TouchableOpacity
                    onPress={() => setModalTaxVisible(false)}
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
        {/*End Modal Tax */}

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