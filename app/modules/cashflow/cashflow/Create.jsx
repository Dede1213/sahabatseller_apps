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

const validationSchema = Yup.object().shape({
  category: Yup.string().required('*kategori toko wajib diisi'),
  type: Yup.string().required('*tipe wajib diisi'),
  amount: Yup.string().matches(/^[0-9]+$/, '*nominal harus berupa angka').required('*nominal wajib diisi'),
});

const Create = () => {
  const navigation = useNavigation()
  const { user } = useGlobalContext()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [refreshing, setRefreshing] = useState(false);
  const [refetchTrigger, setRefetchTrigger] = useState(0);
  const [dataCategory, setDataCategory] = useState([])

  const [initialValues] = useState({
    category: '',
    type: '',
    amount: '',
    note: '',
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
        },
      });

      if (response.code) {
        if (response.code === 200) {
          Alert.alert('Notifikasi', 'Cash flow berhasil ditambah.')
          navigation.navigate('CashFlow', { screen: 'CashFlowViewStack' })
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

              <FormField
                title="Nominal"
                value={values.amount}
                handleChangeText={handleChange('amount')}
                handleBlur={handleBlur('amount')}
                otherStyles="mt-3"
                testId="txt003"
                keyboardType="numeric"
              />
              {touched.amount && errors.amount && <Text className="text-gray-50">{errors.amount}</Text>}

              <FormField
                title="Catatan"
                value={values.note}
                handleChangeText={handleChange('note')}
                handleBlur={handleBlur('note')}
                otherStyles="mt-3"
                testId="txt004"
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