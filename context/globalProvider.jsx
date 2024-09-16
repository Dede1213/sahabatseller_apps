import { createContext, useContext, useState, useEffect } from "react";
import * as SecureStore from 'expo-secure-store';
import { fetchData } from "../lib/fetchData";


const GlobalContext = createContext();
export const useGlobalContext = () => useContext(GlobalContext);

const GlobalProvider = ({ children }) => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [user, setUser] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [refreshTrigger, setRefreshTrigger] = useState(false);
    const [itemId, setItemId] = useState('');
    const [variantId, setVariantId] = useState('');
    const [itemName, setItemName] = useState('');
    const [variantName, setVariantName] = useState('');

    const loadUserData = async () => {
        const storedTokenUser = await SecureStore.getItemAsync('userToken');
        const storedIdUser = await SecureStore.getItemAsync('userId');

        if (storedTokenUser && storedIdUser) {
            try {
                const response = async () => await fetchData('http://20.20.20.127:2500/user/' + storedIdUser, {
                    headers: {
                        'X-access-token': storedTokenUser,
                        'Content-Type': 'application/json',
                        'Accept': 'application/json',
                    },
                    method: 'get',
                });

                setUser(response.data)
                setIsLoggedIn(true)
            } catch (error) {
                console.log(error);
            } finally {
                setIsLoggedIn(false);
                setUser(null);
                setIsLoading(false);
                setRefreshTrigger(false);
                setItemId(0);
            }
        } else {
            setIsLoggedIn(false);
            setUser(null);
            setIsLoading(false);
        }
    };

    useEffect(() => {
        loadUserData();
    }, [])

    return (
        <GlobalContext.Provider value={{
            isLoggedIn,
            setIsLoggedIn,
            user,
            setUser,
            isLoading,
            setRefreshTrigger,
            refreshTrigger,
            itemId,
            setItemId,
            variantId,
            setVariantId,
            itemName,
            setItemName,
            variantName,
            setVariantName
        }}>{children}</GlobalContext.Provider>
    )
}

export default GlobalProvider;