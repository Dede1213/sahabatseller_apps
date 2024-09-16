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
import SelectField from '../../../components/SelectField'
import AlertModal from '../../../components/AlertModal'

const validationSchema = Yup.object().shape({
  name: Yup.string().required('*nama toko wajib diisi'),
  type_id: Yup.string().required('*tipe toko wajib diisi'),
});

const ProfileStore = () => {

  const { user } = useGlobalContext()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [uploading, setUploading] = useState(false);
  const [storeType, setStoreType] = useState([]);
  const [initialValues, setInitialValues] = useState({
    name: '',
    type_id: '',
    tax_count: '',
    margin_percentage: '',
  });

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
  };
  /* End Alert */

  const [initialValuesLogo, setInitialValuesLogo] = useState({
    logo: ''
  });

  useEffect(() => {
    const getDataStoreType = async () => {
      try {
        const response = await fetchData(`${API_HOST}/store/type/list`,
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
            setStoreType(formattedData);
          }
        } else {
          Alert.alert(response.message)
        }
      } catch (error) {
        Alert.alert(error.message);
      }
    }

    getDataStoreType();

    const getData = async () => {
      try {
        const response = await fetchData(`${API_HOST}/store/${user.store_id}`,
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
              type_id: response.data.type_id || '',
              tax_count: response.data.tax_count || '',
              margin_percentage: (response.data.margin_percentage).toString() ? (response.data.margin_percentage).toString() : ''
            });
            setInitialValuesLogo({
              logo: response.data.logo || '',
            });
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
      const response = await fetchData(`${API_HOST}/store/update`, {
        method: 'put',
        headers: {
          'X-access-token': user.token,
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        data: {
          id: user.store_id,
          name: form.name,
          tax_count: form.tax_count,
          type_id: form.type_id,
          margin_percentage: parseInt(form.margin_percentage) ? parseInt(form.margin_percentage) : 0,
        },
      });

      if (response.code) {
        if (response.code === 200) {
          showAlert('Notifikasi', 'Toko anda berhasil diubah.');
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
          setInitialValuesLogo({
            ...initialValuesLogo,
            logo: result.assets[0],
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
      !initialValuesLogo.logo.uri
    ) {
      return Alert.alert("Warning!", "Logo tidak boleh kosong.");
    }

    setUploading(true);

    const storedTokenUser = await SecureStore.getItemAsync('userToken');

    const formData = new FormData();
    formData.append('logo', {
      uri: initialValuesLogo.logo.uri,
      name: initialValuesLogo.logo.name,
      type: initialValuesLogo.logo.mimeType || 'application/octet-stream', // Default to a binary type
    });
    formData.append('store_id', user.store_id);

    try {
      const response = await fetchData(`${API_HOST}/store/photo/`, {
        headers: {
          'X-access-token': storedTokenUser,
          'Content-Type': 'multipart/form-data',
        },
        method: 'put',
        data: formData
      });

      if (response.code == 200) {
        showAlert('Notifikasi', 'Logo Toko berhasil diubah.');
      } else {
        showAlert('Notifikasi', 'Logo Toko gagal diubah.');
      }
    } catch (error) {
      Alert.alert("Notifikasi", error.message)
    } finally {
      setUploading(false);
    }
  };


  return (
    <ScrollView className="bg-primary">
      <View className="w-full justify-center px-4 bg-primary mt-5">
        <AlertModal visible={isAlertVisible} header={alertTitle} message={alertMessage} onClose={closeAlert} />
        <Formik
          initialValues={initialValuesLogo}
          onSubmit={() => {
            submitActionImages()
          }}
          enableReinitialize
        >
          {({ handleSubmit }) => (
            <View>
              {!initialValuesLogo.logo.uri &&
                <Image
                  source={{ uri: `${API_HOST}/store/images/${initialValuesLogo.logo}` }}
                  resizeMode="cover"
                  className="w-[150px] h-[150px] rounded-2xl mb-4"
                />
              }

              {initialValuesLogo.logo.uri && <Image source={{ uri: initialValuesLogo.logo.uri }} className="w-[150px] h-[150px] rounded-2xl mb-4" resizeMode='cover' />}

              <TouchableOpacity onPress={() => openPicker("image")}>
                <View className="w-[150px] h-[40px] mb-3 px-4 bg-primary  border-2 border-gray-200 flex justify-center items-center flex-row space-x-2">
                  <Image
                    source={icons.upload}
                    resizeMode="contain"
                    alt="upload"
                    className="w-5 h-5"
                  />
                  <Text className="text-sm text-gray-100 font-poppinsMedium" testID="btn001">
                    Pilih Logo
                  </Text>
                </View>
              </TouchableOpacity>
              <View className="w-[150px] bg-primary rounded-2xl ">
                <Button title={uploading ? "Uploading..." : "Upload"} onPress={handleSubmit} isLoading={uploading} testID="btn002" />
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
          {({ handleChange, handleBlur, handleSubmit, values, errors, touched, setFieldValue }) => (
            <View>

              <FormField
                title="Nama Toko"
                value={values.name}
                handleChangeText={handleChange('name')}
                handleBlur={handleBlur('name')}
                otherStyles="mt-0"
                testId="txt001"
              />
              {touched.name && errors.name && <Text className="text-gray-50">{errors.name}</Text>}

              <SelectField
                title="Tipe Toko"
                data={storeType}
                value={values.type_id}
                onValueChange={(value) => setFieldValue('type_id', value)}
                handleChangeText={handleChange('type_id')}
                handleBlur={handleBlur('type_id')}
                placeholder="Pilih Tipe Toko"
                otherStyles="mt-3"
                testId="txt002"
              />
              {touched.type_id && errors.type_id && <Text className="text-gray-50">{errors.type_id}</Text>}

              <SelectField
                title="Aktifkan Pajak ?"
                info={"Jika Ya, maka pajak 11% akan otomatis terbentuk di setiap transaksi."}
                data={[{ label: "Ya", value: "YA" }, { label: "Tidak", value: "TIDAK" }]}
                value={values.tax_count}
                onValueChange={(value) => setFieldValue('tax_count', value)}
                handleChangeText={handleChange('tax_count')}
                handleBlur={handleBlur('tax_count')}
                placeholder="Pilih"
                otherStyles="mt-3 w-[200px]"
                testId="txt003"
              />

              <View className="flex-row items-center">
                <FormField
                  info={"Jika diisi, sistem akan memberikan rekomendasi harga jual pada saat tambah produk, berdasarkan estimasi margin."}
                  title="Estimasi Margin"
                  value={values.margin_percentage}
                  handleChangeText={handleChange('margin_percentage')}
                  handleBlur={handleBlur('margin_percentage')}
                  otherStyles="mt-3 w-[200px]"
                  keyboardType="number-pad"
                  testId="txt004"
                />
                <Text className="text-gray-100 text-2xl mt-10 ml-2">%</Text>
              </View>

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

        <View className="w-full mt-10" />

      </View >
    </ScrollView >
  )
}

export default ProfileStore