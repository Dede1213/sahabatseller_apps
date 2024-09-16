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
    name: Yup.string().required('*nama produk wajib diisi'),
    hpp: Yup.string().required('*hpp wajib diisi').matches(/^[0-9]+$/, '*hpp harus berupa angka'),
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
        barcode: '',
        hpp: '',
        price: '',
        sku: '',
        stock: '',
        minimum_stock: '',
        is_notify_stock: '',
        uom: ''
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
            screen: 'ItemVariantStack',
        });
    };
    /* End Alert */

    const submitAction = async (form) => {
        try {
            setIsSubmitting(true)
            const response = await fetchData(`${API_HOST}/item-variant/create`, {
                method: 'post',
                headers: {
                    'X-access-token': user.token,
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                },
                data: {
                    item_id: itemId,
                    name: form.name,
                    barcode: form.barcode,
                    hpp: parseInt(form.hpp),
                    price: parseInt(form.price),
                    sku: form.sku,
                    stock: parseInt(form.stock),
                    uom: form.uom
                },
            });

            if (response.code) {
                if (response.code === 200) {
                    showAlert('Notifikasi', 'Variasi Produk berhasil ditambah.');
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
                                title="Nama Variasi"
                                value={values.name}
                                handleChangeText={handleChange('name')}
                                handleBlur={handleBlur('name')}
                                otherStyles="mt-0"
                                testId="txt001"
                            />
                            {touched.name && errors.name && <Text className="text-gray-50">{errors.name}</Text>}

                            <FormField
                                title="Barcode"
                                value={values.barcode}
                                handleChangeText={handleChange('barcode')}
                                handleBlur={handleBlur('barcode')}
                                otherStyles="mt-2"
                                testId="txt002"
                            />

                            <FormField
                                title="SKU"
                                value={values.sku}
                                handleChangeText={handleChange('sku')}
                                handleBlur={handleBlur('sku')}
                                otherStyles="mt-2"
                                testId="txt003"
                            />

                            <FormField
                                title="Harga Pokok Penjualan (HPP)"
                                value={values.hpp}
                                handleChangeText={handleChange('hpp')}
                                handleBlur={handleBlur('hpp')}
                                otherStyles="mt-2"
                                testId="txt004"
                                keyboardType={"number-pad"}
                            />
                            {touched.hpp && errors.hpp && <Text className="text-gray-50">{errors.hpp}</Text>}

                            <FormField
                                title="Harga"
                                value={values.price}
                                handleChangeText={handleChange('price')}
                                handleBlur={handleBlur('price')}
                                otherStyles="mt-2"
                                testId="txt005"
                                keyboardType={"number-pad"}
                            />
                            {touched.price && errors.price && <Text className="text-gray-50">{errors.price}</Text>}

                            <FormField
                                title="Stok"
                                value={values.stock}
                                handleChangeText={handleChange('stock')}
                                handleBlur={handleBlur('stock')}
                                otherStyles="mt-2"
                                testId="txt006"
                                keyboardType={"number-pad"}
                            />
                            {touched.stock && errors.stock && <Text className="text-gray-50">{errors.stock}</Text>}

                            <FormField
                                title="Minimum Stok"
                                value={values.minimum_stock}
                                handleChangeText={handleChange('minimum_stock')}
                                handleBlur={handleBlur('minimum_stock')}
                                otherStyles="mt-2"
                                testId="txt007"
                                keyboardType={"number-pad"}
                            />
                            {touched.minimum_stock && errors.minimum_stock && <Text className="text-gray-50">{errors.minimum_stock}</Text>}

                            <SelectField
                                title="Notifikasi Stok"
                                info={"Jika stok kurang dari minimum stok, maka akan tampil notifikasi."}
                                value={values.is_notify_stock}
                                onValueChange={(value) => setFieldValue('is_notify_stock', value)}
                                handleChangeText={handleChange('is_notify_stock')}
                                handleBlur={handleBlur('is_notify_stock')}
                                placeholder="Notifikasi Stok"
                                otherStyles="mt-2"
                                dropdownPosition="bottom"
                                testId="txt008"
                            />
                            {touched.is_notify_stock && errors.is_notify_stock && <Text className="text-gray-50">{errors.is_notify_stock}</Text>}

                            <FormField
                                title="Satuan"
                                placeholder={"Ex: Lembar/Pcs/Unit/Karton ..."}
                                value={values.uom}
                                handleChangeText={handleChange('uom')}
                                handleBlur={handleBlur('uom')}
                                otherStyles="mt-2"
                                testId="txt009"
                            />
                            {touched.uom && errors.uom && <Text className="text-gray-50">{errors.uom}</Text>}

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