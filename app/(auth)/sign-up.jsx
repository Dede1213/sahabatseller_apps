import { ScrollView, Text, View, Image, Alert, TouchableOpacity } from 'react-native'
import React, { useEffect, useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { images } from '../../constants'
import FormField from '../../components/FormField'
import CustomButton from '../../components/CustomButton'
import { useGlobalContext } from '../../context/globalProvider'
import { fetchData } from '../../lib/fetchData'
import { API_HOST } from '@env';
import { Formik } from 'formik';
import * as Yup from 'yup';
import AlertModal from '../../components/AlertModal'

const SignUp = ({ navigation }) => {

  const { isLoading, isLoggedIn } = useGlobalContext()

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
    navigation.navigate('SignIn')
  };
  /* End Alert */

  useEffect(() => {
    if (!isLoading && isLoggedIn) {
      return navigation.replace('MainDrawer');
    }
  }, [isLoading, isLoggedIn, navigation]);

  const [isSubmitting, setIsSubmitting] = useState(false)
  const submitAction = async (form) => {

    setIsSubmitting(true)
    try {
      const response = await fetchData(`${API_HOST}/user/create`, {
        method: 'post',
        data: {
          fullname: form.fullname,
          email: form.email,
          phone: form.phone,
          password: form.password,
          store_name: form.store_name,
          store_address: form.store_address,
          affiliator_id: form.affiliator_id
        },
      });

      if (response.code === 200) {
        showAlert('Notifikasi', 'Akun anda berhasil dibuat.');
      }
    } catch (error) {
      Alert.alert("Warning", error.message)
    } finally {
      setIsSubmitting(false)
    }

  }

  const validationSchema = Yup.object().shape({
    password: Yup.string().min(6, '*password minimal 6 characters').required('*password wajib diisi.'),
    fullname: Yup.string().required('*fullname wajib diisi'),
    email: Yup.string().email('*email tidak valid').required('*email wajib diisi'),
    phone: Yup.string().min(10, '*nomor handphone minimal 10 angka').required('*nomor handphone wajib diisi').matches(/^[0-9]+$/, '*nomor handphone harus berupa angka'),
    password: Yup.string().min(6, '*password minimal 6 characters').required('*password wajib diisi'),
    store_name: Yup.string().required('*nama toko wajib diisi'),
    store_address: Yup.string().required('*alamat toko wajib diisi'),
  });

  return (
    <SafeAreaView className="bg-primary h-full">
      <ScrollView>
        <View className="w-full min-h-[85vh] justify-center px-4 my-5">
          <AlertModal visible={isAlertVisible} header={alertTitle} message={alertMessage} onClose={closeAlert} />

          <View className="">
            <Image source={images.logotext} className="w-[200px] h-[60px]" resizeMode='contain' />
          </View>

          <Formik
            initialValues={{
              fullname: '',
              email: '',
              phone: '',
              password: '',
              store_name: '',
              store_address: '',
              affiliator_id: ''
            }}
            validationSchema={validationSchema}
            onSubmit={(values) => {
              submitAction(values);
            }}
          >
            {({ handleChange, handleBlur, handleSubmit, values, errors, touched }) => (
              <View>

                <FormField
                  title="Nama Pemilik Toko"
                  value={values.fullname}
                  handleChangeText={handleChange('fullname')}
                  handleBlur={handleBlur('fullname')}
                  otherStyles="mt-2"
                  testId="txt001"
                />
                {touched.fullname && errors.fullname && <Text className="text-gray-50" testID='txt002'>{errors.fullname}</Text>}

                <FormField
                  title="Nomor Telepon"
                  value={values.phone}
                  handleChangeText={handleChange('phone')}
                  handleBlur={handleBlur('phone')}
                  otherStyles="mt-3"
                  keyboardType="number-pad"
                  testId="txt003"
                />
                {touched.phone && errors.phone && <Text className="text-gray-50" testID='txt004'>{errors.phone}</Text>}

                <FormField
                  title="Email"
                  value={values.email}
                  handleChangeText={handleChange('email')}
                  handleBlur={handleBlur('email')}
                  otherStyles="mt-3"
                  testId="txt005"
                />
                {touched.email && errors.email && <Text className="text-gray-50" testID='txt006'>{errors.email}</Text>}

                <FormField
                  title="Password"
                  value={values.password}
                  handleChangeText={handleChange('password')}
                  handleBlur={handleBlur('password')}
                  otherStyles="mt-3"
                  testId="txt007"
                />
                {touched.password && errors.password && <Text className="text-gray-50" testID='txt008'>{errors.password}</Text>}


                <FormField
                  title="Nama Toko"
                  value={values.store_name}
                  handleChangeText={handleChange('store_name')}
                  handleBlur={handleBlur('store_name')}
                  otherStyles="mt-3"
                  testId="txt009"
                />
                {touched.store_name && errors.store_name && <Text className="text-gray-50" testID='txt010'>{errors.store_name}</Text>}

                <FormField
                  title="Alamat Toko"
                  value={values.store_address}
                  handleChangeText={handleChange('store_address')}
                  handleBlur={handleBlur('store_address')}
                  otherStyles="mt-3"
                  testId="txt011"
                />
                {touched.store_address && errors.store_address && <Text className="text-gray-50" testID='txt012'>{errors.store_address}</Text>}

                <FormField
                  info={'Affiliator adalah partner sahabatseller yang siap menjawab semua pertanyaan anda terkait aplikasi, selain customer service.'}
                  title="Kode Affiliator"
                  placeholder="Jika Ada"
                  value={values.affiliator_id}
                  handleChangeText={handleChange('affiliator_id')}
                  handleBlur={handleBlur('affiliator_id')}
                  otherStyles="mt-3"
                  testId="txt013"
                />
                {touched.affiliator_id && errors.affiliator_id && <Text className="text-gray-50" testID='txt014'>{errors.affiliator_id}</Text>}

                <CustomButton
                  title="Daftar"
                  handlePress={handleSubmit}
                  containerStyles={"mt-7 bg-secondary-200"}
                  textStyles="text-white"
                  isLoading={isSubmitting}
                  testId="btn001"
                />
              </View>
            )}
          </Formik>

          <View className="flex-row justify-center pt-5 gap-2">
            <Text className="text-lg font-PoppinsRegular text-gray-100">sudah punya akun? </Text>
            <TouchableOpacity onPress={() => navigation.navigate('SignIn')}>
              <Text className="text-secondary-200 font-PoppinsSemiBold text-lg" testID="btn002">Masuk</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

export default SignUp