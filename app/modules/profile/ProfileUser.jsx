import { ScrollView, Text, View, Image, Alert, TouchableOpacity } from 'react-native'
import React, { useEffect, useState } from 'react'
import { icons } from '../../../constants'
import FormField from '../../../components/FormField'
import CustomButton from '../../../components/CustomButton'
import { useGlobalContext } from '../../../context/globalProvider'
import { fetchData } from '../../../lib/fetchData'
import { API_HOST } from '@env';
import { Formik } from 'formik';
import * as Yup from 'yup';
import * as DocumentPicker from "expo-document-picker";
import { Button } from 'react-native-elements'
import * as SecureStore from 'expo-secure-store';

const validationSchema = Yup.object().shape({
  fullname: Yup.string().required('*fullname wajib diisi'),
  email: Yup.string().email('*email tidak valid').required('*email wajib diisi'),
  phone: Yup.string().min(10, '*nomor handphone minimal 10 angka').required('*nomor handphone wajib diisi'),
});

const validationSchemaPassword = Yup.object().shape({
  password: Yup.string().min(6, '*password baru minimal 6 characters').required('*password baru wajib diisi.'),
  confirm_password: Yup.string().min(6, '*konfirmasi password minimal 6 characters').required('*konfirmasi password wajib diisi'),
});


