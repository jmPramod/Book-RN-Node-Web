import { Stack, useRouter, useSegments } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { SafeAreaProvider } from "react-native-safe-area-context";
import SafeScreen from "../components/SafeScreen";
import { useAuthStore } from "@/store/authStore";
import { useEffect, useState } from "react";

export default function RootLayout() {
  const router = useRouter();
  const segments = useSegments();
  const { checkAuth, user, token } = useAuthStore();
  
  const [isReady, setIsReady] = useState(false); // NEW
  
  useEffect(() => {
    checkAuth(); // Check if user is logged in or not
    setIsReady(true); // Mark router ready after first render
  }, []);
  
  // Handle navigation based on auth store
  useEffect(() => {
    if (!isReady) return; // Don't navigate until ready
    
    const isAuthScreen = segments[0] == '(auth)'; // Check if on login/signup screen
    const isSignedIn = user && token;
    
    if (!isSignedIn && !isAuthScreen) {
      router.replace("/(auth)/login");
    } else if (isSignedIn && isAuthScreen) {
      // Only replace if needed to avoid unnecessary navigation
      router.replace('/(tabs)');
    }
  }, [user, token, segments, isReady]); // include isReady

  return (
    <SafeAreaProvider>
      <SafeScreen>
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="(tabs)" />
          <Stack.Screen name="(auth)" />
            <Stack.Screen name="editBook" options={{ headerShown: true, title: "Edit Book" }} />
        </Stack>
      </SafeScreen>
      <StatusBar style="dark" />
    </SafeAreaProvider>
  );
}
