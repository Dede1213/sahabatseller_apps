import { ScrollView, Text, View, Alert } from 'react-native'
import React, { useState } from 'react'
import CustomButton from '../../../../components/CustomButton'
import { useGlobalContext } from '../../../../context/globalProvider'
import { fetchData } from '../../../../lib/fetchData'
import { API_HOST } from '@env';
import { Formik } from 'formik';
import * as Yup from 'yup';
import DateTimePicker from '@react-native-community/datetimepicker';
import { TouchableOpacity } from 'react-native'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { FormatDateForQuery } from '../../../../lib/globalFunction'


const validationSchema = Yup.object().shape({});

const Debt = () => {

  const { user, transaction, setTransaction } = useGlobalContext()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showDatePicker, setShowDatePicker] = useState(false);

  const [initialValues] = useState({
    due_date: new Date(),
    payment_type_id: 0, 
    payment_type_name: 'Hutang', 
    payment_status: 'Hutang'
  });

  const submitAction = async (form) => {
    console.log(form)
    return
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
          due_date: FormatDateForQuery(form.due_date),
        },
      });

      if (response.code) {
        if (response.code === 200) {
          showAlert('Notifikasi', 'Cash flow berhasil ditambah.');
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
          {({ handleSubmit, values, setFieldValue }) => (
            <View>

              <View className={`space-y-2 mt-3`}>
                <Text className="text-base font-PoppinsMedium text-gray-100">Tanggal Jatuh Tempo :</Text>
                <View className='flex-row'>
                  <View className="w-full">
                    <TouchableOpacity onPress={() => setShowDatePicker(true)}>
                      <View className={`border-2 border-gray-200 w-full px-2 rounded-lg focus:border-secondary items-center flex-row`}>
                        <View className="flex-1 py-3">
                          <Text className="text-gray-100 font-poppinsSemiBold text-m">
                            {values.due_date ? (values.due_date).toLocaleDateString() : (new Date()).toLocaleDateString()}
                          </Text>
                        </View>
                        <Icon name="calendar-month" color="gray" size={20} testID="txt003" />
                      </View>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>

              {showDatePicker && (
                <DateTimePicker
                  value={values.due_date ? values.due_date : new Date()}
                  mode="date"
                  display="default"
                  onChange={(event, selectedDate) => {
                    setShowDatePicker(false);
                    setFieldValue('due_date', selectedDate);
                  }}
                />
              )}

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

export default Debt