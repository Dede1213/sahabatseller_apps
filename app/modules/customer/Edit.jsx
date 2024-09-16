import { ScrollView, Text, View, Alert } from 'react-native'
import React, { useEffect, useState } from 'react'
import FormField from '../../../components/FormField'
import CustomButton from '../../../components/CustomButton'
import { useGlobalContext } from '../../../context/globalProvider'
import { fetchData } from '../../../lib/fetchData'
import { API_HOST } from '@env';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { useNavigation } from '@react-navigation/native'
import { useRoute } from '@react-navigation/native';
import AlertConfirmModal from '../../../components/AlertConfirmModal'
import AlertModal from '../../../components/AlertModal'

const validationSchema = Yup.object().shape({
    name: Yup.string().required('*nama toko wajib diisi'),
    address: Yup.string().required('*alamat toko wajib diisi'),
    phone: Yup.string().min(10, '*nomor handphone minimal 10 angka').required('*nomor handphone wajib diisi').matches(/^[0-9]+$/, '*nomor handphone harus berupa angka'),
});

const Edit = () => {
    const route = useRoute();
    const { id } = route.params;

    const navigation = useNavigation()
    const { user, setRefreshTrigger } = useGlobalContext()
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [initialValues, setInitialValues] = useState({
        name: '',
        address: '',
        phone: '',
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
        setRefreshTrigger(true)
        navigation.navigate('Customer', {
            screen: 'CustomerStack',
        });
    };
    /* End Alert */

    useEffect(() => {
        const getData = async (id) => {
            try {
                const response = await fetchData(`${API_HOST}/customer/${id}`,
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
                            address: response.data.address || '',
                            phone: response.data.phone || '',
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
            const response = await fetchData(`${API_HOST}/customer/update`, {
                method: 'put',
                headers: {
                    'X-access-token': user.token,
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                },
                data: {
                    id: id,
                    name: form.name,
                    address: form.address,
                    phone: form.phone,
                },
            });

            if (response.code) {
                if (response.code === 200) {
                    showAlert('Notifikasi', 'Pelanggan berhasil diubah.');
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
            const response = await fetchData(`${API_HOST}/customer/delete/${id}`, {
                method: 'delete',
                headers: {
                    'X-access-token': user.token,
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                },
            });

            if (response.code) {
                if (response.code === 200) {
                    showAlert('Notifikasi', 'Pelanggan berhasil dihapus.');
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
                    {({ handleChange, handleBlur, handleSubmit, values, errors, touched }) => (
                        <View>

                            <FormField
                                title="Nama"
                                value={values.name}
                                handleChangeText={handleChange('name')}
                                handleBlur={handleBlur('name')}
                                otherStyles="mt-0"
                                testId="txt001"
                            />
                            {touched.name && errors.name && <Text className="text-gray-50">{errors.name}</Text>}

                            <FormField
                                title="Alamat"
                                value={values.address}
                                handleChangeText={handleChange('address')}
                                handleBlur={handleBlur('address')}
                                otherStyles="mt-2"
                                multiline={true}
                                numberOfLines={4}
                                textAlignVertical="top"
                                testId="txt002"
                            />
                            {touched.address && errors.address && <Text className="text-gray-50">{errors.address}</Text>}

                            <FormField
                                title="No. Telp"
                                value={values.phone}
                                handleChangeText={handleChange('phone')}
                                handleBlur={handleBlur('phone')}
                                otherStyles="mt-2"
                                testId="txt003"
                                keyboardType="number-pad"
                            />
                            {touched.phone && errors.phone && <Text className="text-gray-50">{errors.phone}</Text>}

                            <View>
                                <CustomButton
                                    title="Simpan"
                                    handlePress={handleSubmit}
                                    containerStyles={"mt-7 bg-secondary-200"}
                                    isLoading={isSubmitting}
                                    textStyles={"text-white"}
                                    testId="btn001"
                                />
                                <CustomButton
                                    title="Hapus Lokasi"
                                    handlePress={() => showAlertConfirm('Konfirmasi', 'Apakah Anda yakin ingin menghapus lokasi ini?')}
                                    containerStyles={"mt-2"}
                                    isLoading={isSubmitting}
                                    textStyles={"color-red-500 underline"}
                                    testId="btn002"
                                />

                            </View>

                        </View>
                    )}
                </Formik>

                <View className="w-full mt-10" />

            </View >
        </ScrollView >
    )
}

export default Edit