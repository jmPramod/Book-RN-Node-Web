
import { useAuthStore } from "@/store/authStore";
import { Link } from "expo-router";
import { useEffect } from "react";
import { StyleSheet, View } from "react-native";

export default function Index() {
  const {user,token,checkAuth}=useAuthStore()

  useEffect(()=>{
    console.log("index auth check");
    
checkAuth()

  },[])
  if(user){
    console.log("user_1",user);
    
  }
  if(token){
    console.log("user_101",token);
    
  }
  return (
    <View
  style={styles.container}
    >
      <Link href="/(auth)/login">Login page</Link>
    <Link href="/(auth)/signup">SignUp page</Link>
    </View>
  );
}


const styles=StyleSheet.create({
container:{
 },
title:{color:"red"}
})