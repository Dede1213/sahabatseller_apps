import { ScrollView, Text, View, Alert, RefreshControl } from 'react-native'
import React, { useEffect, useState } from 'react'
import FormField from '../../../../components/FormField'
import CustomButton from '../../../../components/CustomButton'
import { useGlobalContext } from '../../../../context/globalProvider'
import { fetchData } from '../../../../lib/fetchData'
import { API_HOST } from '@env';
import { Field, Formik } from 'formik';
import * as Yup from 'yup';
import { useNavigation, useRoute } from '@react-navigation/native'
import SelectField from '../../../../components/SelectField'
import AlertModal from '../../../../components/AlertModal'
import AlertConfirmModal from '../../../../components/AlertConfirmModal'
import { TouchableOpacity } from 'react-native'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { FormatAmount, FormatDateForQuery, UnFormatAmount } from '../../../../lib/globalFunction'
import { TextInput } from 'react-native'
import { get } from 'react-native/Libraries/TurboModule/TurboModuleRegistry'

const validationSchema = Yup.object().shape({
    // category: Yup.string().required('*kategori toko wajib diisi'),
    // type: Yup.string().required('*tipe wajib diisi'),
    // amount: Yup.string().matches(/^[0-9]+$/, '*nominal harus berupa angka').required('*nominal wajib diisi'),
});

