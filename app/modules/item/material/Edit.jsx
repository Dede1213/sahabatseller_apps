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

const validationSchema = Yup.object().shape({
    name: Yup.string().required('*nama bahan baku wajib diisi'),
    price: Yup.string().required('*harga wajib diisi').matches(/^[0-9]+$/, '*harga harus berupa angka'),
    stock: Yup.string().required('*stok wajib diisi').matches(/^[0-9]+$/, '*stok harus berupa angka'),
    uom: Yup.string().required('*satuan wajib diisi'),
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
            const response = await fetchData(`${API_HOST}/material/update`, {
                method: 'put',
                headers: {
                    'X-access-token': user.token,
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                },
                data: {
                    id: id,
                    name: form.name,
                    price: parseInt(form.price) || 0,
                    stock: parseInt(form.stock) || 0,
                    uom: form.uom,
                    note: form.note
                },
            });

            if (response.code) {
                if (response.code === 200) {
                    showAlert('Notifikasi', 'Bahan Baku Produk berhasil diubah.');
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
            const response = await fetchData(`${API_HOST}/material/delete/${id}`, {
                method: 'delete',
                headers: {
                    'X-access-token': user.token,
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                },
            });

            if (response.code) {
                if (response.code === 200) {
                    showAlert('Notifikasi', 'Bahan Baku berhasil dihapus.');
                }
            } else {
                Alert.alert(response.message)
            }
        } catch (error) {
            Alert.alert(error.message)
        } finally {
            setIsSubmitting(false)
        }
    };

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
                            price: (response.data.price).toString() || '',
                            stock: (response.data.stock).toString() || '',
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

                            <FormField
                                title="Nama Bahan Baku"
                                value={values.name}
                                handleChangeText={handleChange('name')}
                                handleBlur={handleBlur('name')}
                                otherStyles="mt-0"
                                otherTextInputStyles={user?.is_head_office == 'YA' ? "" : "bg-gray-200"}
                                editable={user?.is_head_office == 'YA' ? true : false}
                                testId="txt001"
                            />
                            {touched.name && errors.name && <Text className="text-gray-50">{errors.name}</Text>}

                            <FormField
                                title="Harga"
                                value={values.price}
                                handleChangeText={handleChange('price')}
                                handleBlur={handleBlur('price')}
                                otherStyles="mt-2"
                                testId="txt002"
                                keyboardType={"number-pad"}
                            />
                            {touched.price && errors.price && <Text className="text-gray-50">{errors.price}</Text>}

                            <FormField
                                title="Stok"
                                value={values.stock}
                                handleChangeText={handleChange('stock')}
                                handleBlur={handleBlur('stock')}
                                otherStyles="mt-2"
                                testId="txt003"
                                keyboardType={"number-pad"}
                            />
                            {touched.stock && errors.stock && <Text className="text-gray-50">{errors.stock}</Text>}

                            <FormField
                                title="Satuan"
                                placeholder={"Ex: Lembar/Pcs/Unit/Karton ..."}
                                value={values.uom}
                                handleChangeText={handleChange('uom')}
                                handleBlur={handleBlur('uom')}
                                otherStyles="mt-2"
                                otherTextInputStyles={user?.is_head_office == 'YA' ? "" : "bg-gray-200"}
                                editable={user?.is_head_office == 'YA' ? true : false}
                                testId="txt004"
                            />
                            {touched.uom && errors.uom && <Text className="text-gray-50">{errors.uom}</Text>}
                            
                            <FormField
                                title="Keterangan"
                                value={values.note}
                                handleChangeText={handleChange('note')}
                                handleBlur={handleBlur('note')}
                                otherStyles="mt-2"
                                editable={user?.is_head_office == 'YA' ? true : false}
                                testId="txt005"
                                multiline={true}
                                numberOfLines={4}
                            />
                            {touched.note && errors.note && <Text className="text-gray-50">{errors.note}</Text>}
                            
                            <CustomButton
                                title="Simpan"
                                handlePress={handleSubmit}
                                containerStyles={"mt-7 bg-secondary-200"}
                                textStyles="text-white"
                                isLoading={isSubmitting}
                                testId="btn001"
                            />
                            {user?.is_head_office == 'YA' &&
                                <View>

                                    <CustomButton
                                        title="Hapus Bahan Baku Produk"
                                        handlePress={() => showAlertConfirm('Konfirmasi', 'Apakah Anda yakin ingin menghapus bahan baku produk ini?')}
                                        containerStyles={"mt-2"}
                                        isLoading={isSubmitting}
                                        textStyles={"color-red-500 underline"}
                                        testId="btn003"
                                    />
                                </View>
                            }
                        </View>
                    )}
                </Formik>

                <View className="w-full mt-10" />

            </View >
        </ScrollView >
    )
}

export default Edit