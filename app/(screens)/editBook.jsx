import {
  View,
  Text,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Alert,
  Image,
  ActivityIndicator,
} from "react-native";

import React, { useState, useEffect } from "react";
import { useRouter, useLocalSearchParams } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import COLORS from "../../constants/color";
import * as ImagePicker from "expo-image-picker";
import * as FileSystem from "expo-file-system";
import { useAuthStore } from "../../store/authStore";
import {  fetchBookApi, editBookApi } from "../../services/API.services";

const EditBook = () => {
  const { bookId } = useLocalSearchParams();
  // console.log(bookId);
  
  const { user } = useAuthStore();
  const [formData, setFormData] = useState({
    title: "",
    caption: "",
    rating: 3,
    image: null,
    imageBase64: null,
    loading: false,
    user: null,
  });

  const router = useRouter();

  // Fetch existing book if editing
  useEffect(() => {
    const fetchBook = async () => {
      if (bookId) {
        console.log("bookId007",bookId);
        
        const resp = await fetchBookApi(1, null, bookId);
        console.log("resp_123",resp);
        
        if (resp?.data) {
          const { title, caption, rating, image, user: bookUser } = resp.data;
          setFormData((prev) => ({
            ...prev,
            title: title || "",
            caption: caption || "",
            rating: rating || 3,
            image: image?.imageUrl || null,
            user: bookUser || null,
          }));
        }
      }
    };

    fetchBook();
  }, [bookId]);

  const pickImage = async () => {
    try {
      if (Platform.OS != "web") {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();

        if (status !== "granted") {
          Alert.alert(
            "Permission Denied",
            "We need Camera roll permission to upload an image"
          );
          return;
        }

        const result = await ImagePicker.launchImageLibraryAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.Images,
          allowsEditing: true,
          aspect: [3, 3],
          quality: 0.5,
          base64: true,
        });

        if (!result.canceled) {
          setFormData((pre) => ({ ...pre, image: result.assets[0].uri }));

          if (result.assets[0].base64) {
            setFormData((pre) => ({
              ...pre,
              imageBase64: result.assets[0].base64,
            }));
          } else {
            const base64 = await FileSystem.readAsStringAsync(result.assets[0].uri, {
              encoding: FileSystem.EncodingType.Base64,
            });

            setFormData((pre) => ({ ...pre, imageBase64: base64 }));
          }
        }
      }
    } catch (error) {
      console.log("Error picking image:", error);
    }
  };

  const handleSubmit = async () => {
    try {
      if (!formData.title.trim()) {
        Alert.alert("Validation Error", "Please enter a book title.");
        return;
      }

      if (!formData.caption.trim()) {
        Alert.alert("Validation Error", "Please enter a caption or review.");
        return;
      }

      if (!formData.image && !bookId) {
        Alert.alert("Validation Error", "Please select an image.");
        return;
      }

      setFormData((prev) => ({ ...prev, loading: true }));

      const form = new FormData();

      form.append("title", formData.title);
      form.append("caption", formData.caption);
      form.append("rating", formData.rating.toString());

      // Only send image if new image is picked
      if (formData.image && !formData.image.startsWith("http")) {
        form.append("image", {
          uri: formData.image,
          type: "image/jpeg",
          name: `book_${Date.now()}.jpg`,
        });
      }

      form.append("user", user._id);

      // Conditional API call
      let resp;
      if (bookId) {
        resp = await editBookApi(bookId, form);
      }

      if (resp.meta.message.status == 200) {
        Alert.alert("Success", resp.meta.message.title);
        setFormData({
          title: "",
          caption: "",
          rating: 2,
          image: null,
          imageBase64: null,
          loading: false,
          user: null,
        });
        router.push("/");
      }

      setFormData((prev) => ({ ...prev, loading: false }));
    } catch (error) {
      console.log("Error submitting form:", error);
      Alert.alert("Error", "Something went wrong. Please try again later.");
      setFormData((prev) => ({ ...prev, loading: false }));
    }
  };

  const renderRatingPicker = () => {
    const star = [];
    for (let i = 1; i <= 5; i++) {
      star.push(
        <TouchableOpacity
          key={i}
          onPress={() => setFormData((pre) => ({ ...pre, rating: i }))}
          style={styles.starButton}
        >
          <Ionicons
            name={i <= formData.rating ? "star" : "star-outline"}
            size={32}
            color={i <= formData.rating ? "#f4b400" : COLORS.textSecondary}
          />
        </TouchableOpacity>
      );
    }
    return star;
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView
        contentContainerStyle={styles.container}
        style={styles.scroolViewStyle}
      >
        <View style={styles.card}>
          <View style={styles.header}>
            <TouchableOpacity
              onPress={() => router.back()}
              style={styles.backButton}
            >
              <Ionicons
                name="arrow-back"
                size={28}
                color={COLORS.primary || "#333"}
              />
            </TouchableOpacity>

            <Text style={styles.title}>
              {bookId ? "Edit Post" : "Create Post"}
            </Text>
            <Text style={styles.subTitle}>
              {bookId ? "Edit your reads" : "Share your reads"}
            </Text>
          </View>
        </View>

        <View style={styles.form}>
          <View style={styles.formGroup}>
            <Text style={styles.lable}>Book Title</Text>
            <View style={styles.inputContainer}>
              <Ionicons
                name="book-outline"
                size={20}
                color={COLORS.textSecondary}
                style={styles.inputIcon}
              />
              <TextInput
                style={styles.input}
                placeholder="Enter book title"
                placeholderTextColor={COLORS.placeholderText}
                value={formData.title}
                onChangeText={(text) =>
                  setFormData((prev) => ({ ...prev, title: text }))
                }
              />
            </View>
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.lable}>Your rating</Text>
            <View style={styles.ratingContainer}>{renderRatingPicker()}</View>
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.lable}>Book image</Text>
            <TouchableOpacity style={styles.imagePicker} onPress={pickImage}>
              {formData.image ? (
                <Image
                  source={{ uri: formData.image }}
                  style={styles.selectedImage}
                  resizeMode="cover"
                />
              ) : (
                <>
                  <Ionicons
                    name="image-outline"
                    size={40}
                    color={COLORS.textSecondary}
                  />
                  <Text style={styles.placeholderText}>
                    Tap to select the image
                  </Text>
                </>
              )}
            </TouchableOpacity>
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.lable}>Caption</Text>
            <TextInput
              style={styles.textArea}
              placeholder="Write a review"
              placeholderTextColor={COLORS.placeholderText}
              value={formData.caption}
              onChangeText={(text) =>
                setFormData((prev) => ({ ...prev, caption: text }))
              }
              multiline
            />
          </View>

          <TouchableOpacity
            style={styles.button}
            onPress={handleSubmit}
            disabled={formData.loading}
          >
            {formData.loading ? (
              <ActivityIndicator color={COLORS.white} />
            ) : (
              <>
                <Ionicons
                  name="cloud-upload-outline"
                  size={20}
                  color={COLORS.white}
                  style={styles.buttonIcon}
                />
                <Text style={styles.buttonText}>
                  {bookId ? "Update" : "Share"}
                </Text>
              </>
            )}
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default EditBook;


