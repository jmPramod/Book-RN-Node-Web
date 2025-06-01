import { create } from "zustand";
import { registerApi } from "../services/API.services";
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
      console.log("API result", res.data.data);
      console.log("API result", res.data.meta);
console.log("res?.meta?.message?.status",res.data?.meta?.message?.status);

    if (res.data?.meta?.message?.status == 200) {
      console.log(" JSON.stringify(res.data)", JSON.stringify(res.data.data));
      console.log(" res?.meta?.token", res?.data?.meta?.access_token);
      
      
      await AsyncStorage.setItem("user", JSON.stringify(res.data.data));
      await AsyncStorage.setItem("token", res?.data?.meta?.access_token);

      set({ token: res?.meta?.token, user: res.data, isLoading: false });
       Alert.alert("Error",res?.data?.meta?.message?.title);
    } else {
      Alert.alert("Error", res?.meta?.error || "Something went wrong");
    }
  },



  checkAuth:async ()=>{
  try {
      const token=await AsyncStorage.getItem("token")
    const userJson=await AsyncStorage.getItem("user")
    const user=userJson?JSON.parse(userJson):null;


    set({token,user})

  } catch (error) {
console.log("Async Auth Failed",error);
    
  }

  }
}));
