import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  Alert,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from "react-native";
import React, { useState, useEffect } from "react";
import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { useAuthStore } from "../../store/authStore"; // your auth store path
import COLORS from "../../constants/color";
import { Picker } from '@react-native-picker/picker';
import { updateUser } from "../../services/API.services";

const Profile = () => {
  const { user, isLoading, logout } = useAuthStore();

  const [formData, setFormData] = useState({
    userFirstName: "",
    userLastName: "",
    countryCode: "",
    phone: "",
    email: "",
    gender: "",
    password: "",
    oldPassword: "",
    loading: false,
    image: null,
  });

  useEffect(() => {
    if (user) {
      setFormData({
        userFirstName: user.userFirstName || "",
        userLastName: user.userLastName || "",
        countryCode: user.countryCode || "",
        phone: user.phone?.toString() || "",
        email: user.email || "",
        gender: user.gender || "",
        password: "",
        oldPassword: "",
        image: user.profileImage?.imageUrl || null,
        loading: false,
      });
    }
  }, [user]);

  const pickProfileImage = async () => {
    try {
      const { status } =
        await ImagePicker.requestMediaLibraryPermissionsAsync();

      if (status !== "granted") {
        Alert.alert(
          "Permission Denied",
          "We need camera roll permissions to change the profile image."
        );
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.5,
      });

      if (!result.canceled && result.assets.length > 0) {
        setFormData((prev) => ({ ...prev, image: result.assets[0].uri }));
      }
    } catch (error) {
      console.log("Error picking image:", error);
    }
  };

  const handleSubmit = async () => {
    setFormData((prev) => ({ ...prev, loading: true }));
    try {
      const form = new FormData();

      form.append("userFirstName", formData.userFirstName.trim());
      form.append("userLastName", formData.userLastName.trim());
      form.append("countryCode", formData.countryCode.trim());
      form.append("gender", formData.gender.trim());

      if (formData.image) {
        form.append("image", {
          uri: formData.image,
          name: "profile.jpg",
          type: "image/jpeg",
        });
      }

      if (formData.password.trim().length > 0) {
        form.append("password", formData.password.trim());
      }

      await updateUser(form);

      setFormData((prev) => ({ ...prev, loading: false }));

    } catch (error) {
        Alert.alert("Error", "Something went wrong. Please try again later.");
      setFormData((prev) => ({ ...prev, loading: false }));
    }
  };

  if (isLoading) {
    return (
      <View style={styles.centered}>
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      style={{ flex: 1 }}
    >
      <ScrollView contentContainerStyle={styles.container}>
        {/* Top Bar with Logout */}
        <View style={styles.topBar}>
          <Text style={styles.topBarTitle}>Profile</Text>
          <TouchableOpacity
            onPress={() => {
              Alert.alert("Logout", "Are you sure you want to logout?", [
                { text: "Cancel", style: "cancel" },
                { text: "Logout", onPress: logout },
              ]);
            }}
          >
            <Ionicons name="log-out-outline" size={28} color={COLORS.primary} />
          </TouchableOpacity>
        </View>

        {/* Profile Image with Edit Icon */}
        <TouchableOpacity
          style={styles.imagePickerWrapper}
          onPress={pickProfileImage}
        >
          <View style={styles.imagePicker}>
            {formData.image ? (
              <Image
                source={{ uri: formData.image }}
                style={styles.selectedImage}
              />
            ) : (
              <Ionicons name="person-circle-outline" size={150} color="#777" />
            )}
          </View>
          <View style={styles.editIconContainer}>
            <Ionicons name="pencil" size={20} color="#fff" />
          </View>
        </TouchableOpacity>

        {/* Form Inputs */}
        <View style={styles.formGroup}>
          <Text style={styles.label}>First Name</Text>
          <TextInput
            style={styles.input}
            value={formData.userFirstName}
            onChangeText={(text) =>
              setFormData((prev) => ({ ...prev, userFirstName: text }))
            }
            placeholder="First Name"
          />
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Last Name</Text>
          <TextInput
            style={styles.input}
            value={formData.userLastName}
            onChangeText={(text) =>
              setFormData((prev) => ({ ...prev, userLastName: text }))
            }
            placeholder="Last Name"
          />
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Country Code</Text>
          <TextInput
            style={styles.input}
            value={formData.countryCode}
            onChangeText={(text) =>
              setFormData((prev) => ({ ...prev, countryCode: text }))
            }
            placeholder="Country Code"
            keyboardType="numeric"
          />
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Phone</Text>
          <TextInput
            style={[styles.input, { backgroundColor: "#eee" }]}
            value={formData.phone}
            placeholder="Phone Number"
            keyboardType="phone-pad"
            editable={false}
          />
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Email</Text>
          <TextInput
            style={[styles.input, { backgroundColor: "#eee" }]}
            placeholder="Email"
            value={formData.email}
            editable={false}
          />
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Gender</Text>
          <View style={[styles.input, { paddingHorizontal: 0, paddingVertical: 0 }]}>
            <Picker
              selectedValue={formData.gender}
              onValueChange={(itemValue) =>
                setFormData((prev) => ({ ...prev, gender: itemValue }))
              }
              style={{ height: 55, width: "100%" }}
              dropdownIconColor={COLORS.textPrimary || "#333"}
            >
              <Picker.Item label="Male" value="Male" />
              <Picker.Item label="Female" value="Female" />
              <Picker.Item label="Others" value="Others" />
            </Picker>
          </View>
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Old Password</Text>
          <TextInput
            style={styles.input}
            value={formData.oldPassword}
            onChangeText={(text) =>
              setFormData((prev) => ({ ...prev, oldPassword: text }))
            }
            placeholder="Old Password"
            secureTextEntry
            autoCapitalize="none"
          />
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>New Password</Text>
          <TextInput
            style={styles.input}
            value={formData.password}
            onChangeText={(text) =>
              setFormData((prev) => ({ ...prev, password: text }))
            }
            placeholder="New Password"
            secureTextEntry
            autoCapitalize="none"
          />
        </View>

        <TouchableOpacity style={styles.button} onPress={handleSubmit} disabled={formData.loading}>
          {formData.loading ? (
            <ActivityIndicator color={COLORS.white} />
          ) : (
            <Text style={styles.buttonText}>Save Changes</Text>
          )}
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default Profile;

const styles = StyleSheet.create({
  container: {
    padding: 20,
    paddingBottom: 40,
  },
  topBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  topBarTitle: {
    fontSize: 22,
    fontWeight: "700",
    color: COLORS.textPrimary || "#333",
  },
  imagePickerWrapper: {
    width: 150,
    height: 150,
    position: "relative",
    alignSelf: "center",
    marginBottom: 20,
  },
  imagePicker: {
    height: 150,
    width: 150,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 75,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fafafa",
    overflow: "hidden",
  },
  selectedImage: {
    width: "100%",
    height: "100%",
    borderRadius: 75,
  },
  editIconContainer: {
    position: "absolute",
    bottom: -5,
    right: -5,
    backgroundColor: COLORS.primary,
    borderRadius: 15,
    padding: 5,
    borderWidth: 1,
    borderColor: "#fff",
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.3,
    shadowRadius: 1,
  },
  formGroup: {
    marginBottom: 15,
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 6,
    color: COLORS.textPrimary || "#333",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 6,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
    color: COLORS.textPrimary || "#333",
    backgroundColor: "#fff",
  },
  button: {
    backgroundColor: COLORS.primary || "#007bff",
    paddingVertical: 14,
    borderRadius: 8,
    marginTop: 10,
    alignItems: "center",
  },
  buttonText: {
    color: COLORS.white || "#fff",
    fontSize: 18,
    fontWeight: "700",
  },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
