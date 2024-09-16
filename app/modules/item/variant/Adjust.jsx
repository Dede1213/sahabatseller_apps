import { ScrollView, Text, View, Alert, StyleSheet, TextInput } from 'react-native'
import React, { useEffect, useState } from 'react'
import CustomButton from '../../../../components/CustomButton'
import { useGlobalContext } from '../../../../context/globalProvider'
import { fetchData } from '../../../../lib/fetchData'
import { API_HOST } from '@env';
import { FieldArray, Formik } from 'formik';
import { useNavigation } from '@react-navigation/native'
import AlertModal from '../../../../components/AlertModal'
import { RefreshControl } from 'react-native'
import { CapitalizeEachWord, FormatAmount } from '../../../../lib/globalFunction'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { TouchableOpacity } from 'react-native'

const Adjust = () => {

    const navigation = useNavigation()
    const { user, setRefreshTrigger, itemId } = useGlobalContext()
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [refreshing, setRefreshing] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [refetchTrigger, setRefetchTrigger] = useState(0);

    const [initialValues, setInitialValues] = useState({
        products: [],
    });

    /* Alert */
    const [isAlertVisible, setIsAlertVisible] = useState(false);
    const [alertMessage, setAlertMessage] = useState('');
    const [alertTitle, setAlertTitle] = useState('');
    const [redirect, setRedirect] = useState(false);
    const showAlert = (title, message) => {
        setAlertTitle(title);
        setAlertMessage(message);
        setIsAlertVisible(true);
    };
    const closeAlert = () => {
        setIsAlertVisible(false);
        if (redirect) {
            setRefreshTrigger(true)
            navigation.navigate('Item', {
                screen: 'ItemViewStack',
            });
        }
    };
    /* End Alert */

    const submitAction = async (form) => {
        let checkdata = 0;
        for (let i = 0; i < form.products.length; i++) {
            if (form.products[i].stock > 0 && form.products[i].hpp == 0) {
                showAlert('Notifikasi', `Hpp ${form.products[i].name} wajib diisi`)
                return
            }

            if (form.products[i].stock == 0 && form.products[i].hpp > 0) {
                showAlert('Notifikasi', `Stock ${form.products[i].name} wajib diisi`)
                return
            }

            if (form.products[i].stock > 0 && form.products[i].hpp > 0) {
                checkdata++
            }
        }

        if (checkdata == 0) {
            showAlert('Notifikasi', 'Salah satu data wajib diisi')
            return
        }

        try {
            setIsSubmitting(true)
            const response = await fetchData(`${API_HOST}/item-variant/adjust`, {
                method: 'put',
                headers: {
                    'X-access-token': user.token,
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                },
                data: {
                    product: form.products
                },
            });

            if (response.code) {
                if (response.code === 200) {
                    setRedirect(true);
                    showAlert('Notifikasi', 'Stok berhasil ditambah.');
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
        const getData = async () => {
            try {
                const response = await fetchData(`${API_HOST}/item-variant/store/item?item_id=${itemId}&page=1&limit=100`,
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
                        setRefreshTrigger(false);
                        setInitialValues({
                            products: response.data.rows.map(product => ({
                                id: product.id,
                                stock: 0,
                                hpp: 0,
                                name: product.name,
                                current_stock: product.stock,
                                current_hpp: product.hpp
                            })),
                        })
                        setIsLoading(false);
                    }
                } else {
                    Alert.alert(response.message)
                }
            } catch (error) {
                Alert.alert(error.message);
            }
        };

        getData();

    }, [refetchTrigger]);

    return (
        <ScrollView className="bg-primary" refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}>
            <View className="w-full justify-center px-4 bg-primary mt-5">
                <AlertModal visible={isAlertVisible} header={alertTitle} message={alertMessage} onClose={closeAlert} />
                <Formik
                    initialValues={initialValues}
                    onSubmit={(values) => {
                        submitAction(values);
                    }}
                    enableReinitialize
                >
                    {({ handleChange, handleBlur, handleSubmit, values, errors, touched, setFieldValue }) => (
                        <View>

                            <FieldArray
                                name="products"
                                render={arrayHelpers => (
                                    <View>
                                        <View className='rounded-2xl min-h-[30px] justify-center items-center bg-gray-100 w-[80px] mb-3'>
                                            <TouchableOpacity className="flex-row items-center" onPress={() => Alert.alert("Informasi", "HPP akan menghitung nilai rata-rata jika stok sebelum nya masih ada.")}>
                                                <Icon name={'information-outline'} color="#ffffff" size={23} />
                                                <Text className="text-base font-PoppinsRegular text-white">Info</Text>
                                            </TouchableOpacity>
                                        </View>
                                        {values.products?.map((product, index) => (
                                            <View key={product.id}>
                                                <View className="flex-row">
                                                    <Text className="text-base font-PoppinsMedium text-gray-100 mb-1 mt-2">{CapitalizeEachWord(product.name ? product.name : '')} (stok: {product.current_stock}    hpp: {FormatAmount(product.current_hpp)})</Text>
                                                </View>
                                                <View className="flex-row">
                                                    <View className="flex-1">
                                                        <View className={`border-2 border-gray-200 px-4 rounded-xl focus:border-secondary items-center`}>
                                                            <TextInput
                                                                className="flex-1 text-gray-100 font-poppinsSemiBold text-base w-full"
                                                                value={product.stock.toString()}
                                                                placeholder="Stok"
                                                                placeholderTextColor="#7b7b8b"
                                                                onChangeText={(text) => {
                                                                    const stock = Number(text);
                                                                    arrayHelpers.replace(index, { ...product, stock });
                                                                }}
                                                                keyboardType="number-pad"
                                                                testID={''}
                                                            />
                                                        </View>
                                                    </View>
                                                    <View className="flex-1">
                                                        <View className={`border-2 border-gray-200 px-4 rounded-xl focus:border-secondary items-center ml-2`}>
                                                            <TextInput
                                                                className="flex-1 text-gray-100 font-poppinsSemiBold text-base w-full"
                                                                value={product.hpp.toString()}
                                                                placeholder="HPP"
                                                                placeholderTextColor="#7b7b8b"
                                                                onChangeText={(text) => {
                                                                    const hpp = Number(text);
                                                                    arrayHelpers.replace(index, { ...product, hpp });
                                                                }}
                                                                keyboardType="number-pad"
                                                                testID={''}
                                                            />

                                                        </View>
                                                    </View>

                                                </View>
                                            </View>
                                        ))}
                                    </View>
                                )}
                            />

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

styles = StyleSheet.create({
    inputContainer: {
        marginBottom: 12,
    },
    label: {
        fontSize: 16,
        marginBottom: 4,
    },
    input: {
        borderColor: '#ccc',
        borderWidth: 1,
        padding: 8,
        fontSize: 16,
    },
    error: {
        color: 'red',
        fontSize: 12,
    },
})

export default Adjust