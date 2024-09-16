import { ScrollView, Text, View, Alert } from 'react-native'
import React, { useEffect, useState } from 'react'
import FormField from '../../../../components/FormField'
import CustomButton from '../../../../components/CustomButton'
import { useGlobalContext } from '../../../../context/globalProvider'
import { fetchData } from '../../../../lib/fetchData'
import { API_HOST } from '@env';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { useNavigation } from '@react-navigation/native'
import AlertModal from '../../../../components/AlertModal'
import SelectField from '../../../../components/SelectField'
import DateTimePicker from '@react-native-community/datetimepicker';
import { TouchableOpacity } from 'react-native'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { FormatDateForQuery, FormatDateLocal, FormatTimeForQuery } from '../../../../lib/globalFunction'
import { useRoute } from '@react-navigation/native';
import AlertConfirmModal from '../../../../components/AlertConfirmModal'

const validationSchema = Yup.object().shape({
  name: Yup.string().required('*nama toko wajib diisi'),
  discount: Yup.string().required('*diskon wajib diisi').matches(/^[0-9]+$/, '*diskon harus berupa angka'),
  discount_type: Yup.string().required('*tipe diskon wajib diisi'),
  start_date: Yup.string().required('*tanggal mulai wajib diisi'),
  start_time: Yup.string().required('*waktu mulai wajib diisi'),
  end_date: Yup.string().required('*tanggal akhir wajib diisi'),
  end_time: Yup.string().required('*waktu akhir wajib diisi'),
  minimum_amount: Yup.string().required('*minimal pembelian wajib diisi').matches(/^[0-9]+$/, '*minimal pembelian harus berupa angka'),
  maximum_amount: Yup.string().required('*maksimal diskon wajib diisi').matches(/^[0-9]+$/, '*maksimal diskon harus berupa angka'),
  is_active: Yup.string().required('*status wajib diisi'),
});

