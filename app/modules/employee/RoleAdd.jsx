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

const validationSchema = Yup.object().shape({
  title: Yup.string().required('*nama hak akses wajib diisi'),
  module_id: Yup.array().of(Yup.string()).required('Wajib memilih menu yang diizinkan.'),
});

const RoleAdd = () => {
  const navigation = useNavigation()
  const { user } = useGlobalContext()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [dataModule, setDataModule] = useState([]);
  const [initialValues] = useState({
    title: '',
    module_id: '',
  });

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

  }, []);

  const submitAction = async (form) => {
    try {
      setIsSubmitting(true)
      const response = await fetchData(`${API_HOST}/roles/create`, {
        method: 'post',
        headers: {
          'X-access-token': user.token,
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        data: {
          title: form.title,
          module_id: (form.module_id).join(","),
        },
      });

      if (response.code) {
        if (response.code === 200) {
          Alert.alert('Notifikasi', 'Hak akses berhasil ditambah.')
          navigation.navigate('Employee', { screen: 'RoleViewStack' })
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
          {({ handleChange, handleBlur, handleSubmit, values, errors, touched, setFieldValue }) => (
            <View>

              <FormField
                title="Nama Hak Akses"
                placeholder="ex: kasir/admin/finance dll"
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
                    {dataModule.map((option, index) => (
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

export default RoleAdd