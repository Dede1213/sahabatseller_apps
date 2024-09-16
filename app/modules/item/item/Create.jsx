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
import { RefreshControl } from 'react-native'
import SelectField from '../../../../components/SelectField'

const validationSchema = Yup.object().shape({
    name: Yup.string().required('*nama produk wajib diisi'),
    brand_id: Yup.string().required('*merek wajib diisi'),
    category_id: Yup.string().required('*kategori wajib diisi'),
    description: Yup.string().required('*deskripsi wajib diisi'),
    hpp: Yup.string().required('*hpp wajib diisi').matches(/^[0-9]+$/, '*hpp harus berupa angka'),
    is_favorite: Yup.string().required('*favorit wajib diisi'),
    price: Yup.string().required('*harga wajib diisi').matches(/^[0-9]+$/, '*harga harus berupa angka'),
    show_online_catalog: Yup.string().required('*tampilkan di online catalog wajib diisi'),
    stock: Yup.string().required('*stok wajib diisi').matches(/^[0-9]+$/, '*stok harus berupa angka'),
    uom: Yup.string().required('*satuan wajib diisi'),
});

const Create = () => {
    const navigation = useNavigation()
    const { user, setRefreshTrigger } = useGlobalContext()
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [refreshing, setRefreshing] = useState(false);
    const [refetchTrigger, setRefetchTrigger] = useState(0);
    const [dataCategory, setDataCategory] = useState([])
    const [dataBrand, setDataBrand] = useState([])

    const [initialValues] = useState({
        name: '',
        barcode: '',
        brand_id: '',
        category_id: '',
        description: '',
        hpp: '',
        is_favorite: '',
        price: '',
        show_online_catalog: '',
        sku: '',
        stock: '',
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
            screen: 'ItemViewStack',
        });
    };
    /* End Alert */

    const submitAction = async (form) => {
        try {
            setIsSubmitting(true)
            const response = await fetchData(`${API_HOST}/item/create`, {
                method: 'post',
                headers: {
                    'X-access-token': user.token,
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                },
                data: {
                    name: form.name,
                    barcode: form.barcode,
                    brand_id: parseInt(form.brand_id),
                    category_id:  parseInt(form.category_id),
                    description: form.description,
                    hpp: parseInt(form.hpp),
                    is_favorite: form.is_favorite,
                    price: parseInt(form.price),
                    show_online_catalog: form.show_online_catalog,
                    sku: form.sku,
                    stock: parseInt(form.stock),
                    uom: form.uom
                },
            });

            if (response.code) {
                if (response.code === 200) {
                    showAlert('Notifikasi', 'Produk berhasil ditambah.');
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
        const getDataCategory = async () => {
            try {
                const response = await fetchData(`${API_HOST}/item-category/list/store`,
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
                        setDataCategory(formattedData);
                    }
                } else {
                    Alert.alert(response.message)
                }
            } catch (error) {
                Alert.alert(error.message);
            }
        }

        getDataCategory();

        const getDataBrand = async () => {
            try {
                const response = await fetchData(`${API_HOST}/item-brand/list/store`,
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
                        setDataBrand(formattedData);
                    }
                } else {
                    Alert.alert(response.message)
                }
            } catch (error) {
                Alert.alert(error.message);
            }
        }

        getDataBrand();

    }, [refetchTrigger]);

    return (
        <ScrollView className="bg-primary" refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}>
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
                                title="Nama Produk"
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

                            <SelectField
                                title="Kategori"
                                data={dataCategory}
                                value={values.category_id}
                                onValueChange={(value) => setFieldValue('category_id', value)}
                                handleChangeText={handleChange('category_id')}
                                handleBlur={handleBlur('category_id')}
                                placeholder="Pilih Kategori"
                                otherStyles="mt-2"
                                dropdownPosition="bottom"
                                testId="txt004"
                            />
                            {touched.category_id && errors.category_id && <Text className="text-gray-50">{errors.category_id}</Text>}

                            <SelectField
                                title="Merek"
                                data={dataBrand}
                                value={values.brand_id}
                                onValueChange={(value) => setFieldValue('brand_id', value)}
                                handleChangeText={handleChange('brand_id')}
                                handleBlur={handleBlur('brand_id')}
                                placeholder="Pilih Merek"
                                otherStyles="mt-2"
                                dropdownPosition="bottom"
                                testId="txt005"
                            />
                            {touched.brand_id && errors.brand_id && <Text className="text-gray-50">{errors.brand_id}</Text>}

                            <FormField
                                title="Deskripsi"
                                value={values.description}
                                handleChangeText={handleChange('description')}
                                handleBlur={handleBlur('description')}
                                otherStyles="mt-2"
                                multiline={true}
                                numberOfLines={4}
                                testId="txt006"
                            />
                            {touched.description && errors.description && <Text className="text-gray-50">{errors.description}</Text>}

                            <FormField
                                title="Harga Pokok Penjualan (HPP)"
                                value={values.hpp}
                                handleChangeText={handleChange('hpp')}
                                handleBlur={handleBlur('hpp')}
                                otherStyles="mt-2"
                                testId="txt007"
                                keyboardType={"number-pad"}
                            />
                            {touched.hpp && errors.hpp && <Text className="text-gray-50">{errors.hpp}</Text>}

                            <FormField
                                title="Harga"
                                value={values.price}
                                handleChangeText={handleChange('price')}
                                handleBlur={handleBlur('price')}
                                otherStyles="mt-2"
                                testId="txt008"
                                keyboardType={"number-pad"}
                            />
                            {touched.price && errors.price && <Text className="text-gray-50">{errors.price}</Text>}

                            <FormField
                                title="Stok"
                                value={values.stock}
                                handleChangeText={handleChange('stock')}
                                handleBlur={handleBlur('stock')}
                                otherStyles="mt-2"
                                testId="txt009"
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
                                testId="txt010"
                            />
                            {touched.uom && errors.uom && <Text className="text-gray-50">{errors.uom}</Text>}

                            <SelectField
                                title="Produk Favorit"
                                value={values.is_favorite}
                                onValueChange={(value) => setFieldValue('is_favorite', value)}
                                handleChangeText={handleChange('is_favorite')}
                                handleBlur={handleBlur('is_favorite')}
                                placeholder="Produk Favorit"
                                otherStyles="mt-2"
                                dropdownPosition="bottom"
                                testId="txt011"
                            />
                            {touched.is_favorite && errors.is_favorite && <Text className="text-gray-50">{errors.is_favorite}</Text>}

                            <SelectField
                                title="Tampilkan di Katalog Online"
                                value={values.show_online_catalog}
                                onValueChange={(value) => setFieldValue('show_online_catalog', value)}
                                handleChangeText={handleChange('show_online_catalog')}
                                handleBlur={handleBlur('show_online_catalog')}
                                otherStyles="mt-2"
                                dropdownPosition="top"
                                testId="txt012"
                            />
                            {touched.show_online_catalog && errors.show_online_catalog && <Text className="text-gray-50">{errors.show_online_catalog}</Text>}
                        
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