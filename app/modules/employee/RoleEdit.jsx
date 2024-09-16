import { ScrollView, Text, View, Alert, TouchableOpacity, StyleSheet } from 'react-native'
import React, { useEffect, useState } from 'react'
import FormField from '../../../components/FormField'
import CustomButton from '../../../components/CustomButton'
import { useGlobalContext } from '../../../context/globalProvider'
import { fetchData } from '../../../lib/fetchData'
import { API_HOST } from '@env';
import { Formik, FieldArray } from 'formik';
import * as Yup from 'yup';
import { useNavigation } from '@react-navigation/native'
import CheckBox from '@react-native-community/checkbox';
import { useRoute } from '@react-navigation/native';
import AlertConfirmModal from '../../../components/AlertConfirmModal'
import AlertModal from '../../../components/AlertModal'

const validationSchema = Yup.object().shape({
  title: Yup.string().required('*nama hak akses wajib diisi'),
  module_id: Yup.array().of(Yup.string()).required('Wajib memilih menu yang diizinkan.'),
});

const RoleEdit = () => {
  const route = useRoute();
  const { id } = route.params;

  const navigation = useNavigation()
  const { user } = useGlobalContext()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [dataModule, setDataModule] = useState([]);
  const [initialValues, setInitialValues] = useState({
    title: '',
    module_id: '',
    is_owner: ''
  });

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
    navigation.navigate('Employee', { screen: 'RoleViewStack' })
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
  };
  /* End Alert */

  useEffect(() => {
    const getDataModules = async () => {
      try {
        const response = await fetchData(`${API_HOST}/roles/modules`,
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
            setDataModule(response.data);
          }
        } else {
          Alert.alert(response.message)
        }
      } catch (error) {
        Alert.alert(error.message);
      }
    }

    getDataModules();

    const getData = async (id) => {
      try {
        const response = await fetchData(`${API_HOST}/roles/${id}`,
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
              title: response.data.title || '',
              module_id: (response.data.module_id).split(',') || [],
              is_owner: response.data.is_owner || '',
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

  const submitAction = async (form) => {
    try {
      setIsSubmitting(true)
      const response = await fetchData(`${API_HOST}/roles/update`, {
        method: 'put',
        headers: {
          'X-access-token': user.token,
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        data: {
          id: id,
          title: form.title,
          module_id: (form.module_id).join(","),
        },
      });

      if (response.code) {
        if (response.code === 200) {
          showAlert('Notifikasi', 'Hak akses berhasil diubah.');
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

  const handleDelete = async () => {
    try {
      setIsSubmitting(true)
      const response = await fetchData(`${API_HOST}/roles/delete/${id}`, {
        method: 'delete',
        headers: {
          'X-access-token': user.token,
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
      });

      if (response.code) {
        if (response.code === 200) {
          showAlert('Notifikasi', 'Hak akses berhasil dihapus.');
        }
      } else {
        Alert.alert(response.message)
      }
    } catch (error) {
      Alert.alert(error.message)
    } finally {
      setIsSubmitting
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
                title="Nama Hak Akses"
                placeholder="ex: manajer/supervisor/pegawai dll"
                value={values.title}
                handleChangeText={handleChange('title')}
                handleBlur={handleBlur('title')}
                otherStyles="mt-0"
                testId="txt001"
              />
              {touched.title && errors.title && <Text className="text-gray-50">{errors.title}</Text>}

              <Text className="text-base font-PoppinsMedium text-gray-100 mt-5"> Menu Yang Diizinkan : </Text>
              <FieldArray
                name="module_id"
                render={({ push, remove }) => (
                  <>
                    {dataModule?.map((option, index) => (
                      <View key={option.id} style={styles.checkboxContainer}>
                        <CheckBox
                          value={values.module_id.includes(option.id)}
                          onValueChange={(checked) => {
                            if (checked) {
                              setFieldValue('module_id', [...values.module_id, option.id]);
                            } else {
                              setFieldValue(
                                'module_id',
                                values.module_id.filter((item) => item !== option.id)
                              );
                            }
                          }}
                          testID="cb001"
                        />
                        <Text className="text-base font-PoppinsMedium text-gray-100">{option.title}</Text>
                      </View>
                    ))}
                  </>
                )}
              />
              {errors.module_id && touched.module_id ? (
                <Text style={styles.errorText}>{errors.module_id}</Text>
              ) : null}
              <View>
                <CustomButton
                  title="Simpan"
                  handlePress={handleSubmit}
                  containerStyles={"mt-7 bg-secondary-200"}
                  textStyles="text-white"
                  isLoading={isSubmitting}
                  testId="btn001"
                />
                {values.is_owner == "TIDAK" &&
                  <CustomButton
                    title="Hapus Pegawai"
                    handlePress={() => showAlertConfirm('Konfirmasi', 'Apakah Anda yakin ingin menghapus hak akses ini?')}
                    containerStyles={"mt-2"}
                    isLoading={isSubmitting}
                    textStyles={"color-red-500 underline"}
                    testId="btn002"
                  />
                }
              </View>
            </View>
          )}
        </Formik>

        <View className="w-full mt-10" />

      </View >
    </ScrollView >
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  form: {
    flex: 1,
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
  },
  errorText: {
    color: 'red',
    marginVertical: 10,
  },
});

export default RoleEdit