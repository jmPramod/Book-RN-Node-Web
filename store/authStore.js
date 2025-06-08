import { create } from "zustand";
import { loginApi, registerApi } from "../services/API.services";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Alert } from "react-native";
const apiUrl = process.env.EXPO_PUBLIC_API_URL;
export const useAuthStore = create((set) => ({
  user: null,
  token: null,
  isLoading: false,
  register: async (payload) => {
    set({ isLoading: true });
    const res = await registerApi(payload);
 
    if (res.data?.meta?.message?.status == 200) {
    
      await AsyncStorage.setItem("user", JSON.stringify(res.data.data));
      await AsyncStorage.setItem("token", res?.data?.meta?.access_token);
 set({ token:  res?.data?.meta?.access_token, user: res.data.data, isLoading: false });
       Alert.alert("Success", res?.data?.meta?.message?.title);
      
    } else {
      Alert.alert("Error", res?.meta?.error || "Something went wrong");
    }
  },
  login: async (payload) => {
    set({ isLoading: true });
    const res = await loginApi(payload);
console.log("pk1",res);

    if (res.data?.meta?.message?.status == 200) {
      await AsyncStorage.setItem("user", JSON.stringify(res.data.data));
      await AsyncStorage.setItem("token", res?.data?.meta?.access_token);
console.log(" res?.data?.meta?.access_token", res.data.data);

      set({ token: res?.data?.meta?.access_token, user: res.data.data, isLoading: false });
      Alert.alert("Success", res?.data?.meta?.message?.title);
     set({ isLoading: false});
   
    } else {
      Alert.alert("Error", res?.meta?.error || "Something went wrong");
     set({ isLoading: false });
   
    }
  },

  checkAuth: async () => {
    try {
      const token = await AsyncStorage.getItem("token");
      const userJson = await AsyncStorage.getItem("user");
      const user = userJson ? JSON.parse(userJson) : null;

      set({ token, user });
    } catch (error) {
      console.log("Async Auth Failed", error);
    }
  },
  logout: async () => {
    await AsyncStorage.removeItem("token");

    await AsyncStorage.removeItem("user");
    set({ token: null, user: null });
  },
}));
