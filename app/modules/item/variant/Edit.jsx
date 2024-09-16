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
import SelectField from '../../../../components/SelectField'
import AlertConfirmModal from '../../../../components/AlertConfirmModal'
import { Image } from 'react-native'
import { TouchableOpacity } from 'react-native'
import { icons } from '../../../../constants'
import { Button } from 'react-native'
import * as DocumentPicker from "expo-document-picker";
import * as SecureStore from 'expo-secure-store';

const validationSchema = Yup.object().shape({
    name: Yup.string().required('*nama produk wajib diisi'),
    hpp: Yup.string().required('*hpp wajib diisi').matches(/^[0-9]+$/, '*hpp harus berupa angka'),
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
    const [uploading, setUploading] = useState(false);

    const [initialValues, setInitialValues] = useState({
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

    const [initialValuesPhoto, setInitialValuesPhoto] = useState({
        photo: ''
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
            const response = await fetchData(`${API_HOST}/item-variant/update`, {
                method: 'put',
                headers: {
                    'X-access-token': user.token,
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                },
                data: {
                    id: id,
                    name: form.name,
                    barcode: form.barcode,
                    hpp: parseInt(form.hpp) || 0,
                    price: parseInt(form.price) || 0,
                    sku: form.sku,
                    stock: parseInt(form.stock) || 0,
                    minimum_stock: parseInt(form.minimum_stock) || 0,
                    is_notify_stock: form.is_notify_stock,
                    uom: form.uom
                },
            });

            if (response.code) {
                if (response.code === 200) {
                    showAlert('Notifikasi', 'Variasi Produk berhasil diubah.');
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
            const response = await fetchData(`${API_HOST}/item-variant/delete/${id}`, {
                method: 'delete',
                headers: {
                    'X-access-token': user.token,
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                },
            });

            if (response.code) {
                if (response.code === 200) {
                    showAlert('Notifikasi', 'Variasi Produk berhasil dihapus.');
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

    /* Image Picker */
    const MAX_SIZE = 2 * 1024 * 1024;
    const openPicker = async (selectType) => {
        const result = await DocumentPicker.getDocumentAsync({
            type: ["image/png", "image/jpeg"],
        });

        if (!result.canceled) {
            if (result.assets[0].size > MAX_SIZE) {
                Alert.alert("Warning!", "File terlalu besar. Maksimal 2 MB.");
                return;
            } else {
                if (selectType === "image") {
                    setInitialValuesPhoto({
                        ...initialValuesPhoto,
                        photo: result.assets[0],
                    });
                }
            }
        }
    };

    const submitActionImages = async () => {
        if (
            !initialValuesPhoto.photo.uri
        ) {
            return Alert.alert("Warning!", "Gambar tidak boleh kosong.");
        }

        setUploading(true);

        const storedTokenUser = await SecureStore.getItemAsync('userToken');

        const formData = new FormData();
        formData.append('photo', {
            uri: initialValuesPhoto.photo.uri,
            name: initialValuesPhoto.photo.name,
            type: initialValuesPhoto.photo.mimeType || 'application/octet-stream', // Default to a binary type
        });
        formData.append('variant_id', id);

        try {
            const response = await fetchData(`${API_HOST}/item-variant/photo/`, {
                headers: {
                    'X-access-token': storedTokenUser,
                    'Content-Type': 'multipart/form-data',
                },
                method: 'put',
                data: formData
            });
            if (response.code == 200) {
                showAlert('Notifikasi', 'Variasi produk berhasil diubah.');
            } else {
                showAlert('Notifikasi', 'Variasi produk gagal diubah.');
            }
        } catch (error) {
            Alert.alert("Notifikasi", error.message)
        } finally {
            setUploading(false);
        }
    };

    /* End Image Picker */

    const onRefresh = () => {
        setRefreshing(true);
        setRefetchTrigger(prev => prev + 1);
        setRefreshing(false);
    }

    useEffect(() => {
        const getData = async (id) => {
            try {
                const response = await fetchData(`${API_HOST}/item-variant/${id}`,
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
                            barcode: response.data.barcode || '',
                            hpp: (response.data.hpp).toString() || '',
                            price: (response.data.price).toString() || '',
                            sku: response.data.sku || '',
                            stock: (response.data.stock).toString() || '',
                            minimum_stock: (response.data.minimum_stock).toString() || '',
                            is_notify_stock: response.data.is_notify_stock || '',
                            uom: response.data.uom || '',
                        });

                        setInitialValuesPhoto({
                            photo: response.data.photo || '',
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
                    initialValues={initialValuesPhoto}
                    onSubmit={() => {
                        submitActionImages()
                    }}
                    enableReinitialize
                >
                    {({ handleSubmit }) => (
                        <View>
                            {!initialValuesPhoto.photo.uri &&
                                <Image
                                    source={{ uri: `${API_HOST}/variant/images/${initialValuesPhoto.photo}` }}
                                    resizeMode="cover"
                                    className="w-[150px] h-[150px] rounded-2xl mb-4"
                                />
                            }

                            {initialValuesPhoto.photo.uri && <Image source={{ uri: initialValuesPhoto.photo.uri }} className="w-[150px] h-[150px] rounded-2xl mb-4" resizeMode='cover' />}

                            {user?.is_head_office == 'YA' &&
                                <View>
                                    <TouchableOpacity onPress={() => openPicker("image")}>
                                        <View className="w-[150px] h-[40px] mb-3 px-4 bg-primary  border-2 border-gray-200 flex justify-center items-center flex-row space-x-2">
                                            <Image
                                                source={icons.upload}
                                                resizeMode="contain"
                                                alt="upload"
                                                className="w-5 h-5"
                                            />
                                            <Text className="text-sm text-gray-100 font-poppinsMedium" testID="btn002">
                                                Pilih Gambar
                                            </Text>
                                        </View>
                                    </TouchableOpacity>
                                    <View className="w-[150px] bg-primary rounded-2xl ">
                                        <Button title={uploading ? "Uploading..." : "Upload"} onPress={handleSubmit} isLoading={uploading} testID="btn003" />
                                    </View>
                                </View>
                            }
                        </View>
                    )}
                </Formik>

                <View className="w-full h-0.5 mt-5 bg-gray-200 mb-5" />

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
                                otherTextInputStyles={user?.is_head_office == 'YA' ? "" : "bg-gray-200"}
                                editable={user?.is_head_office == 'YA' ? true : false}
                                testId="txt001"
                            />
                            {touched.name && errors.name && <Text className="text-gray-50">{errors.name}</Text>}

                            <FormField
                                title="Barcode"
                                value={values.barcode}
                                handleChangeText={handleChange('barcode')}
                                handleBlur={handleBlur('barcode')}
                                otherStyles="mt-2"
                                otherTextInputStyles={user?.is_head_office == 'YA' ? "" : "bg-gray-200"}
                                editable={user?.is_head_office == 'YA' ? true : false}
                                testId="txt002"
                            />

                            <FormField
                                title="SKU"
                                value={values.sku}
                                handleChangeText={handleChange('sku')}
                                handleBlur={handleBlur('sku')}
                                otherStyles="mt-2"
                                otherTextInputStyles={user?.is_head_office == 'YA' ? "" : "bg-gray-200"}
                                editable={user?.is_head_office == 'YA' ? true : false}
                                testId="txt003"
                            />

                            <FormField
                                title="Harga Pokok Penjualan (HPP)"
                                value={values.hpp}
                                handleChangeText={handleChange('hpp')}
                                handleBlur={handleBlur('hpp')}
                                otherStyles="mt-2"
                                editable={user?.is_head_office == 'YA' ? true : false}
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
                                editable={user?.is_head_office == 'YA' ? true : false}
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
                                editable={user?.is_head_office == 'YA' ? true : false}
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
                                editable={user?.is_head_office == 'YA' ? true : false}
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
                                disable={user?.is_head_office == 'YA' ? false : true}
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
                                otherTextInputStyles={user?.is_head_office == 'YA' ? "" : "bg-gray-200"}
                                editable={user?.is_head_office == 'YA' ? true : false}
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
                            {user?.is_head_office == 'YA' &&
                                <View>

                                    <CustomButton
                                        title="Hapus Variasi Produk"
                                        handlePress={() => showAlertConfirm('Konfirmasi', 'Apakah Anda yakin ingin menghapus variasi produk ini?')}
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