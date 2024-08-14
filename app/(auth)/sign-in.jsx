import { ScrollView, TouchableOpacity, Text, View, Image, Alert } from 'react-native'
import React, { useEffect, useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import FormField from '../../components/FormField'
import CustomButton from '../../components/CustomButton'
import { useGlobalContext } from '../../context/globalProvider'
import { fetchData } from '../../lib/fetchData'
import * as SecureStore from 'expo-secure-store';
import { API_HOST } from '@env';

import { Formik } from 'formik';
import * as Yup from 'yup';



const SignIn = ({ navigation }) => {

  const { isLoading, setUser, isLoggedIn, setIsLoggedIn } = useGlobalContext();

  useEffect(() => {
    if (!isLoading && isLoggedIn) {
      return navigation.replace('MainDrawer');
    }
  }, [isLoading, isLoggedIn, navigation]);

  const [isSubmitting, setIsSubmitting] = useState(false)

  const submitAction = async (form) => {
    setIsSubmitting(true)
    try {
      const response = await fetchData(`${API_HOST}/login`, {
        method: 'post',
        data: { username: form.username, password: form.password },
      });

      if (response.code) {
        if (response.code === 200) {
          await SecureStore.setItemAsync('userToken', response.data.token);
          await SecureStore.setItemAsync('userId', response.data.id);
          setUser(response.data)
          setIsLoggedIn(true)
          navigation.replace('MainDrawer')
        }
      } else {
        Alert.alert(response.message)
      }
    } catch (error) {
      Alert.alert("Warning", error.message)
    } finally {
      setIsSubmitting(false)
    }
  }

  const validationSchema = Yup.object().shape({
    username: Yup.string().required('*username wajib diisi'),
    password: Yup.string().min(6, '*password minimal 6 characters').required('*password wajib diisi.'),
  });

  return (
    <SafeAreaView className="bg-primary h-full">
      <ScrollView>
        <View className="w-full min-h-[85vh] px-4 my-6 justify-center">
          <View className="relative items-center">
            <Image source={require('../../assets/images/logotext.png')} className="w-[300px] h-[100px]" resizeMode='contain' />
          </View>

          <Formik
            initialValues={{ username: '', password: '' }}
            validationSchema={validationSchema}
            onSubmit={(values) => {
              submitAction(values);
            }}
          >
            {({ handleChange, handleBlur, handleSubmit, values, errors, touched }) => (
              <View>
                <FormField
                  title="Username"
                  placeholder="Masukkan Email atau No Handphone"
                  value={values.username}
                  handleChangeText={handleChange('username')}
                  handleBlur={handleBlur('username')}
                  otherStyles="mt-7"
                />
                {touched.username && errors.username && <Text className="text-gray-50">{errors.username}</Text>}

                <FormField
                  title="Password"
                  placeholder="Masukkan Password"
                  value={values.password}
                  handleChangeText={handleChange('password')}
                  handleBlur={handleBlur('password')}
                  otherStyles="mt-7"
                />
                {touched.password && errors.password && <Text className="text-gray-50">{errors.password}</Text>}

                <CustomButton
                  title="Masuk"
                  handlePress={handleSubmit}
                  containerStyles={"mt-7 bg-secondary-200 "}
                  textStyles="text-white"
                  isLoading={isSubmitting}
                />
              </View>
            )}
          </Formik>

          <View className="flex-row justify-center pt-5 gap-2">
            <Text className="text-lg font-PoppinsRegular text-gray-100">Belum punya akun ? </Text>
            <TouchableOpacity onPress={() => navigation.navigate('SignUp')}>
              <Text className="text-secondary-200 font-PoppinsSemiBold text-lg">Daftar</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => navigation.navigate('PrintExample')}>
              <Text className="text-secondary-200 font-PoppinsSemiBold text-lg"> | Print</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

export default SignIn