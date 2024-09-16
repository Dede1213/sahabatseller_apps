import { ScrollView, Text, View, Alert, RefreshControl } from 'react-native'
import React, { useEffect, useState } from 'react'
import FormField from '../../../../components/FormField'
import CustomButton from '../../../../components/CustomButton'
import { useGlobalContext } from '../../../../context/globalProvider'
import { fetchData } from '../../../../lib/fetchData'
import { API_HOST } from '@env';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { useNavigation } from '@react-navigation/native'
import SelectField from '../../../../components/SelectField'
import AlertModal from '../../../../components/AlertModal'
import DateTimePicker from '@react-native-community/datetimepicker';
import { TouchableOpacity } from 'react-native'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { FormatDateForQuery } from '../../../../lib/globalFunction'


const validationSchema = Yup.object().shape({
  category: Yup.string().required('*kategori toko wajib diisi'),
  type: Yup.string().required('*tipe wajib diisi'),
  amount: Yup.string().matches(/^[0-9]+$/, '*nominal harus berupa angka').required('*nominal wajib diisi'),
});

const Create = () => {

  const navigation = useNavigation()
  const { user, setRefreshTrigger } = useGlobalContext()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [refreshing, setRefreshing] = useState(false);
  const [refetchTrigger, setRefetchTrigger] = useState(0);
  const [dataCategory, setDataCategory] = useState([])
  const [showDatePicker, setShowDatePicker] = useState(false);

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
    navigation.navigate('CashFlow', { screen: 'CashFlowViewStack' })
  };
  /* End Alert */

  const [initialValues] = useState({
    category: '',
    type: '',
    amount: '',
    note: '',
    transaction_date: new Date(),
  });

  const onRefresh = () => {
    setRefreshing(true);
    setRefetchTrigger(prev => prev + 1);
    setRefreshing(false);
  }

  useEffect(() => {
    const getDataCashFlow = async () => {
      try {
        const response = await fetchData(`${API_HOST}/cash-flow-category/list/store`,
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
            setDataCategory(formattedData);
          }
        } else {
          Alert.alert(response.message)
        }
      } catch (error) {
        Alert.alert(error.message);
      }
    }

    getDataCashFlow();

  }, [refetchTrigger]);

  const submitAction = async (form) => {
    try {
      setIsSubmitting(true)
      const response = await fetchData(`${API_HOST}/cash-flow/create`, {
        method: 'post',
        headers: {
          'X-access-token': user.token,
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        data: {
          category_id: parseInt(form.category),
          types: form.type,
          amount: parseInt(form.amount),
          note: form.note,
          transaction_date: FormatDateForQuery(form.transaction_date),
        },
      });

      if (response.code) {
        if (response.code === 200) {
          showAlert('Notifikasi', 'Cash flow berhasil ditambah.');
        }
      } else {
        Alert.alert(response.message)
      }
    } catch (error) {
      Alert.alert(error.message)
    } finally {
      setIsSubmitting(false)
    }
  }

  const dataType = [
    { label: 'Pemasukan', value: 'IN' },
    { label: 'Pengeluaran', value: 'OUT' },
  ];

  return (
    <ScrollView className="bg-primary" refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}>
      <View className="w-full justify-center px-4 bg-primary mt-5">
        <AlertModal visible={isAlertVisible} header={alertTitle} message={alertMessage} onClose={closeAlert} />
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={(values) => {
            submitAction(values);
          }}
          enableReinitialize
        >
          {({ handleChange, handleBlur, handleSubmit, values, errors, touched, setFieldValue }) => (
            <View>
              <SelectField
                title="Kategori"
                data={dataCategory}
                value={values.category}
                onValueChange={(value) => setFieldValue('category', value)}
                handleChangeText={handleChange('category')}
                handleBlur={handleBlur('category')}
                placeholder="Pilih Kategori"
                otherStyles="mt-0"
                dropdownPosition="bottom"
                testId="txt001"
              />
              {touched.category && errors.category && <Text className="text-gray-50">{errors.category}</Text>}

              <SelectField
                title="Tipe"
                data={dataType}
                value={values.type}
                onValueChange={(value) => setFieldValue('type', value)}
                handleChangeText={handleChange('type')}
                handleBlur={handleBlur('type')}
                placeholder="Pilih Tipe"
                otherStyles="mt-3"
                dropdownPosition="bottom"
                testId="txt002"
              />
              {touched.type && errors.type && <Text className="text-gray-50">{errors.type}</Text>}

              <View className={`space-y-2 mt-3`}>
                <Text className="text-base font-PoppinsMedium text-gray-100">Tanggal :</Text>
                <View className='flex-row'>
                  <View className="w-full">
                    <TouchableOpacity onPress={() => setShowDatePicker(true)}>
                      <View className={`border-2 border-gray-200 w-full px-2 rounded-lg focus:border-secondary items-center flex-row`}>
                        <View className="flex-1 py-3">
                          <Text className="text-gray-100 font-poppinsSemiBold text-m">
                            {values.transaction_date ? (values.transaction_date).toLocaleDateString() : (new Date()).toLocaleDateString()}
                          </Text>
                        </View>
                        <Icon name="calendar-month" color="gray" size={20} testID="txt003" />
                      </View>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>

              {showDatePicker && (
                <DateTimePicker
                  value={values.transaction_date ? values.transaction_date : new Date()}
                  mode="date"
                  display="default"
                  onChange={(event, selectedDate) => {
                    setShowDatePicker(false);
                    setFieldValue('transaction_date', selectedDate);
                  }}
                />
              )}

              <FormField
                title="Nominal"
                value={values.amount}
                handleChangeText={handleChange('amount')}
                handleBlur={handleBlur('amount')}
                otherStyles="mt-3"
                testId="txt004"
                keyboardType="number-pad"
              />
              {touched.amount && errors.amount && <Text className="text-gray-50">{errors.amount}</Text>}

              <FormField
                title="Catatan"
                value={values.note}
                handleChangeText={handleChange('note')}
                handleBlur={handleBlur('note')}
                otherStyles="mt-3"
                testId="txt005"
              />
              {touched.note && errors.note && <Text className="text-gray-50">{errors.note}</Text>}

              <CustomButton
                title="Simpan"
                handlePress={handleSubmit}
                containerStyles={"mt-7 bg-secondary-200"}
                textStyles="text-white"
                isLoading={isSubmitting}
                testId="btn001"
              />
            </View>
          )}
        </Formik>

        <View className="w-full mt-10" />

      </View >

    </ScrollView >

  )
}

export default Create