const styles = StyleSheet.create({
  scroolViewStyle: {
    backgroundColor: "#fff",
  },
  container: {
    padding: 20,
    paddingBottom: 40,
  },
  card: {
    backgroundColor: "#f8f9fa",
    borderRadius: 10,
    padding: 20,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 8,
    elevation: 3,
  },
  header: {
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
  },
  backButton: {
    position: "absolute",
    left: 0,
    top: 0,
    padding: 8,
    zIndex: 1,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: COLORS.primary || "#333",
    marginBottom: 8,
  },
  subTitle: {
    fontSize: 16,
    color: COLORS.textSecondary || "#777",
  },
  form: {
    marginTop: 10,
  },
  formGroup: {
    marginBottom: 20,
  },
  lable: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 8,
    color: COLORS.textPrimary || "#333",
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: COLORS.border || "#ddd",
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 12,
    backgroundColor: "#fff",
  },
  inputIcon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: COLORS.textPrimary || "#333",
  },
  starButton: {
    marginRight: 8,
    padding: 4,
  },
  imagePicker: {
    height: 350,
    borderWidth: 1,
    borderColor: COLORS.border || "#ddd",
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fafafa",
    overflow: "hidden",
  },
  ratingContainer: {
    flexDirection: "row",
  },
  selectedImage: {
    width: "100%",
    height: "100%",
    borderRadius: 8,
  },
  placeholderText: {
    marginTop: 10,
    fontSize: 16,
    color: COLORS.textSecondary || "#777",
  },
  textArea: {
    borderWidth: 1,
    borderColor: COLORS.border || "#ddd",
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 12,
    fontSize: 16,
    color: COLORS.textPrimary || "#333",
    backgroundColor: "#fff",
    minHeight: 100,
    textAlignVertical: "top",
  },
  button: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: COLORS.primary || "#007bff",
    paddingVertical: 14,
    borderRadius: 8,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 6,
    elevation: 2,
  },
  buttonIcon: {
    marginRight: 8,
  },
  buttonText: {
    color: COLORS.white || "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});
