import { ScrollView, Text, View, Alert, RefreshControl } from 'react-native'
import React, { useState } from 'react'
import FormField from '../../../../components/FormField'
import CustomButton from '../../../../components/CustomButton'
import { useGlobalContext } from '../../../../context/globalProvider'
import { fetchData } from '../../../../lib/fetchData'
import { API_HOST } from '@env';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { TouchableOpacity } from 'react-native'
import { FormatAmount, UnFormatAmount } from '../../../../lib/globalFunction'

const validationSchema = Yup.object().shape({
    money_receive: Yup.string().required('*uang diterima wajib diisi'),
});

const Cash = () => {

    const { user, transaction, setTransaction } = useGlobalContext()
    const [isSubmitting, setIsSubmitting] = useState(false)

    const [initialValues, setInitialValues] = useState({
        money_receive: 0,
        money_return: 0,
    });


    const submitAction = async () => {
        console.log(transaction)
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
                    transaction_date: FormatDateForQuery(form.transaction_date),
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

    const handlePayment = (value) => {
        let money_return = 0
        money_return = value - (transaction.total_amount ? transaction.total_amount : value)
        setInitialValues({ money_receive: value, money_return: money_return });
        setTransaction(prevTransaction => ({ ...prevTransaction, money_receive: value, money_return: money_return, payment_type_id: 0, payment_type_name: 'Tunai', payment_status: 'LUNAS' }));
    }
    return (
        <ScrollView className="bg-primary">
            <View className="w-full justify-center px-4 bg-primary mt-5">
                <Text className="text-xl font-PoppinsSemiBold text-secondary-100">Total Tagihan : Rp. {transaction.total_amount ? FormatAmount(transaction.total_amount) : 0}</Text>

                <View className="border-b-4 border-secondary-100 py-2 mb-2 "></View>

                <Formik
                    initialValues={initialValues}
                    validationSchema={validationSchema}
                    onSubmit={(values) => {
                        submitAction(values);
                    }}
                    enableReinitialize
                >
                    {({ handleSubmit, values, errors, touched, setFieldValue }) => (
                        <View>
                            <FormField
                                title="Uang Yang Diterima :"
                                value={(values.money_receive ? FormatAmount(values.money_receive) : '').toString()}
                                handleChangeText={(text) => { setFieldValue('money_receive', UnFormatAmount(text)); }}
                                handleBlur={() => { handlePayment(values.money_receive); }}
                                otherStyles="mt-3"
                                textStyle={'text-3xl'}
                                testId="txt004"
                                keyboardType="number-pad"
                                multiline={true}
                                numberOfLines={2}
                            />
                            {touched.money_receive && errors.money_receive && <Text className="text-gray-50">{errors.money_receive}</Text>}

                            <View className="flex-row w-full items-center justify-center mt-4">
                                <Text className="text-base font-PoppinsSemiBold text-gray-500">Uang yang dikembalikan : Rp. {values.money_return ? FormatAmount(values.money_return) : 0}</Text>
                            </View>

                            <View className="flex-row w-full items-center justify-center mt-4">
                                <TouchableOpacity
                                    onPress={() => { handlePayment(transaction.total_amount ? transaction.total_amount : 0) }}
                                    activeOpacity={0.5}
                                >
                                    <View className="items-center rounded-lg border border-gray-200 py-1 px-2 mt-2 mr-2">
                                        <Text className="text-xl font-PoppinsSemiBold text-gray-400">Uang Pas</Text>
                                    </View>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    onPress={() => { handlePayment(5000) }}
                                    activeOpacity={0.5}
                                >
                                    <View className="items-center rounded-lg border border-gray-200 py-1 px-2 mt-2 mr-2">
                                        <Text className="text-xl font-PoppinsSemiBold text-gray-400">5.000</Text>
                                    </View>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    onPress={() => { handlePayment(10000) }}
                                    activeOpacity={0.5}
                                >
                                    <View className="items-center rounded-lg border border-gray-200 py-1 px-2 mt-2 mr-2">
                                        <Text className="text-xl font-PoppinsSemiBold text-gray-400">10.000</Text>
                                    </View>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    onPress={() => { handlePayment(15000) }}
                                    activeOpacity={0.5}
                                >
                                    <View className="items-center rounded-lg border border-gray-200 py-1 px-2 mt-2 mr-2">
                                        <Text className="text-xl font-PoppinsSemiBold text-gray-400">15.000</Text>
                                    </View>
                                </TouchableOpacity>
                            </View>

                            <View className="flex-row w-full items-center justify-center mt-1">
                                <TouchableOpacity
                                    onPress={() => { handlePayment(20000) }}
                                    activeOpacity={0.5}
                                >
                                    <View className="items-center rounded-lg border border-gray-200 py-1 px-2 mt-2 mr-2">
                                        <Text className="text-xl font-PoppinsSemiBold text-gray-400">20.000</Text>
                                    </View>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    onPress={() => { handlePayment(50000) }}
                                    activeOpacity={0.5}
                                >
                                    <View className="items-center rounded-lg border border-gray-200 py-1 px-2 mt-2 mr-2">
                                        <Text className="text-xl font-PoppinsSemiBold text-gray-400">50.000</Text>
                                    </View>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    onPress={() => { handlePayment(75000) }}
                                    activeOpacity={0.5}
                                >
                                    <View className="items-center rounded-lg border border-gray-200 py-1 px-2 mt-2 mr-2">
                                        <Text className="text-xl font-PoppinsSemiBold text-gray-400">75.000</Text>
                                    </View>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    onPress={() => { handlePayment(100000) }}
                                    activeOpacity={0.5}
                                >
                                    <View className="items-center rounded-lg border border-gray-200 py-1 px-2 mt-2 mr-2">
                                        <Text className="text-xl font-PoppinsSemiBold text-gray-400">100.000</Text>
                                    </View>
                                </TouchableOpacity>
                            </View>



                            <CustomButton
                                title="Simpan"
                                handlePress={handleSubmit}
                                containerStyles={"mt-10 bg-secondary-200"}
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

export default Cash