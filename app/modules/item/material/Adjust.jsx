import { ScrollView, Text, View, Alert } from 'react-native'
import React, { useEffect, useState } from 'react'
import FormField from '../../../../components/FormField'
import CustomButton from '../../../../components/CustomButton'
import { useGlobalContext } from '../../../../context/globalProvider'
import { fetchData } from '../../../../lib/fetchData'
import { API_HOST } from '@env';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { useNavigation, useRoute } from '@react-navigation/native'
import AlertModal from '../../../../components/AlertModal'
import { RefreshControl } from 'react-native'
import AlertConfirmModal from '../../../../components/AlertConfirmModal'
import { CapitalizeEachWord } from '../../../../lib/globalFunction'

const validationSchema = Yup.object().shape({
    price: Yup.string().required('*harga wajib diisi').matches(/^[0-9]+$/, '*harga harus berupa angka'),
    stock: Yup.string().required('*stok wajib diisi').matches(/^[0-9]+$/, '*stok harus berupa angka'),
});

const Edit = () => {
    const route = useRoute();
    const { id } = route.params;
    const navigation = useNavigation()
    const { user, setRefreshTrigger } = useGlobalContext()
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [refreshing, setRefreshing] = useState(false);
    const [refetchTrigger, setRefetchTrigger] = useState(0);

    const [initialValues, setInitialValues] = useState({
        name: '',
        price: '',
        stock: '',
        old_stock: '',
        old_price: '',
        uom: '',
        note: '',
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
        setRefreshTrigger(true)
        navigation.navigate('Item', {
            screen: 'ItemMaterialStack',
        });
    };
    /* End Alert */

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
    };

    const acceptAlertConfirm = () => {
        setIsAlertConfirmVisible(false);
        handleDelete();
    };
    /* End Alert */

    const submitAction = async (form) => {
        try {
            setIsSubmitting(true)
            const response = await fetchData(`${API_HOST}/material/adjust`, {
                method: 'put',
                headers: {
                    'X-access-token': user.token,
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                },
                data: {
                    id: id,
                    price: parseInt(form.price) || 0,
                    stock: parseInt(form.stock) || 0,
                },
            });

            if (response.code) {
                if (response.code === 200) {
                    showAlert('Notifikasi', 'Stok bahan baku berhasil ditambah.');
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

    const onRefresh = () => {
        setRefreshing(true);
        setRefetchTrigger(prev => prev + 1);
        setRefreshing(false);
    }

    useEffect(() => {
        const getData = async (id) => {
            try {
                const response = await fetchData(`${API_HOST}/material/${id}`,
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
                            old_price: (response.data.price).toString() || '',
                            old_stock: (response.data.stock).toString() || '',
                            uom: response.data.uom || '',
                            note: response.data.note || '',
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

    }, [refetchTrigger]);

    return (
        <ScrollView className="bg-primary" refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}>
            <View className="w-full justify-center px-4 bg-primary mt-5">
                <AlertModal visible={isAlertVisible} header={alertTitle} message={alertMessage} onClose={closeAlert} />
                <AlertConfirmModal visible={isAlertConfirmVisible} header={alertConfirmTitle} message={alertConfirmMessage} onClose={closeAlertConfirm} onAccept={acceptAlertConfirm} />
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

                            <View className="items-center">
                                <View>
                                    <Text className="text-lg font-PoppinsSemiBold text-secondary-200">{CapitalizeEachWord(values.name ? values.name : '')}</Text>
                                </View>
                                <View className="flex-row mt-1">
                                    <View>
                                        <Text className="text-base font-PoppinsSemiBold text-gray-100">Stok : {values.old_stock}</Text>
                                    </View>
                                    <View className="ml-5">
                                        <Text className="text-base font-PoppinsSemiBold text-gray-100">Harga : {values.old_price}</Text>
                                    </View>
                                </View>
                            </View>

                            <View className="w-full h-0.5 mt-3 bg-gray-200 mb-0" />

                            <FormField
                                title="Stok"
                                value={values.stock}
                                handleChangeText={handleChange('stock')}
                                handleBlur={handleBlur('stock')}
                                otherStyles="mt-2"
                                testId="txt001"
                                keyboardType={"number-pad"}
                            />
                            {touched.stock && errors.stock && <Text className="text-gray-50">{errors.stock}</Text>}

                            <FormField
                                title="Harga"
                                info={"Harga akan menghitung nilai rata-rata jika stok sebelum nya masih ada."}
                                value={values.price}
                                handleChangeText={handleChange('price')}
                                handleBlur={handleBlur('price')}
                                otherStyles="mt-2"
                                testId="txt002"
                                keyboardType={"number-pad"}
                            />
                            {touched.price && errors.price && <Text className="text-gray-50">{errors.price}</Text>}



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

export default Edit