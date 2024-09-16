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
import { useRoute } from '@react-navigation/native';
import AlertConfirmModal from '../../../../components/AlertConfirmModal'
import AlertModal from '../../../../components/AlertModal'

const validationSchema = Yup.object().shape({
    name: Yup.string().required('*nama toko wajib diisi'),
});

const Edit = () => {
    const route = useRoute();
    const { id } = route.params;

    const navigation = useNavigation()
    const { user, setRefreshTrigger } = useGlobalContext()
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [initialValues, setInitialValues] = useState({
        name: '',
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
        navigation.navigate('Item', {
            screen: 'ItemCategoryStack',
        });
    };
    /* End Alert */

    useEffect(() => {
        const getData = async (id) => {
            try {
                const response = await fetchData(`${API_HOST}/item-category/${id}`,
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
            const response = await fetchData(`${API_HOST}/item-category/update`, {
                method: 'put',
                headers: {
                    'X-access-token': user.token,
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                },
                data: {
                    id: id,
                    name: form.name,
                },
            });

            if (response.code) {
                if (response.code === 200) {
                    showAlert('Notifikasi', 'Kategori produk berhasil diubah.');
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
            const response = await fetchData(`${API_HOST}/item-category/delete/${id}`, {
                method: 'delete',
                headers: {
                    'X-access-token': user.token,
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                },
            });

            if (response.code) {
                if (response.code === 200) {
                    showAlert('Notifikasi', 'Kategori produk berhasil dihapus.');
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
                                    title="Hapus Kategori"
                                    handlePress={() => showAlertConfirm('Konfirmasi', 'Apakah Anda yakin ingin menghapus kategori ini?')}
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