const ProfileUser = () => {

  const { user, setUser } = useGlobalContext()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmittingPassword, setIsSubmittingPassword] = useState(false)
  const [uploading, setUploading] = useState(false);
  const [refetchTrigger, setRefetchTrigger] = useState(0);

  const [initialValues, setInitialValues] = useState({
    fullname: '',
    email: '',
    phone: '',
    affiliator_code: '',
  });

  const [initialValuesPhoto, setInitialValuesPhoto] = useState({
    photo: ''
  });

  const [initialValuesPassword, setInitialValuesPassword] = useState({
    password: '',
    confirm_password: '',
  });

  const [affiliatorValue, setAffiliatorValue] = useState({
    affiliator_name : '',
    affiliator_phone : '',
  })

  let info = '';
  if (affiliatorValue.affiliator_name) {
    info = `Affiliator anda : ${affiliatorValue.affiliator_name} - ${affiliatorValue.affiliator_phone}`;
  } else {
    info = "Data affiliator tidak ditemukan, pastikan kode affiliator anda benar.";
  }

  useEffect(() => {
    const getData = async () => {
      try {
        const response = await fetchData(`${API_HOST}/user/${user.id}`,
          {
            headers: {
              'X-access-token': user.token,
              'Content-Type': 'application/json',
              'Accept': 'application/json',
            },
            method: 'get',
          });
        if (response.code === 200) {
          setInitialValues({
            code: response.data.code || '',
            fullname: response.data.fullname || '',
            email: response.data.email || '',
            phone: response.data.phone || '',
            affiliator_code: response.data.affiliator_code || '',
          });

          setAffiliatorValue({
            affiliator_name : response.data.affiliator_name || '',
            affiliator_phone : response.data.affiliator_phone || '',
          })

          setInitialValuesPhoto({
            photo: response.data.photo || '',
          });
        }
      } catch (error) {
        Alert.alert(error.message);
      }
    };

    getData()
  }, [refetchTrigger]);



  const submitAction = async (form) => {
    try {
      setIsSubmitting(true)
      const response = await fetchData(`${API_HOST}/user/update`, {
        method: 'put',
        headers: {
          'X-access-token': user.token,
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        data: {
          id: user.id,
          fullname: form.fullname,
          email: form.email,
          phone: form.phone,
          affiliator_code: form.affiliator_code
        },
      });

      if (response.code) {
        if (response.code === 200) {
          setRefetchTrigger(prev => prev + 1);
          Alert.alert('Notifikasi', 'akun anda berhasil diubah.')
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


  const submitActionPassword = async (form) => {
    setIsSubmittingPassword(true)
    if (form.password !== form.confirm_password) {
      Alert.alert('Ubah Password Gagal', 'password baru dan konfirmasi password tidak sama.')
      setIsSubmittingPassword(false)
      return
    }

    try {
      const response = await fetchData(`${API_HOST}/user/update/password`, {
        method: 'put',
        headers: {
          'X-access-token': user.token,
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        data: {
          id: user.id,
          password: form.password,
        },
      });

      if (response.code) {
        if (response.code === 200) {
          Alert.alert('Notifikasi', 'password anda berhasil diubah.')
        }
      } else {
        Alert.alert(response.message)
      }
    } catch (error) {
      Alert.alert(error.message)
    } finally {
      setIsSubmittingPassword(false)
    }
  }

  const MAX_SIZE = 2 * 1024 * 1024; // Maximum file size in bytes (5MB)
  const openPicker = async (selectType) => {
    const result = await DocumentPicker.getDocumentAsync({
      type: ["image/png", "image/jpeg"], // Only allow PNG and JPEG images
    });

    if (!result.canceled) {
      if (result.assets[0].size > MAX_SIZE) {
        Alert.alert("Warning!", "File terlalu besar. Maksimal 2 MB.");
        return;
      } else {
        if (selectType === "image") {
          setInitialValuesPhoto({
            ...initialValuesPhoto,
            photo: result.assets[0],
          });
        }
      }
    } else {
      // setTimeout(() => {
      //   Alert.alert("Document picked", JSON.stringify(result, null, 2));
      // }, 100);
    }
  };

  const submitActionImages = async () => {
    if (
      !initialValuesPhoto.photo.uri
    ) {
      return Alert.alert("Warning!", "Gambar tidak boleh kosong.");
    }

    setUploading(true);

    const storedTokenUser = await SecureStore.getItemAsync('userToken');

    const formData = new FormData();
    formData.append('photo', {
      uri: initialValuesPhoto.photo.uri,
      name: initialValuesPhoto.photo.name,
      type: initialValuesPhoto.photo.mimeType || 'application/octet-stream', // Default to a binary type
    });
    formData.append('user_id', user.id);

    try {
      const response = await fetchData(`${API_HOST}/user/photo/`, {
        headers: {
          'X-access-token': storedTokenUser,
          'Content-Type': 'multipart/form-data',
        },
        method: 'put',
        data: formData
      });
      setUser(prev => ({ ...prev, photo: response.data.photo }));

      Alert.alert("Notifikasi", response.message);
    } catch (error) {
      Alert.alert("Notifikasi", error.message)
    } finally {
      setUploading(false);
    }
  };

  return (
    <ScrollView className="bg-primary">
      <View className="w-full justify-center px-4 bg-primary mt-5">
        <Formik
          initialValues={initialValuesPhoto}
          onSubmit={() => {
            submitActionImages()
          }}
          enableReinitialize
        >
          {({ handleSubmit }) => (
            <View>
              {!initialValuesPhoto.photo.uri &&
                <Image
                  source={{ uri: `${API_HOST}/profile/images/${initialValuesPhoto.photo}` }}
                  resizeMode="cover"
                  className="w-[150px] h-[150px] rounded-2xl mb-4"
                />
              }

              {initialValuesPhoto.photo.uri && <Image source={{ uri: initialValuesPhoto.photo.uri }} className="w-[150px] h-[150px] rounded-2xl mb-4" resizeMode='cover' />}

              <TouchableOpacity onPress={() => openPicker("image")}>
                <View className="w-[150px] h-[40px] mb-3 px-4 bg-primary  border-2 border-gray-200 flex justify-center items-center flex-row space-x-2">
                  <Image
                    source={icons.upload}
                    resizeMode="contain"
                    alt="upload"
                    className="w-5 h-5"
                  />
                  <Text className="text-sm text-gray-100 font-poppinsMedium" testID="btn001">
                    Pilih Gambar
                  </Text>
                </View>
              </TouchableOpacity>
              <View className="w-[150px] bg-primary rounded-2xl ">
                <Button title={uploading ? "Uploading..." : "Upload"} onPress={handleSubmit} isLoading={uploading} testID="btn002"/>
              </View>
            </View>
          )}
        </Formik>

        <View className="w-full h-0.5 mt-5 bg-gray-200 mb-5" />

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
                title="Kode Pemilik Toko"
                value={values.code}
                handleChangeText={handleChange('code')}
                handleBlur={handleBlur('code')}
                otherStyles="mt-0"
                otherTextInputStyles="bg-gray-200"
                editable={false}
                testId="txt001"
              />

              <FormField
                title="Nama Pemilik Toko"
                value={values.fullname}
                handleChangeText={handleChange('fullname')}
                handleBlur={handleBlur('fullname')}
                otherStyles="mt-3"
                testId="txt002"
              />
              {touched.fullname && errors.fullname && <Text className="text-gray-50">{errors.fullname}</Text>}

              <FormField
                title="Nomor Telepon"
                value={values.phone}
                handleChangeText={handleChange('phone')}
                handleBlur={handleBlur('phone')}
                otherStyles="mt-3"
                keyboardType="number-pad"
                testId="txt003"
              />
              {touched.phone && errors.phone && <Text className="text-gray-50">{errors.phone}</Text>}

              <FormField
                title="Email"
                value={values.email}
                handleChangeText={handleChange('email')}
                handleBlur={handleBlur('email')}
                otherStyles="mt-3"
                testId="txt004"
              />
              {touched.email && errors.email && <Text className="text-gray-50">{errors.email}</Text>}

              <FormField
                info={info}
                title="Kode Affiliator"
                value={values.affiliator_code}
                handleChangeText={handleChange('affiliator_code')}
                handleBlur={handleBlur('affiliator_code')}
                otherStyles="mt-3"
                testId="txt005"
              />

              <CustomButton
                title="Ubah Data"
                handlePress={handleSubmit}
                containerStyles={"mt-7 bg-secondary-200"}
                textStyles="text-white"
                isLoading={isSubmitting}
                testId="btn003"
              />
            </View>
          )}
        </Formik>

        <View className="w-full h-0.5 mt-10 bg-gray-200" />

        <Formik
          initialValues={setInitialValuesPassword}
          validationSchema={validationSchemaPassword}
          onSubmit={(values) => {
            submitActionPassword(values);
          }}
          enableReinitialize
        >
          {({ handleChange, handleBlur, handleSubmit, values, errors, touched }) => (
            <View>

              <FormField
                title="Password Baru"
                value={values.password}
                handleChangeText={handleChange('password')}
                handleBlur={handleBlur('password')}
                otherStyles="mt-3"
                testId="txt006"
              />
              {touched.password && errors.password && <Text className="text-gray-50">{errors.password}</Text>}

              <FormField
                title="Konfirmasi Password Baru"
                value={values.confirm_password}
                handleChangeText={handleChange('confirm_password')}
                handleBlur={handleBlur('confirm_password')}
                otherStyles="mt-3"
                testId="txt007"
              />
              {touched.confirm_password && errors.confirm_password && <Text className="text-gray-50">{errors.confirm_password}</Text>}

              <CustomButton
                title="Ubah Password"
                handlePress={handleSubmit}
                containerStyles={"mt-7 bg-secondary-200"}
                textStyles="text-white"
                isLoading={isSubmittingPassword}
                testId="btn004"
              />
            </View>
          )}
        </Formik>

        <View className="w-full mt-10" />

      </View >
    </ScrollView >
  )
}

export default ProfileUser