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

const validationSchema = Yup.object().shape({
    name: Yup.string().required('*nama toko wajib diisi'),
});

const Create = () => {
    const navigation = useNavigation()
    const { user, setRefreshTrigger } = useGlobalContext()
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [initialValues] = useState({
        name: '',
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
        navigation.navigate('CashFlow', {
            screen: 'CatFlowViewStack',
        });
    };
    /* End Alert */

    const submitAction = async (form) => {
        try {
            setIsSubmitting(true)
            const response = await fetchData(`${API_HOST}/cash-flow-category/create`, {
                method: 'post',
                headers: {
                    'X-access-token': user.token,
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                },
                data: {
                    name: form.name,
                },
            });

            if (response.code) {
                if (response.code === 200) {
                    showAlert('Notifikasi', 'Kategori arus kas berhasil ditambah.');
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
                                title="Nama Kategori"
                                value={values.name}
                                placeholder="ex: Operasional,Pendanaan dll"
                                handleChangeText={handleChange('name')}
                                handleBlur={handleBlur('name')}
                                otherStyles="mt-0"
                                testId="txt001"
                            />
                            {touched.name && errors.name && <Text className="text-gray-50">{errors.name}</Text>}

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