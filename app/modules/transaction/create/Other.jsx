import { ScrollView, Text, View, Alert } from 'react-native'
import React, { useEffect, useState } from 'react'
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


const validationSchema = Yup.object().shape({
    payment_type_id: Yup.string().required('*tipe wajib diisi'),
});

const Other = () => {

    const { user, transaction, setTransaction } = useGlobalContext()
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [dataPaymentType, setDataPaymentType] = useState([])
    const [initialValues] = useState({
        payment_type_id: '',
        payment_type_name: '',
        payment_status: 'LUNAS'
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

    useEffect(() => {
        const getDataCashFlow = async () => {
            try {
                const response = await fetchData(`${API_HOST}/payment-type/location?page=1&limit=100`,
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
                        setDataPaymentType(formattedData);
                    }
                } else {
                    Alert.alert(response.message)
                }
            } catch (error) {
                Alert.alert(error.message);
            }
        }

        getDataCashFlow();

    }, []);

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

                            <SelectField
                                title="Tipe Pembayaran"
                                data={dataPaymentType}
                                value={values.payment_type_id}
                                onValueChange={(value) => setFieldValue('payment_type_id', value)}
                                handleChangeText={handleChange('payment_type_id')}
                                handleBlur={handleBlur('payment_type_id')}
                                placeholder="Pilih Tipe Pembayaran"
                                otherStyles="mt-0"
                                dropdownPosition="bottom"
                                testId="txt001"
                            />
                            {touched.payment_type_id && errors.payment_type_id && <Text className="text-gray-50">{errors.payment_type_id}</Text>}

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

export default Other