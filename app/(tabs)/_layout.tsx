import COLORS from "@/constants/color";
import { Ionicons } from "@expo/vector-icons";
import { Tabs } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
export default function TabLayout() {
 const insect=useSafeAreaInsets()
    return (

    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor:COLORS.primary,
        headerTitleStyle:{
            color:COLORS.textPrimary,
            fontWeight:'600'
        },
        headerShadowVisible:false,
        tabBarStyle:{
            backgroundColor:COLORS.cardBackground,
            borderTopWidth:1,
            borderTopColor:COLORS.border,
            paddingTop:5,
            height:60+insect.bottom,
            paddingBottom:insect.bottom
        }
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarIcon:({color,size})=>(<Ionicons name="home-outline" size={size} color={color}/>)
        }}
      />
      <Tabs.Screen
        name="create"
        options={{
          title: "Create",
              tabBarIcon:({color,size})=>(<Ionicons name="add-circle-outline" size={size} color={color}/>)
  
        }}
      />
           <Tabs.Screen
        name="myBooks"
        options={{
          title: "My Books",
              tabBarIcon:({color,size})=>(<Ionicons name="book-sharp" size={size} color={color}/>)
  
        }}
      />

      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
              tabBarIcon:({color,size})=>(<Ionicons name="person-outline" size={size} color={color}/>)
  
        }}
      />
    </Tabs>
  );
}
