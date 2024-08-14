import { ScrollView, Text, View, Alert } from 'react-native'
import React, { useEffect, useState } from 'react'
import FormField from '../../../components/FormField'
import CustomButton from '../../../components/CustomButton'
import { useGlobalContext } from '../../../context/globalProvider'
import { fetchData } from '../../../lib/fetchData'
import { API_HOST } from '@env';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { useNavigation } from '@react-navigation/native'

const validationSchema = Yup.object().shape({
  name: Yup.string().required('*nama toko wajib diisi'),
  address: Yup.string().required('*alamat toko wajib diisi'),
  phone: Yup.string().required('*nomor telepon toko wajib diisi'),
});

const Create = () => {
  const navigation = useNavigation()
  const { user } = useGlobalContext()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [initialValues] = useState({
    name: '',
    address: '',
    phone: '',
  });

  const submitAction = async (form) => {
    try {
      setIsSubmitting(true)
      const response = await fetchData(`${API_HOST}/location/create`, {
        method: 'post',
        headers: {
          'X-access-token': user.token,
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        data: {
          name: form.name,
          address: form.address,
          phone: form.phone,
        },
      });

      if (response.code) {
        if (response.code === 200) {
          Alert.alert('Notifikasi', 'Lokasi toko anda berhasil ditambah.')
          navigation.navigate('LocationStore')
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

  return (
    <ScrollView className="bg-primary">
      <View className="w-full justify-center px-4 bg-primary mt-5">
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

              <FormField
                title="Nama"
                value={values.name}
                handleChangeText={handleChange('name')}
                handleBlur={handleBlur('name')}
                otherStyles="mt-0"
              />
              {touched.name && errors.name && <Text className="text-gray-50">{errors.name}</Text>}

              <FormField
                title="Alamat"
                value={values.address}
                handleChangeText={handleChange('address')}
                handleBlur={handleBlur('address')}
                otherStyles="mt-2"
              />
              {touched.address && errors.address && <Text className="text-gray-50">{errors.address}</Text>}

              <FormField
                title="No. Telp"
                value={values.phone}
                handleChangeText={handleChange('phone')}
                handleBlur={handleBlur('phone')}
                otherStyles="mt-2"
              />
              {touched.phone && errors.phone && <Text className="text-gray-50">{errors.phone}</Text>}

              <CustomButton
                title="Simpan"
                handlePress={handleSubmit}
                containerStyles={"mt-7 bg-secondary-200"}
                textStyles="text-white"
                isLoading={isSubmitting}
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