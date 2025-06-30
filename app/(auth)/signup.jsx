import { Ionicons } from "@expo/vector-icons";
import { Picker } from "@react-native-picker/picker";
import { Image } from "expo-image";
import { Link } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
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

const SignUp = () => {
  const [formInput, setFormInput] = useState({
    userFirstName: "",
    userLastName: "",
    phone: "",
    email: "",
    gender: "",
    password: "",
    rePassword: "",
  });

  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [showRePassword, setShowRePassword] = useState(false);
  const { register, isLoading } = useAuthStore();

  const validate = () => {
    const newErrors = {};

    if (!formInput.userFirstName.trim()) newErrors.userFirstName = "First name is required.";
    if (!formInput.userLastName.trim()) newErrors.userLastName = "Last name is required.";
    if (!formInput.phone.trim()) {
      newErrors.phone = "Phone number is required.";
    } else if (!/^\d{10}$/.test(formInput.phone)) {
      newErrors.phone = "Phone number must be 10 digits.";
    }

    if (!formInput.email.trim()) {
      newErrors.email = "Email is required.";
    } else if (!/\S+@\S+\.\S+/.test(formInput.email)) {
      newErrors.email = "Invalid email format.";
    }

    if (!formInput.gender) newErrors.gender = "Gender is required.";

    if (!formInput.password) {
      newErrors.password = "Password is required.";
    } else if (formInput.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters.";
    }
    if (!formInput.rePassword) {
      newErrors.rePassword = "Re-enter your password.";
    } else if (formInput.password !== formInput.rePassword) {
      newErrors.rePassword = "Passwords do not match.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSignUp = () => {
    if (validate()) {
      register(formInput);
    }
  };

  useEffect(() => {
    setErrors({}); // Clear errors on change
  }, [formInput]);

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
            <View style={styles.topIllustation}>
              <Image
                source={require("../../assets/images/register.png")}
                style={styles.illustration}
              />
            </View>

            <View style={styles.card}>
              <Text style={styles.title}>Register Now</Text>
              <View style={styles.formContiner}>
                <InputField
                  label="First Name"
                  icon="person-outline"
                  placeholder="Enter your First Name"
                  value={formInput.userFirstName}
                  onChangeText={(text) =>
                    setFormInput({ ...formInput, userFirstName: text })
                  }
                  disabled={isLoading}
                  error={errors.userFirstName}
                />

                <InputField
                  label="Last Name"
                  icon="person-outline"
                  placeholder="Enter your Last Name"
                  value={formInput.userLastName}
                  onChangeText={(text) =>
                    setFormInput({ ...formInput, userLastName: text })
                  }
                  disabled={isLoading}
                  error={errors.userLastName}
                />

                <InputField
                  label="Phone"
                  icon="call-outline"
                  placeholder="Enter your Phone Number"
                  keyboardType="phone-pad"
                  value={formInput.phone}
                  onChangeText={(text) =>
                    setFormInput({ ...formInput, phone: text })
                  }
                  disabled={isLoading}
                  error={errors.phone}
                />

                <InputField
                  label="Email"
                  icon="mail-outline"
                  placeholder="Enter your Email"
                  keyboardType="email-address"
                  autoCapitalize="none"
                  value={formInput.email}
                  onChangeText={(text) =>
                    setFormInput({ ...formInput, email: text })
                  }
                  disabled={isLoading}
                  error={errors.email}
                />

                <View style={styles.inputGroup}>
                  <Text style={styles.label}>Gender</Text>
                  <View style={styles.pickerContainer}>
                    <Picker
                      selectedValue={formInput.gender}
                      onValueChange={(itemValue) =>
                        setFormInput({ ...formInput, gender: itemValue })
                      }
                      style={{ flex: 1 ,color:"black"}}
                      enabled={!isLoading}
                    >
                   <Picker.Item label="Select Gender" value="" color="gray" enabled={!formInput.gender} />
         <Picker.Item label="Male" value="Male" style={{color:"black"}} />
                      <Picker.Item label="Female" value="Female"  style={{color:"black"}}/>
                      <Picker.Item label="Others" value="Others"  style={{color:"black"}}/>
                    </Picker>
                  </View>
                  {errors.gender && (
                    <Text style={styles.errorText}>{errors.gender}</Text>
                  )}
                </View>

                <InputField
                  label="Password"
                  icon="lock-closed-outline"
                  placeholder="Enter your Password"
                  secureTextEntry={!showPassword}
                  value={formInput.password}
                  onChangeText={(text) =>
                    setFormInput({ ...formInput, password: text })
                  }
                  showToggle
                  showValue={showPassword}
                  toggleShow={() => setShowPassword(!showPassword)}
                  disabled={isLoading}
                  error={errors.password}
                />

                <InputField
                  label="Re-enter Password"
                  icon="lock-closed-outline"
                  placeholder="Re-enter your Password"
                  secureTextEntry={!showRePassword}
                  value={formInput.rePassword}
                  onChangeText={(text) =>
                    setFormInput({ ...formInput, rePassword: text })
                  }
                  showToggle
                  showValue={showRePassword}
                  toggleShow={() => setShowRePassword(!showRePassword)}
                  disabled={isLoading}
                  error={errors.rePassword}
                />
              </View>

              <View style={styles.bottomContainer}>
                <TouchableOpacity disabled={isLoading}>
                  <Text style={styles.forgotPassword}>Forgot Password?</Text>
                </TouchableOpacity>
                <TouchableOpacity disabled={isLoading}>
                  <Link style={styles.forgotPassword} href="/(auth)/login">
                    Back to Login
                  </Link>
                </TouchableOpacity>
              </View>

              {isLoading ? (
                <ActivityIndicator size="large" color={COLORS.primary} style={{ marginTop: 10 }} />
              ) : (
                <TouchableOpacity
                  onPress={handleSignUp}
                  style={styles.submitButton}
                  disabled={isLoading}
                >
                  <Text style={styles.submitButtonText}>Register</Text>
                </TouchableOpacity>
              )}
            </View>
          </View>
        </ScrollView>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
};

const InputField = ({
  label,
  icon,
  placeholder,
  value,
  onChangeText,
  keyboardType = "default",
  secureTextEntry = false,
  autoCapitalize = "sentences",
  showToggle = false,
  showValue,
  toggleShow,
  disabled = false,
  error,
}) => (
  <View style={styles.inputGroup}>
    <Text style={styles.label}>{label}</Text>
    <View style={styles.inputContainer}>
      <Ionicons
        name={icon}
        size={20}
        color={COLORS.primary}
        style={styles.inputIcon}
      />
      <TextInput
        style={[defaultStyles.inputField, styles.input]}
        placeholder={placeholder}
        placeholderTextColor={COLORS.placeholderText}
        value={value}
        onChangeText={onChangeText}
        keyboardType={keyboardType}
        secureTextEntry={secureTextEntry}
        autoCapitalize={autoCapitalize}
        editable={!disabled}
      />
      {showToggle && (
        <TouchableOpacity
          onPress={toggleShow}
          style={styles.eyeIcon}
          disabled={disabled}
        >
          <Ionicons
            name={showValue ? "eye-outline" : "eye-off-outline"}
            size={20}
            color={COLORS.primary}
          />
        </TouchableOpacity>
      )}
    </View>
    {error && <Text style={styles.errorText}>{error}</Text>}
  </View>
);

export default SignUp;

const styles = StyleSheet.create({
  title: {
    fontSize: 20,
    fontWeight: "700",
    textAlign: "center",
    marginVertical: 20,
  },
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
  pickerContainer: {
    borderWidth: 1,
    borderColor: "#ABABAB",
    borderRadius: 5,
    paddingHorizontal: 0,
    paddingVertical: 0,
 
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
  errorText: {
    color: "red",
    fontSize: 12,
    marginTop: 5,
  },
  submitButton: {
    backgroundColor: COLORS.primary,
    paddingVertical: 15,
    borderRadius: 5,
    alignItems: "center",
    marginTop: 15,
  },
  submitButtonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 16,
  },
});
