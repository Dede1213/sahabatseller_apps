import { ScrollView, Text, View, Alert, StyleSheet } from 'react-native'
import React, { useEffect, useState } from 'react'
import CustomButton from '../../../components/CustomButton'
import { useGlobalContext } from '../../../context/globalProvider'
import { fetchData } from '../../../lib/fetchData'
import { API_HOST } from '@env';
import { Formik } from 'formik';
import * as Yup from 'yup';
import SelectField from '../../../components/SelectField'
import * as SecureStore from 'expo-secure-store';

const Switch = () => {
  const { user, setUser } = useGlobalContext()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [location, setLocation] = useState([]);
  const [initialValues, setInitialValues] = useState({
    location_id: '',
    location_name: '',
  });

  const validationSchema = Yup.object().shape({
    location_id: Yup.string().required('*Lokasi wajib dipilih.'),
  });

  useEffect(() => {
    const getData = async () => {
      try {
        const response = await fetchData(`${API_HOST}/location/store/list`,
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
            setLocation(formattedData);
          }
        } else {
          Alert.alert(response.message)
        }
      } catch (error) {
        Alert.alert(error.message);
      }
    };
    getData();

  }, []);
  const submitAction = async (form) => {
    try {
      setIsSubmitting(true)
      const response = await fetchData(`${API_HOST}/login/refresh`, {
        method: 'post',
        headers: {
          'X-access-token': user.token,
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        data: {
          location_id: form.location_id,
        },
      });

      if (response.code) {
        if (response.code === 200) {
          await SecureStore.deleteItemAsync('userToken');
          await SecureStore.setItemAsync('userToken', response.data.token);
          setUser(prev => ({ ...prev,token: response.data.token, location_id: response.data.location_id, location_name: response.data.location_name, is_head_office: response.data.is_head_office }));
          Alert.alert('Notifikasi', 'Lokasi toko anda berhasil diubah.')
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
      <View className="w-full justify-center px-4 bg-primary">
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
                title="Tipe Toko"
                data={location}
                value={values.location_id}
                onValueChange={(value) => setFieldValue('location_id', value)}
                handleChangeText={handleChange('location_id')}
                handleBlur={handleBlur('location_id')}
                placeholder="Pilih Lokasi"
                otherStyles="mt-3"
              />
              {touched.location_id && errors.location_id && <Text className="text-gray-50">{errors.location_id}</Text>}

              <CustomButton
                title="Simpan"
                handlePress={handleSubmit}
                containerStyles={"mt-7 bg-secondary-200"}
                textStyles={"text-white"}
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

export default Switch

const styles = StyleSheet.create({})