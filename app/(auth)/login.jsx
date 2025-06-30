import { Image } from "expo-image";
import { Link, useRouter } from "expo-router";
import { useEffect, useState } from "react";

import { Ionicons } from "@expo/vector-icons";
import {
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";

import COLORS from "../../constants/color";
import { defaultStyles } from "../../constants/styles";
import { useAuthStore } from "../../store/authStore";

const Login = () => {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  const { user, token, isLoading, login } = useAuthStore();

  const handleLogin = async () => {
    if (!email || !password) {
      setError("Please enter both email and password.");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError("Please enter a valid email address.");
      return;
    }

    setError("");
    const payload = { email, password };
    const res = await login(payload);
  };

  useEffect(() => {
    if (token && user) {
      router.push("/");
    }
  }, [user, token]);

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{ flex: 1 }}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <ScrollView
          contentContainerStyle={{ flexGrow: 1 }}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.container}>
            {/* Illustration */}
            <View style={styles.topIllustration}>
              <Image
                source={require("../../assets/images/i.png")}
                style={styles.illustration}
              />
            </View>

            <View style={styles.card}>
              <Text style={styles.title}>Welcome back</Text>
              <View style={styles.formContainer}>
                {/* Email */}
                <View style={styles.inputGroup}>
                  <Text style={styles.label}>Email</Text>
                  <View style={styles.inputContainer}>
                    <Ionicons
                      name="mail-outline"
                      size={20}
                      color={COLORS.primary}
                      style={styles.inputIcon}
                    />
                    <TextInput
                      style={[defaultStyles.inputField, styles.input]}
                      placeholder="Enter your Email"
                      placeholderTextColor={COLORS.placeholderText}
                      value={email}
                      onChangeText={(text) => setEmail(text.trim())}
                      keyboardType="email-address"
                      autoCapitalize="none"
                    />
                  </View>
                </View>

                {/* Password */}
                <View style={styles.inputGroup}>
                  <Text style={styles.label}>Password</Text>
                  <View style={styles.inputContainer}>
                    <Ionicons
                      name="lock-closed-outline"
                      size={20}
                      color={COLORS.primary}
                      style={styles.inputIcon}
                    />
                    <TextInput
                      style={[defaultStyles.inputField, styles.input]}
                      placeholder="Enter your Password"
                      placeholderTextColor={COLORS.placeholderText}
                      value={password}
                      onChangeText={(text) => setPassword(text.trim())}
                      secureTextEntry={!showPassword}
                      autoCapitalize="none"
                    />
                    <TouchableOpacity
                      onPress={() => setShowPassword(!showPassword)}
                      style={styles.eyeIcon}
                      hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                    >
                      <Ionicons
                        name={showPassword ? "eye-outline" : "eye-off-outline"}
                        size={20}
                        color={COLORS.primary}
                      />
                    </TouchableOpacity>
                  </View>
                </View>
              </View>

              <View style={styles.bottomContainer}>
                <TouchableOpacity>
                  <Text style={styles.bottomText}>Forgot Password?</Text>
                </TouchableOpacity>
                <TouchableOpacity>
                  <Link style={styles.bottomText} href="/(auth)/signup">
                    SignUp page
                  </Link>
                </TouchableOpacity>
              </View>

              {error ? <Text style={styles.errorText}>{error}</Text> : null}

              <TouchableOpacity
                onPress={handleLogin}
                disabled={isLoading}
                style={[styles.loginButton, isLoading && { opacity: 0.6 }]}
              >
                <Text style={styles.loginButtonText}>
                  {isLoading ? "Loading..." : "Submit"}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
};

export default Login;

const styles = StyleSheet.create({
  title: {
    fontSize: 20,
    fontWeight: "700",
    textAlign: "center",
  },
  container: {
    width: "100%",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingBottom: 40, // Added some bottom padding
    gap: 20,
  },
  topIllustration: {
    width: "100%",
    height: 350,
  },
  illustration: {
    width: "100%",
    height: "100%",
    resizeMode: "contain",
  },
  card: {
    backgroundColor: "white",
    borderRadius: 10,
    width: "100%",
    padding: 20,
    gap: 20,
    elevation: 3,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 10,
  },
  formContainer: {
    gap: 20,
  },
  inputGroup: {
    gap: 5,
  },
  label: {
    fontSize: 14,
    color: "#333",
    marginBottom: 5,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#ABABAB",
    borderRadius: 5,
    paddingHorizontal: 10,
  },
  inputIcon: {
    marginRight: 8,
  },
  input: {
    flex: 1,
    fontSize: 14,
  },
  eyeIcon: {
    padding: 5,
    alignItems: "center",
    justifyContent: "center",
  },
  bottomContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  bottomText: {
    color: COLORS.primary,
    textTransform: "capitalize",
  },
  errorText: {
    color: "red",
    textAlign: "center",
    marginTop: -10,
    marginBottom: 5,
  },
  loginButton: {
    backgroundColor: COLORS.primary,
    paddingVertical: 12,
    borderRadius: 5,
    alignItems: "center",
    marginTop: 10,
  },
  loginButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
});
