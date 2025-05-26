
import { Link } from "expo-router";
import { StyleSheet, View } from "react-native";
export default function Index() {
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