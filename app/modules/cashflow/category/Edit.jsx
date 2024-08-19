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
import { ConfirmAlert } from '../../../../lib/globalFunction'

const validationSchema = Yup.object().shape({
    name: Yup.string().required('*nama toko wajib diisi'),
});

const Edit = () => {
    const route = useRoute();
    const { id } = route.params;

    const navigation = useNavigation()
    const { user } = useGlobalContext()
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [isDeleting, setIsDeleting] = useState(false)
    const [initialValues, setInitialValues] = useState({
        name: '',
    });


    useEffect(() => {
        const getData = async (id) => {
            try {
                const response = await fetchData(`${API_HOST}/cash-flow-category/${id}`,
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
            const response = await fetchData(`${API_HOST}/cash-flow-category/update`, {
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
                    Alert.alert('Notifikasi', 'Kategori berhasil diubah.')
                    navigation.navigate('CashFlow', {
                        screen: 'CatFlowViewStack',
                    });
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
            setIsDeleting(true)
            const response = await fetchData(`${API_HOST}/cash-flow-category/delete/${id}`, {
                method: 'delete',
                headers: {
                    'X-access-token': user.token,
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                },
            });

            if (response.code) {
                if (response.code === 200) {
                    Alert.alert('Notifikasi', 'Kategori berhasil dihapus.')
                    navigation.navigate('CashFlow', {
                        screen: 'CatFlowViewStack',
                    });
                }
            } else {
                Alert.alert(response.message)
            }
        } catch (error) {
            Alert.alert(error.message)
        } finally {
            setIsDeleting
        }
    };

    return (
        <ScrollView className="bg-primary">
            <View className="w-full justify-center px-4 bg-primary mt-5">
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
                                title="Nama Kategori"
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
                                    title="Hapus Lokasi"
                                    handlePress={() => ConfirmAlert("Konfirmasi", "Apakah Anda yakin ingin menghapus kategori ini?", handleDelete)}
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