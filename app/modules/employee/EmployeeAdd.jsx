import { ScrollView, Text, View, Alert, RefreshControl } from 'react-native'
import React, { useEffect, useState } from 'react'
import FormField from '../../../components/FormField'
import CustomButton from '../../../components/CustomButton'
import { useGlobalContext } from '../../../context/globalProvider'
import { fetchData } from '../../../lib/fetchData'
import { API_HOST } from '@env';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { useNavigation } from '@react-navigation/native'
import SelectField from '../../../components/SelectField'

const validationSchema = Yup.object().shape({
  name: Yup.string().required('*nama toko wajib diisi'),
  email: Yup.string().email('*email tidak valid').required('*email wajib diisi'),
  phone: Yup.string().min(10, '*nomor handphone minimal 10 angka').required('*nomor telepon toko wajib diisi'),
  password: Yup.string().min(6, '*password minimal 6 characters').required('*password wajib diisi.'),
  location: Yup.string().required('*lokasi toko wajib diisi'),
  role: Yup.string().required('*role toko wajib diisi'),
});

const EmployeeAdd = () => { 
  const navigation = useNavigation()
  const { user } = useGlobalContext()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [refreshing, setRefreshing] = useState(false);
  const [refetchTrigger, setRefetchTrigger] = useState(0);
  const [dataLocation, setDataLocation] = useState([])
  const [dataRole, setDataRole] = useState([])

  const [initialValues] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    location: '',
    role: ''
  });

  const onRefresh = () => {
    setRefreshing(true);
    setRefetchTrigger(prev => prev + 1);
    setRefreshing(false);
  }

  useEffect(() => {
    const getDataLocation = async () => {
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
            setDataLocation(formattedData);
          }
        } else {
          Alert.alert(response.message)
        }
      } catch (error) {
        Alert.alert(error.message);
      }
    }

    getDataLocation();

    const getDataRole = async () => {
      try {
        const response = await fetchData(`${API_HOST}/roles/store/list`,
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
              label: item.title,
              value: item.id,
            }));
            setDataRole(formattedData);
          }
        } else {
          Alert.alert(response.message)
        }
      } catch (error) {
        Alert.alert(error.message);
      }
    }

    getDataRole();

  }, [refetchTrigger]);

  const submitAction = async (form) => {
    try {
      setIsSubmitting(true)
      const response = await fetchData(`${API_HOST}/user/employee/create`, {
        method: 'post',
        headers: {
          'X-access-token': user.token,
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        data: {
          fullname: form.name,
          email: form.email,
          phone: form.phone,
          password: form.password,
          location_id: form.location,
          role_id: form.role
        },
      });

      if (response.code) {
        if (response.code === 200) {
          Alert.alert('Notifikasi', 'Pegawai anda berhasil ditambah.')
          navigation.navigate('Employee', { screen: 'EmployeeViewStack' })
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

              <FormField
                title="Nama"
                value={values.name}
                handleChangeText={handleChange('name')}
                handleBlur={handleBlur('name')}
                otherStyles="mt-0"
                testId="txt001"
              />
              {touched.name && errors.name && <Text className="text-gray-50">{errors.name}</Text>}

              <FormField
                title="Email"
                value={values.email}
                handleChangeText={handleChange('email')}
                handleBlur={handleBlur('email')}
                otherStyles="mt-2"
                testId="txt002"
              />
              {touched.email && errors.email && <Text className="text-gray-50">{errors.email}</Text>}

              <FormField
                title="No. Telp"
                value={values.phone}
                handleChangeText={handleChange('phone')}
                handleBlur={handleBlur('phone')}
                otherStyles="mt-2"
                testId="txt003"
              />
              {touched.phone && errors.phone && <Text className="text-gray-50">{errors.phone}</Text>}

              <FormField
                title="Password"
                value={values.password}
                handleChangeText={handleChange('password')}
                handleBlur={handleBlur('password')}
                otherStyles="mt-2"
                testId="txt004"
              />
              {touched.password && errors.password && <Text className="text-gray-50">{errors.password}</Text>}


              <SelectField
                title="Hak Akses"
                data={dataRole}
                value={values.role}
                onValueChange={(value) => setFieldValue('role', value)}
                handleChangeText={handleChange('role')}
                handleBlur={handleBlur('role')}
                placeholder="Pilih Hak Akses"
                otherStyles="mt-3"
                dropdownPosition="top"
                testId="txt005"
              />
              {touched.role && errors.role && <Text className="text-gray-50">{errors.role}</Text>}

              <SelectField
                title="Lokasi Toko"
                data={dataLocation}
                value={values.location}
                onValueChange={(value) => setFieldValue('location', value)}
                handleChangeText={handleChange('location')}
                handleBlur={handleBlur('location')}
                placeholder="Pilih Lokasi"
                otherStyles="mt-3"
                dropdownPosition="top"
                testId="txt006"
              />
              {touched.location && errors.location && <Text className="text-gray-50">{errors.location}</Text>}

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

export default EmployeeAdd