const Variant = () => {
    const route = useRoute();
    const { id } = route.params;

    const navigation = useNavigation()
    const { user, setRefreshTrigger, setTransaction } = useGlobalContext()
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [refreshing, setRefreshing] = useState(false);
    const [refetchTrigger, setRefetchTrigger] = useState(0);
    const [dataVariant, setDataVariant] = useState([]);
    const [variantList, setVariantList] = useState([]);
    const [isSpecialPrice, setIsSpecialPrice] = useState(false);
    const [isPercent, setIsPercent] = useState(true);
    const [dataWholeSale, setDataWholeSale] = useState([]);
    const [wholesaleList, setWholesaleList] = useState('');
    const [dataDiscount, setDataDiscount] = useState([]);
    const [isProgramDiscount, setIsProgramDiscount] = useState(false);
    const [isWholesale, setIsWholesale] = useState(false);

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
    };
    /* End Alert */

    const [initialValues, setInitialValues] = useState({
        item_id: id,
        item_name: '',
        brand_id: '',
        brand_name: '',
        category_id: '',
        category_name: '',
        variant_id: '',
        variant_name: '',
        barcode: '',
        stock: 0,
        sku: '',
        hpp: '',
        quantity: 1,
        uom: '',
        price_origin: 0,
        price: 0,
        discount: '',
        discount_type: '',
        discount_item_amount: 0,
        sub_total: 0,
        is_spesial_price: '',
        is_whole_sale: '',
        is_bundling: '',
    });

    const onRefresh = () => {
        setRefreshing(true);
        setRefetchTrigger(prev => prev + 1);
        setRefreshing(false);
    }

    useEffect(() => {
        const getData = async (id) => {
            try {
                const response = await fetchData(`${API_HOST}/item-variant/store/list/${id}`,
                    {
                        headers: {
                            'X-access-token': user.token,
                            'Content-Type': 'application/json',
                            'Accept': 'application/json',
                        },
                        method: 'get',
                    });

                if (response.code) {
                    if (response.code == 200) {
                        const formattedData = response.data.map(item => ({
                            label: item.name + '  ( ' + FormatAmount(item.stock) + ' ' + item.sku + ' )',
                            value: item.id,
                        }));
                        setVariantList(formattedData);
                        setDataVariant(response.data);
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

    const submitAction = async (form) => {
        setTransaction(prevTransaction => ({
            ...prevTransaction,
            items: [...prevTransaction.items, form]
        }));

        navigation.navigate('Transaction', {
            screen: 'CreateTransactionStack',
        });
    }

    const getDataWholeSale = async (id) => {
        try {
            const response = await fetchData(`${API_HOST}/item-wholesale/variant?id=${id}`,
                {
                    headers: {
                        'X-access-token': user.token,
                        'Content-Type': 'application/json',
                        'Accept': 'application/json',
                    },
                    method: 'get',
                });

            if (response.code) {
                if (response.code == 200) {
                    if (response.data.length > 0) {
                        setIsWholesale(true);
                        setDataWholeSale(response.data);
                        let wholesaleMessage = '';
                        response.data.map(item => {
                            wholesaleMessage += "Min.Qty : " + item.min_order + " - Harga Satuan : " + FormatAmount(item.price ? item.price : 0) + "\n";
                        });
                        setWholesaleList(wholesaleMessage);
                        return response.data;
                    } else {
                        setIsWholesale(false);
                        setWholesaleList('');
                        setDataWholeSale([]);
                        return true
                    }
                }
            } else {
                Alert.alert(response.message)
            }
        } catch (error) {
            Alert.alert(error.message);
        }
    };

    const getDataDiscount = async (id) => {
        try {
            const response = await fetchData(`${API_HOST}/discount/item/check?id=${id}`,
                {
                    headers: {
                        'X-access-token': user.token,
                        'Content-Type': 'application/json',
                        'Accept': 'application/json',
                    },
                    method: 'get',
                });

            if (response.code) {
                if (response.code == 200) {
                    if (response.data.length > 0) {
                        setIsProgramDiscount(true);
                        setDataDiscount(response.data);
                        return response.data;
                    }
                }
            } else {
                Alert.alert(response.message)
            }
        } catch (error) {
            Alert.alert(error.message);
        }
    };

    const variantChange = async (value, resetForm) => {
        setIsPercent(true);
        setIsWholesale(false);
        setIsSpecialPrice(false);
        setIsProgramDiscount(false);

        let discount = 0
        let discount_type = ''
        let max_amount = 0
        let min_order = 0
        let disc_amount = 0

        let dataDiscountTmp = await getDataDiscount(value);

        if (dataDiscountTmp) {
            if (dataDiscountTmp.length > 0) {
                if (dataDiscountTmp[0].discount_type == 'PERSEN') {
                    setIsPercent(true);
                } else {
                    setIsPercent(false);
                }
                discount = dataDiscountTmp[0].discount
                discount_type = dataDiscountTmp[0].discount_type
                max_amount = dataDiscountTmp[0].maximum_amount
                min_order = dataDiscountTmp[0].minimum_amount
            }
        } else {
            setIsPercent(true);
        }

        const selectedVariant = dataVariant.find(item => item.id == value);
        disc_amount = dataDiscountTmp ? discount_type == 'PERSEN' ? (selectedVariant.price * discount) / 100 : (selectedVariant.price - discount) : 0
        disc_amount = selectedVariant.price - disc_amount > max_amount ? max_amount : selectedVariant.price - disc_amount

        let subTotal = selectedVariant.price - disc_amount
        if (selectedVariant.price < min_order) {
            discount = 0
            subTotal = selectedVariant.price
        }

        if (selectedVariant.is_whole_sale == "YA") {
            await getDataWholeSale(value);
        }

        setInitialValues({
            item_id: selectedVariant.item_id,
            item_name: selectedVariant.item_name,
            brand_id: selectedVariant.brand_id,
            brand_name: selectedVariant.brand_name,
            category_id: selectedVariant.category_id,
            category_name: selectedVariant.category_name,
            variant_id: selectedVariant.id,
            variant_name: selectedVariant.name,
            barcode: selectedVariant.barcode,
            stock: selectedVariant.stock,
            sku: selectedVariant.sku,
            hpp: selectedVariant.hpp,
            quantity: 1,
            uom: selectedVariant.uom,
            price_origin: selectedVariant.price,
            price: selectedVariant.price,
            discount: discount,
            discount_type: discount_type,
            discount_item_amount: disc_amount,
            sub_total: subTotal,
            is_spesial_price: 'TIDAK',
            is_whole_sale: selectedVariant.is_whole_sale,
            is_bundling: selectedVariant.is_bundling,
        });

        resetForm({ values: initialValues });
    }

    const handleDiscount = async (value, resetForm) => {
        if (initialValues.price > 0) {
            if (typeof value == 'string' && value.includes('.')) {
                value = UnFormatAmount(value);
            } else {
                value = parseInt(value == '' ? 0 : value);
            }

            let discount_item_amount = 0;
            let discount = isPercent ? value > 100 ? 100 : value : value;
            let price = initialValues.price ? parseInt(initialValues.price) : 0;
            let quantity = initialValues.quantity ? parseInt(initialValues.quantity) : 0;
            if (isPercent) {
                discount_item_amount = (price * discount) / 100;
            } else {
                discount_item_amount = discount;
            }

            const newPrice = price - discount_item_amount;
            const subTotal = newPrice * quantity;

            if (isPercent) {
                setInitialValues((prev) => ({ ...prev, discount_type: 'PERSEN', sub_total: subTotal, discount: discount, discount_item_amount: discount_item_amount }));
            } else {
                setInitialValues((prev) => ({ ...prev, discount_type: 'NOMINAL', sub_total: subTotal, discount: discount, discount_item_amount: discount_item_amount }));
            }
        } else {
            if (isPercent) {
                setInitialValues((prev) => ({ ...prev, discount_type: 'PERSEN', discount: '', discount_item_amount: 0 }));
            } else {
                setInitialValues((prev) => ({ ...prev, discount_type: 'NOMINAL', discount: '', discount_item_amount: 0 }));
            }
        }
        resetForm({ values: initialValues });
    }

    const handleQuantity = async (value, resetForm) => {
        let quantity = value ? parseInt(value) : 0;
        let discount_item_amount = 0;
        let discount = initialValues.discount ? parseInt(initialValues.discount) : 0;
        let price = initialValues.price ? parseInt(initialValues.price) : 0;

        let currentStock = dataVariant.find(item => item.id == initialValues.variant_id).stock;

        if (quantity > currentStock) {
            quantity = currentStock;
            value = currentStock;
            showAlert('Notifikasi', 'Stok tidak mencukupi.');
        }

        if (dataWholeSale) {
            if (dataWholeSale.length > 0) {
                dataWholeSale.map(item => {
                    if (quantity >= item.min_order) {
                        price = item.price
                    }
                })
            }
        }

        if (isPercent) {
            discount_item_amount = (price * discount) / 100;
        } else {
            discount_item_amount = discount;
        }
        const newPrice = price - discount_item_amount;
        const subTotal = newPrice * quantity;

        setInitialValues((prev) => ({ ...prev, quantity: value, sub_total: subTotal, price: price }));
        resetForm({ values: initialValues });
    }

    const handleSpecialPrice = (value, resetForm) => {

        if (value) {
            if (typeof value == 'string' && value.includes('.')) {
                value = UnFormatAmount(value);
            } else {
                value = parseInt(value);
            }

            let quantity = initialValues.quantity ? parseInt(initialValues.quantity) : 0;
            let discount_item_amount = 0;
            let discount = initialValues.discount ? parseInt(initialValues.discount) : 0;
            let price = value

            if (isPercent) {
                discount_item_amount = (price * discount) / 100;
            } else {
                discount_item_amount = discount;
            }
            const newPrice = price - discount_item_amount;
            const subTotal = newPrice * quantity;

            setInitialValues((prev) => ({ ...prev, price: price, sub_total: subTotal }));
            resetForm({ values: initialValues });
        } else {
            setInitialValues((prev) => ({ ...prev, price: '', sub_total: 0 }));
            resetForm({ values: initialValues });
        }
    }

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
                    {({ handleChange, handleBlur, handleSubmit, values, errors, touched, setFieldValue, resetForm }) => (
                        <View>
                            <SelectField
                                title="Variasi Produk"
                                data={variantList}
                                value={values.variant_id}
                                onValueChange={(value) => { setFieldValue('variant_id', value); variantChange(value, resetForm); }}
                                handleChangeText={handleChange('variant_id')}
                                handleBlur={handleBlur('variant_id')}
                                placeholder="Pilih Variasi"
                                otherStyles="mt-0"
                                dropdownPosition="bottom"
                                testId="txt001"
                            />
                            {touched.category && errors.category && <Text className="text-gray-50">{errors.category}</Text>}

                            <View className="border-b-4 border-gray-200 px-4 py-4 mb-4 "></View>

                            <View className="space-y-2 flex-row">
                                <View className="flex-row items-center mr-4">
                                    <Text className="text-base font-PoppinsSemiBold text-gray-100">Jumlah Barang</Text>
                                </View>
                                <View className="flex-row items-center mt-4">
                                    {/* Decrement button */}
                                    <TouchableOpacity
                                        className="bg-gray-300 rounded-xl w-10 h-10 justify-center items-center"
                                        onPress={() => { setFieldValue('quantity', Math.max(1, values.quantity - 1)); handleQuantity(Math.max(1, values.quantity - 1), resetForm) }
                                        }
                                    >
                                        <Text className="text-xl">-</Text>
                                    </TouchableOpacity>

                                    {/* Input Field */}
                                    <TextInput
                                        value={(values.quantity).toString()}
                                        onChangeText={(value) => { setFieldValue('quantity', value); handleQuantity(value, resetForm); }}
                                        keyboardType="numeric"
                                        className="border border-gray-300 text-center mx-4 w-20 h-10 rounded"
                                    />

                                    {/* Increment button */}
                                    <TouchableOpacity
                                        className="bg-gray-300 rounded-xl w-10 h-10 justify-center items-center"
                                        onPress={() => { setFieldValue('quantity', values.quantity + 1); handleQuantity(values.quantity + 1, resetForm) }}
                                    >
                                        <Text className="text-xl">+</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>

                            <View className="border-b-4 border-gray-200 px-4 py-4 mb-4 "></View>

                            <View className="space-y-2">
                                <Text className="text-base font-PoppinsSemiBold text-gray-100">Harga Satuan</Text>
                                {/* Buttons to select Normal or Special Price */}
                                <View className="flex-row mt-4">
                                    {/* Price Input Field */}
                                    <View className="w-[60%]">
                                        <TextInput
                                            value={(values.price > 0 ? FormatAmount(values.price) : '').toString()}
                                            onChangeText={(value) => { setFieldValue('price', value); handleSpecialPrice(value, resetForm); }}
                                            editable={isSpecialPrice}
                                            keyboardType="numeric"
                                            placeholder={isSpecialPrice ? 'Harga spesial' : ''}
                                            className={`border-2 border-gray-200 rounded-xl px-4 py-2 mt-2 text-gray-100 font-poppinsSemiBold text-base focus:border-secondary ${isSpecialPrice ? 'bg-white' : 'bg-gray-200'}`}
                                        />
                                    </View>

                                    <View className="flex-row items-center">
                                        {/* Normal Price Button */}
                                        <TouchableOpacity
                                            onPress={() => {
                                                setIsSpecialPrice(false);
                                                setFieldValue('price', values.price_origin);
                                                handleSpecialPrice(values.price_origin, resetForm);
                                            }}
                                            disabled={isWholesale}
                                            className={`ml-2 mt-2 px-3 py-3 rounded-xl ${!isSpecialPrice ? 'bg-blue-500' : 'bg-gray-300'
                                                }`}
                                        >
                                            <Text className="text-white">Normal</Text>
                                        </TouchableOpacity>

                                        {/* Special Price Button */}
                                        <TouchableOpacity
                                            onPress={() => {
                                                setIsSpecialPrice(true);
                                                setFieldValue('price', '');
                                                handleSpecialPrice('', resetForm);
                                            }}
                                            disabled={isWholesale}
                                            className={`mt-2 px-3 py-3 ml-1 rounded-xl ${isSpecialPrice ? 'bg-blue-500' : 'bg-gray-300'
                                                }`}
                                        >
                                            <Text className="text-white">Spesial</Text>
                                        </TouchableOpacity>
                                    </View>
                                </View>
                                {isWholesale && (
                                    <View className="flex-row items-center">
                                        <View className="">
                                            <Icon name={'checkbox-blank-circle'} color="green" size={25} />
                                        </View>
                                        <View className="">
                                            <Text className="text-sm font-PoppinsSemiBold text-gray-100">Harga Grosir Aktif</Text>
                                        </View>
                                        <View>
                                            <TouchableOpacity className="flex-row items-center" onPress={() => showAlert("Harga Grosir", wholesaleList)}>
                                                <Icon name={'information-outline'} color="gray" size={23} />
                                                <Text className="text-base font-PoppinsRegular text-white">Info</Text>
                                            </TouchableOpacity>
                                        </View>
                                    </View>
                                )}
                            </View>

                            <View className="border-b-4 border-gray-200 px-4 py-4 mb-4 "></View>

                            <View className="space-y-2">
                                <Text className="text-base font-PoppinsSemiBold text-gray-100">Diskon Satuan</Text>

                                {/* Buttons to select Normal or Special Price */}
                                <View className="flex-row mt-4">
                                    {/* Price Input Field */}
                                    <View className="w-[60%]">
                                        {/* <Text className="text-base font-PoppinsSemiBold text-gray-100">Harga</Text> */}
                                        <TextInput
                                            value={(!isPercent ? values.discount ? FormatAmount(values.discount) : '' : values.discount == 0 ? '' : values.discount).toString()}
                                            onChangeText={(value) => { setFieldValue('discount', value); handleDiscount(value, resetForm); }}
                                            keyboardType="numeric"
                                            placeholder={isPercent ? 'Discount %' : 'Discount Nominal'}
                                            className={`border-2 border-gray-200 rounded-xl px-4 py-2 mt-2 text-gray-100 font-poppinsSemiBold text-base focus:border-secondary ${!isProgramDiscount ? 'bg-white' : 'bg-gray-200'}`}
                                            editable={!isProgramDiscount}
                                        />
                                    </View>

                                    <View className="flex-row items-center">
                                        {/* Normal Price Button */}
                                        <TouchableOpacity
                                            onPress={() => {
                                                setIsPercent(true);
                                                setFieldValue('discount', '');
                                                handleDiscount('', resetForm);
                                            }}
                                            disabled={isProgramDiscount}
                                            className={`ml-2 mt-2 px-3 py-3 rounded-xl ${isPercent ? 'bg-blue-500' : 'bg-gray-300'
                                                }`}
                                        >
                                            <Icon name={'percent'} color="#ffffff" size={23} />
                                        </TouchableOpacity>

                                        {/* Special Price Button */}
                                        <TouchableOpacity
                                            onPress={() => {
                                                setIsPercent(false);
                                                setFieldValue('discount', '');
                                                handleDiscount('', resetForm);
                                            }}
                                            disabled={isProgramDiscount}
                                            className={`mt-2 px-3 py-3 ml-1 rounded-xl ${!isPercent ? 'bg-blue-500' : 'bg-gray-300'
                                                }`}
                                        >
                                            <Text className="text-white font-bold text-base">RP</Text>
                                        </TouchableOpacity>
                                    </View>
                                </View>
                                {isProgramDiscount && (
                                    <View className="flex-row items-center">
                                        <View className="">
                                            <Icon name={'checkbox-blank-circle'} color="green" size={25} />
                                        </View>
                                        <View className="">
                                            <Text className="text-sm font-PoppinsSemiBold text-gray-100">Program Diskon Aktif</Text>
                                        </View>
                                        <View>
                                            <TouchableOpacity className="flex-row items-center" onPress={() => showAlert(dataDiscount[0].name, "Minimal Order : " + (dataDiscount[0].minimum_amount > 0 ? FormatAmount(dataDiscount[0].minimum_amount) : 0) + " \nDiskon : " + (dataDiscount[0].discount_type == "PERSEN" ? dataDiscount[0].discount + " %" : "Rp. " + FormatAmount(dataDiscount[0].discount)) + "\nMaksimal Diskon : " + (dataDiscount[0].maximum_amount > 0 ? FormatAmount(dataDiscount[0].maximum_amount) : 0))}>
                                                <Icon name={'information-outline'} color="gray" size={23} />
                                                <Text className="text-base font-PoppinsRegular text-white">Info</Text>
                                            </TouchableOpacity>
                                        </View>
                                    </View>
                                )}

                            </View>

                            <View className="border-b-4 border-gray-200 px-4 py-2 mb-4 "></View>

                            <View className="flex-row">
                                <View>
                                    <Text className="text-xl font-PoppinsSemiBold text-gray-100">Sub Total :</Text>
                                </View>
                                <View className="ml-2">
                                    <Text className="text-xl font-PoppinsSemiBold text-gray-100">Rp. {FormatAmount(initialValues.sub_total ? initialValues.sub_total : 0)}</Text>
                                </View>
                            </View>

                            <View className="border-b-4 border-gray-200 px-4 py-2 mb-4 "></View>

                            <CustomButton
                                title="Tambah ke keranjang"
                                handlePress={handleSubmit}
                                containerStyles={"mt-10 bg-secondary-200"}
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

export default Variant