const Edit = () => {
  const navigation = useNavigation()
  const route = useRoute();
  const { id } = route.params;
  const { user, setRefreshTrigger } = useGlobalContext()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [showEndDatePicker, setShowEndDatePicker] = useState(false);
  const [showEndTimePicker, setShowEndTimePicker] = useState(false);
  const [initialValues, setInitialValues] = useState({
    name: '',
    discount: '',
    discount_type: '',
    start_date: null,
    start_time: null,
    end_date: null,
    end_time: null,
    minimum_amount: '',
    maximum_amount: '',
    is_active: '',
  });

  const dataType = [
    { label: 'Nominal', value: 'NOMINAL' },
    { label: 'Persen', value: 'PERSEN' },
  ];

  const dataStatus = [
    { label: 'Aktif', value: 'YA' },
    { label: 'Tidak Aktif', value: 'TIDAK' },
  ];

  /* Alert Confirm */
  const [isAlertConfirmVisible, setIsAlertConfirmVisible] = useState(false);
  const [alertConfirmMessage, setAlertConfirmMessage] = useState('');
  const [alertConfirmTitle, setAlertConfirmTitle] = useState('');
  const showAlertConfirm = (title, message) => {
    setAlertConfirmTitle(title);
    setAlertConfirmMessage(message);
    setIsAlertConfirmVisible(true);
  };
  const closeAlertConfirm = () => {
    setIsAlertConfirmVisible(false);
  };

  const acceptAlertConfirm = () => {
    setIsAlertConfirmVisible(false);
    handleDelete();
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
      screen: 'DiscountStack',
    });
  };
  /* End Alert */

  const submitAction = async (form) => {
    let startDate = FormatDateForQuery(form.start_date) + ' ' + FormatTimeForQuery(form.start_time);
    let endDate = FormatDateForQuery(form.end_date) + ' ' + FormatTimeForQuery(form.end_time);

    try {
      setIsSubmitting(true)
      const response = await fetchData(`${API_HOST}/discount/update`, {
        method: 'put',
        headers: {
          'X-access-token': user.token,
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        data: {
          id: id,
          name: form.name,
          discount: parseInt(form.discount),
          discount_type: form.discount_type,
          start_date: startDate,
          end_date: endDate,
          minimum_amount: parseInt(form.minimum_amount),
          maximum_amount: parseInt(form.maximum_amount),
          is_active: form.is_active,
        },
      });

      if (response.code) {
        if (response.code === 200) {
          showAlert('Notifikasi', 'Diskon berhasil diubah.');
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

  useEffect(() => {
    const getData = async (id) => {
      try {
        const response = await fetchData(`${API_HOST}/discount/${id}`,
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
            setInitialValues({
              name: response.data.name || '',
              discount: (response.data.discount).toString() || '',
              discount_type: response.data.discount_type || '',
              start_date: response.data.start_date ? new Date(response.data.start_date) : new Date(),
              start_time: response.data.start_date ? new Date(response.data.start_date) : new Date(),
              end_date: response.data.end_date ? new Date(response.data.end_date) : new Date(),
              end_time: response.data.end_date ? new Date(response.data.end_date) : new Date(),
              minimum_amount: (response.data.minimum_amount).toString() || '',
              maximum_amount: (response.data.maximum_amount).toString() || '',
              is_active: response.data.is_active || '',
            });
          }
        } else {
          Alert.alert(response.message)
        }
      } catch (error) {
        Alert.alert(error.message);
      }
    };
    getData(id);

  }, [id]);

  const handleDelete = async () => {
    try {
      setIsSubmitting(true)
      const response = await fetchData(`${API_HOST}/discount/delete/${id}`, {
        method: 'delete',
        headers: {
          'X-access-token': user.token,
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
      });

      if (response.code) {
        if (response.code === 200) {
          showAlert('Notifikasi', 'Diskon berhasil dihapus.');
        }
      } else {
        Alert.alert(response.message)
      }
    } catch (error) {
      Alert.alert(error.message)
    } finally {
      setIsSubmitting(false)
    }
  };

  return (
    <ScrollView className="bg-primary">
      <View className="w-full justify-center px-4 bg-primary mt-5">
        <AlertConfirmModal visible={isAlertConfirmVisible} header={alertConfirmTitle} message={alertConfirmMessage} onClose={closeAlertConfirm} onAccept={acceptAlertConfirm} />
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
              <FormField
                title="Nama Diskon"
                value={values.name}
                handleChangeText={handleChange('name')}
                handleBlur={handleBlur('name')}
                otherStyles="mt-0"
                testId="txt001"
              />
              {touched.name && errors.name && <Text className="text-gray-50">{errors.name}</Text>}

              <SelectField
                title="Tipe Diskon"
                data={dataType}
                value={values.discount_type}
                onValueChange={(value) => setFieldValue('discount_type', value)}
                handleChangeText={handleChange('discount_type')}
                handleBlur={handleBlur('discount_type')}
                placeholder="Pilih Tipe Diskon"
                otherStyles="mt-2"
                dropdownPosition="bottom"
                testId="txt002"
              />
              {touched.discount_type && errors.discount_type && <Text className="text-gray-50">{errors.discount_type}</Text>}

              <FormField
                title="Diskon"
                value={values.discount}
                handleChangeText={handleChange('discount')}
                handleBlur={handleBlur('discount')}
                otherStyles="mt-2"
                testId="txt003"
                keyboardType="number-pad"
              />
              {touched.discount && errors.discount && <Text className="text-gray-50">{errors.discount}</Text>}

              <FormField
                title="Minimal Pembelian"
                value={values.minimum_amount}
                handleChangeText={handleChange('minimum_amount')}
                handleBlur={handleBlur('minimum_amount')}
                otherStyles="mt-2"
                testId="txt004"
                keyboardType="number-pad"
              />
              {touched.minimum_amount && errors.minimum_amount && <Text className="text-gray-50">{errors.minimum_amount}</Text>}

              <FormField
                title="Maksimal Diskon"
                value={values.maximum_amount}
                handleChangeText={handleChange('maximum_amount')}
                handleBlur={handleBlur('maximum_amount')}
                otherStyles="mt-2"
                testId="txt005"
                keyboardType="number-pad"
              />
              {touched.maximum_amount && errors.maximum_amount && <Text className="text-gray-50">{errors.maximum_amount}</Text>}

              <SelectField
                title="Status"
                data={dataStatus}
                value={values.is_active}
                onValueChange={(value) => setFieldValue('is_active', value)}
                handleChangeText={handleChange('is_active')}
                handleBlur={handleBlur('is_active')}
                placeholder="Pilih Status"
                otherStyles="mt-2"
                dropdownPosition="bottom"
                testId="txt006"
              />
              {touched.is_active && errors.is_active && <Text className="text-gray-50">{errors.is_active}</Text>}

              <View className="flex-row">
                <View className={`space-y-2 mt-3 w-[48%]`}>
                  <Text className="text-base font-PoppinsMedium text-gray-100">Tanggal Mulai :</Text>
                  <View className='flex-row'>
                    <View className="w-full">
                      <TouchableOpacity onPress={() => setShowDatePicker(true)}>
                        <View className={`border-2 border-gray-200 w-full px-2 rounded-lg focus:border-secondary items-center flex-row`}>
                          <View className="flex-1 py-3">
                            <Text className="text-gray-100 font-poppinsSemiBold text-m">
                              {values.start_date ? (values.start_date).toLocaleDateString() : (new Date()).toLocaleDateString()}
                            </Text>
                          </View>
                          <Icon name="calendar-month" color="gray" size={20} testID="txt007" />
                        </View>
                      </TouchableOpacity>
                    </View>
                  </View>
                  {touched.start_date && errors.start_date && <Text className="text-gray-50">{errors.start_date}</Text>}
                </View>

                <View className={`space-y-2 ml-4 mt-3 w-[48%]`}>
                  <Text className="text-base font-PoppinsMedium text-gray-100">Waktu Mulai :</Text>
                  <View className='flex-row'>
                    <View className="w-full">
                      <TouchableOpacity onPress={() => setShowTimePicker(true)}>
                        <View className={`border-2 border-gray-200 w-full px-2 rounded-lg focus:border-secondary items-center flex-row`}>
                          <View className="flex-1 py-3">
                            <Text className="text-gray-100 font-poppinsSemiBold text-m">
                              {values.start_date ? (values.start_date).toLocaleTimeString() : (new Date()).toLocaleTimeString()}
                            </Text>
                          </View>
                          <Icon name="clock-outline" color="gray" size={20} testID="txt008" />
                        </View>
                      </TouchableOpacity>
                    </View>
                  </View>
                  {touched.start_time && errors.start_time && <Text className="text-gray-50">{errors.start_time}</Text>}
                </View>

                {showDatePicker && (
                  <DateTimePicker
                    value={values.start_date ? values.start_date : new Date()}
                    mode="date"
                    display="default"
                    onChange={(event, selectedDate) => {
                      setShowDatePicker(false);
                      setFieldValue('start_date', selectedDate);
                    }}
                  />
                )}
                {showTimePicker && (
                  <DateTimePicker
                    value={values.start_time ? values.start_time : new Date()}
                    mode="time"
                    display="default"
                    onChange={(event, selectedDate) => {
                      setShowTimePicker(false);
                      setFieldValue('start_time', selectedDate);
                    }}
                  />
                )}
              </View>

              <View className="flex-row">
                <View className={`space-y-2 mt-3 w-[48%]`}>
                  <Text className="text-base font-PoppinsMedium text-gray-100">Tanggal Selesai :</Text>
                  <View className='flex-row'>
                    <View className="w-full">
                      <TouchableOpacity onPress={() => setShowEndDatePicker(true)}>
                        <View className={`border-2 border-gray-200 w-full px-2 rounded-lg focus:border-secondary items-center flex-row`}>
                          <View className="flex-1 py-3">
                            <Text className="text-gray-100 font-poppinsSemiBold text-m">
                              {values.end_date ? (values.end_date).toLocaleDateString() : (new Date()).toLocaleDateString()}
                            </Text>
                          </View>
                          <Icon name="calendar-month" color="gray" size={20} testID="txt009" />
                        </View>
                      </TouchableOpacity>
                    </View>
                  </View>
                  {touched.end_date && errors.end_date && <Text className="text-gray-50">{errors.end_date}</Text>}
                </View>

                <View className={`space-y-2 ml-4 mt-3 w-[48%]`}>
                  <Text className="text-base font-PoppinsMedium text-gray-100">Waktu Selesai :</Text>
                  <View className='flex-row'>
                    <View className="w-full">
                      <TouchableOpacity onPress={() => setShowEndTimePicker(true)}>
                        <View className={`border-2 border-gray-200 w-full px-2 rounded-lg focus:border-secondary items-center flex-row`}>
                          <View className="flex-1 py-3">
                            <Text className="text-gray-100 font-poppinsSemiBold text-m">
                              {values.end_time ? (values.end_time).toLocaleTimeString() : (new Date()).toLocaleTimeString()}
                            </Text>
                          </View>
                          <Icon name="clock-outline" color="gray" size={20} testID="txt010" />
                        </View>
                      </TouchableOpacity>
                    </View>
                  </View>
                  {touched.end_time && errors.end_time && <Text className="text-gray-50">{errors.end_time}</Text>}
                </View>

                {showEndDatePicker && (
                  <DateTimePicker
                    value={values.end_date ? values.end_date : new Date()}
                    mode="date"
                    display="default"
                    onChange={(event, selectedDate) => {
                      setShowEndDatePicker(false);
                      setFieldValue('end_date', selectedDate);
                    }}
                  />
                )}
                {showEndTimePicker && (
                  <DateTimePicker
                    value={values.end_time ? values.end_time : new Date()}
                    mode="time"
                    display="default"
                    onChange={(event, selectedDate) => {
                      setShowEndTimePicker(false);
                      setFieldValue('end_time', selectedDate);
                    }}
                  />
                )}
              </View>



              <CustomButton
                title="Simpan"
                handlePress={handleSubmit}
                containerStyles={"mt-7 bg-secondary-200"}
                textStyles="text-white"
                isLoading={isSubmitting}
                testId="btn001"
              />
              <CustomButton
                title="Hapus Diskon"
                handlePress={() => showAlertConfirm('Konfirmasi', 'Apakah Anda yakin ingin menghapus diskon ini?')}
                containerStyles={"mt-2"}
                isLoading={isSubmitting}
                textStyles={"color-red-500 underline"}
                testId="btn002"
              />
            </View>
          )}
        </Formik>

        <View className="w-full mt-10" />

      </View >
    </ScrollView >
  )
}

export default Edit