import { ScrollView, Text, View, Alert } from 'react-native'
import React, { useEffect, useState } from 'react'
import FormField from '../../../../components/FormField'
import CustomButton from '../../../../components/CustomButton'
import { useGlobalContext } from '../../../../context/globalProvider'
import { fetchData } from '../../../../lib/fetchData'
import { API_HOST } from '@env';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { useNavigation } from '@react-navigation/native'
import AlertModal from '../../../../components/AlertModal'
import SelectField from '../../../../components/SelectField'

const validationSchema = Yup.object().shape({
    name: Yup.string().required('*nama bahan baku wajib diisi'),
    price: Yup.string().required('*harga wajib diisi').matches(/^[0-9]+$/, '*harga harus berupa angka'),
    stock: Yup.string().required('*stok wajib diisi').matches(/^[0-9]+$/, '*stok harus berupa angka'),
    uom: Yup.string().required('*satuan wajib diisi'),
});

const Create = () => {
    const navigation = useNavigation()
    const { user, setRefreshTrigger, itemId } = useGlobalContext()
    const [isSubmitting, setIsSubmitting] = useState(false)

    const [initialValues] = useState({
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

    const submitAction = async (form) => {
        try {
            setIsSubmitting(true)
            const response = await fetchData(`${API_HOST}/material/create`, {
                method: 'post',
                headers: {
                    'X-access-token': user.token,
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                },
                data: {
                    name: form.name,
                    price: parseInt(form.price),
                    stock: parseInt(form.stock),
                    uom: form.uom,
                    note: form.note
                },
            });

            if (response.code) {
                if (response.code === 200) {
                    showAlert('Notifikasi', 'Bahan baku produk berhasil ditambah.');
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
                    {({ handleChange, handleBlur, handleSubmit, values, errors, touched, setFieldValue }) => (
                        <View>

                            <FormField
                                title="Nama Bahan Baku"
                                value={values.name}
                                handleChangeText={handleChange('name')}
                                handleBlur={handleBlur('name')}
                                otherStyles="mt-0"
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
                                testId="txt004"
                            />
                            {touched.uom && errors.uom && <Text className="text-gray-50">{errors.uom}</Text>}

                            <FormField
                                title="Catatan"
                                value={values.note}
                                handleChangeText={handleChange('note')}
                                handleBlur={handleBlur('note')}
                                otherStyles="mt-2"
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
                        </View>
                    )}
                </Formik>

                <View className="w-full mt-10" />

            </View >
        </ScrollView >
    )
}

export default Create