import { Image } from "expo-image";
import { useState } from "react";
import { Link } from "expo-router";

import {
  StyleSheet,
  TextInput,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import COLORS from "../../constants/color";
import { defaultStyles } from "../../constants/styles";

const SignUp = () => {
  const [email, setEmail] = useState("");
  const [formInput, setFormInput] = useState({
    firstName: "",
    lastName: "",
    phone: "",
  });
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  return (
    <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
      <View style={styles.container}>
        {/* Illustration */}
        <View style={styles.topIllustation}>
          <Image
            source={require("../../assets/images/register.png")}
            style={styles.illustration}
          />
        </View>

        <View style={styles.card}>
          <View style={styles.formContiner}>
            {/* First Name */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>First Name</Text>
              <View style={styles.inputContainer}>
                <Ionicons
                  name="person-outline"
                  size={20}
                  color={COLORS.primary}
                  style={styles.inputIcon}
                />
                <TextInput
                  style={[defaultStyles.inputField, styles.input]}
                  placeholder="Enter your First Name"
                  placeholderTextColor={COLORS.placeholderText}
                  value={formInput.firstName}
                  onChangeText={(text) =>
                    setFormInput({ ...formInput, firstName: text })
                  }
                />
              </View>
            </View>

            {/* Last Name */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Last Name</Text>
              <View style={styles.inputContainer}>
                <Ionicons
                  name="person-outline"
                  size={20}
                  color={COLORS.primary}
                  style={styles.inputIcon}
                />
                <TextInput
                  style={[defaultStyles.inputField, styles.input]}
                  placeholder="Enter your Last Name"
                  placeholderTextColor={COLORS.placeholderText}
                  value={formInput.lastName}
                  onChangeText={(text) =>
                    setFormInput({ ...formInput, lastName: text })
                  }
                />
              </View>
            </View>

            {/* Phone */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Phone</Text>
              <View style={styles.inputContainer}>
                <Ionicons
                  name="call-outline"
                  size={20}
                  color={COLORS.primary}
                  style={styles.inputIcon}
                />
                <TextInput
                  style={[defaultStyles.inputField, styles.input]}
                  placeholder="Enter your Phone Number"
                  placeholderTextColor={COLORS.placeholderText}
                  value={formInput.phone}
                  onChangeText={(text) =>
                    setFormInput({ ...formInput, phone: text })
                  }
                  keyboardType="phone-pad"
                />
              </View>
            </View>

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
                  onChangeText={setEmail}
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
                  onChangeText={setPassword}
                  secureTextEntry={!showPassword}
                  autoCapitalize="none"
                />
                <TouchableOpacity
                  onPress={() => setShowPassword(!showPassword)}
                  style={styles.eyeIcon}
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

          {/* Bottom links */}
          <View style={styles.bottomContainer}>
            <TouchableOpacity>
              <Text style={styles.forgotPassword}>Forgot Password?</Text>
            </TouchableOpacity>
            <TouchableOpacity>
              {/* <Text style={styles.forgotPassword}>Register Now</Text> */}
         <Link style={styles.forgotPassword} href="/(auth)/login">Back to Login</Link>

            </TouchableOpacity>
          </View>
        </View>
      </View>
    </ScrollView>
  );
};

export default SignUp;

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    width: "100%",
    justifyContent: "center",
    gap: 20,
    flexDirection: "column",
    paddingVertical: 20,
  },
  topIllustation: {
    width: "100%",
    height: 300,
  },
  illustration: {
    width: "100%",
    height: "100%",
    resizeMode: "contain",
  },
  card: {
    backgroundColor: "white",
    borderRadius: 10,
    width: "90%",
    padding: 15,
  },
  formContiner: {
    gap: 20,
  },
  inputGroup: {
    width: "100%",
  },
  label: {
    marginBottom: 5,
    fontWeight: "500",
    color: "#333",
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
  },
  eyeIcon: {
    padding: 5,
  },
  forgotPassword: {
    textTransform: "capitalize",
    color: COLORS.primary,
  },
  bottomContainer: {
    marginTop: 10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
});
