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
    brand_id: Yup.string().required('*merek wajib diisi'),
    category_id: Yup.string().required('*kategori wajib diisi'),
    description: Yup.string().required('*deskripsi wajib diisi'),
    is_favorite: Yup.string().required('*favorit wajib diisi'),
    show_online_catalog: Yup.string().required('*tampilkan di online catalog wajib diisi'),
});

const Edit = () => {
    const route = useRoute();
    const { id } = route.params;
    const navigation = useNavigation()
    const { user, setRefreshTrigger } = useGlobalContext()
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [refreshing, setRefreshing] = useState(false);
    const [refetchTrigger, setRefetchTrigger] = useState(0);
    const [dataCategory, setDataCategory] = useState([])
    const [dataBrand, setDataBrand] = useState([])
    const [uploading, setUploading] = useState(false);

    const [initialValues, setInitialValues] = useState({
        name: '',
        brand_id: '',
        category_id: '',
        description: '',
        is_favorite: '',
        show_online_catalog: '',
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
            screen: 'ItemViewStack',
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
            const response = await fetchData(`${API_HOST}/item/update`, {
                method: 'put',
                headers: {
                    'X-access-token': user.token,
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                },
                data: {
                    id: id,
                    name: form.name,
                    brand_id: parseInt(form.brand_id),
                    category_id: parseInt(form.category_id),
                    description: form.description,
                    is_favorite: form.is_favorite,
                    show_online_catalog: form.show_online_catalog,
                },
            });

            if (response.code) {
                if (response.code === 200) {
                    showAlert('Notifikasi', 'Produk berhasil diubah.');
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
            const response = await fetchData(`${API_HOST}/item/delete/${id}`, {
                method: 'delete',
                headers: {
                    'X-access-token': user.token,
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                },
            });

            if (response.code) {
                if (response.code === 200) {
                    showAlert('Notifikasi', 'Produk berhasil dihapus.');
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
        formData.append('item_id', id);

        try {
            const response = await fetchData(`${API_HOST}/item/photo/`, {
                headers: {
                    'X-access-token': storedTokenUser,
                    'Content-Type': 'multipart/form-data',
                },
                method: 'put',
                data: formData
            });
            if (response.code == 200) {
                showAlert('Notifikasi', 'Gambat Produk berhasil diubah.');
            } else {
                showAlert('Notifikasi', 'Gambar Produk gagal diubah.');
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
                const response = await fetchData(`${API_HOST}/item/${id}`,
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
                            brand_id: (response.data.brand_id).toString() || '',
                            category_id: (response.data.category_id).toString() || '',
                            description: response.data.description || '',
                            is_favorite: response.data.is_favorite || '',
                            show_online_catalog: response.data.show_online_catalog || '',
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
                                    source={{ uri: `${API_HOST}/item/images/${initialValuesPhoto.photo}` }}
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
                                title="Nama Produk"
                                value={values.name}
                                handleChangeText={handleChange('name')}
                                handleBlur={handleBlur('name')}
                                otherStyles="mt-0"
                                testId="txt001"
                                editable={user?.is_head_office == 'YA' ? true : false}
                            />
                            {touched.name && errors.name && <Text className="text-gray-50">{errors.name}</Text>}

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
                                testId="txt002"
                                disable={user?.is_head_office == 'YA' ? false : true}
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
                                testId="txt003"
                                disable={user?.is_head_office == 'YA' ? false : true}
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
                                testId="txt004"
                                editable={user?.is_head_office == 'YA' ? true : false}
                            />
                            {touched.description && errors.description && <Text className="text-gray-50">{errors.description}</Text>}

                            <SelectField
                                title="Produk Favorit"
                                value={values.is_favorite}
                                onValueChange={(value) => setFieldValue('is_favorite', value)}
                                handleChangeText={handleChange('is_favorite')}
                                handleBlur={handleBlur('is_favorite')}
                                placeholder="Produk Favorit"
                                otherStyles="mt-2"
                                dropdownPosition="bottom"
                                testId="txt005"
                                disable={user?.is_head_office == 'YA' ? false : true}
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
                                testId="txt006"
                                disable={user?.is_head_office == 'YA' ? false : true}
                            />
                            {touched.show_online_catalog && errors.show_online_catalog && <Text className="text-gray-50">{errors.show_online_catalog}</Text>}

                            {user?.is_head_office == 'YA' &&
                                <View>
                                    <CustomButton
                                        title="Simpan"
                                        handlePress={handleSubmit}
                                        containerStyles={"mt-7 bg-secondary-200"}
                                        textStyles="text-white"
                                        isLoading={isSubmitting}
                                        testId="btn001"
                                    />
                                    <CustomButton
                                        title="Hapus Produk"
                                        handlePress={() => showAlertConfirm('Konfirmasi', 'Apakah Anda yakin ingin menghapus produk ini?')}
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