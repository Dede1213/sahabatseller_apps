import { ScrollView, Text, View, Alert } from 'react-native'
import React, { useState } from 'react'
import FormField from '../../../components/FormField'
import CustomButton from '../../../components/CustomButton'
import { useGlobalContext } from '../../../context/globalProvider'
import { fetchData } from '../../../lib/fetchData'
import { API_HOST } from '@env';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { useNavigation } from '@react-navigation/native'
import AlertModal from '../../../components/AlertModal'

const validationSchema = Yup.object().shape({
    name: Yup.string().required('*nama toko wajib diisi'),
    address: Yup.string().required('*alamat toko wajib diisi'),
    phone: Yup.string().min(10, '*nomor handphone minimal 10 angka').required('*nomor handphone wajib diisi').matches(/^[0-9]+$/, '*nomor handphone harus berupa angka'),
});

const Create = () => {
    const navigation = useNavigation()
    const { user, setRefreshTrigger } = useGlobalContext()
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [initialValues] = useState({
        name: '',
        address: '',
        phone: '',
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
        navigation.navigate('Customer', {
            screen: 'CustomerStack',
        });
    };
    /* End Alert */

    const submitAction = async (form) => {
        try {
            setIsSubmitting(true)
            const response = await fetchData(`${API_HOST}/customer/create`, {
                method: 'post',
                headers: {
                    'X-access-token': user.token,
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                },
                data: {
                    name: form.name,
                    address: form.address,
                    phone: form.phone,
                },
            });

            if (response.code) {
                if (response.code === 200) {
                    showAlert('Notifikasi', 'Pelanggan berhasil ditambah.');
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

export default Create