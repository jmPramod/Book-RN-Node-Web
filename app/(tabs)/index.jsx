import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  Image,
  ActivityIndicator,
} from "react-native";
import React, { useEffect, useState } from "react";
import { fetchBookApi } from "../../services/API.services";
import { Ionicons } from "@expo/vector-icons"; // Make sure you import this
import COLORS from "../../constants/color";

const Home = () => {
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [refresh, setRefresh] = useState(false);
  const [book, setBooks] = useState([]);
  const [hasMore, setHasMore] = useState(false);
const fetchBook = async (pageNo = 1, refresh = false) => {
  try {
    if (refresh) setRefresh(true);
    else if (pageNo === 1) setLoading(true);

    // Pass pageNo here 👇
    const response = await fetchBookApi(pageNo);
    console.log("qwert_123", response.meta);

    if (response?.meta?.message?.status === 200) {
      console.log("qwert", response.data);

      setBooks((prev) =>
        refresh ? response.data : [...prev, ...response.data]
      );

      // Correct setHasMore logic
      const pageSize = 2;
      setHasMore(response.data.length === pageSize);

      setPage(pageNo);
    }
  } catch (error) {
    console.log("error", error);
  } finally {
    if (refresh) setRefresh(false);
    else setLoading(false);
  }
};


  useEffect(() => {
    fetchBook();
  }, []);

  const handleLoadMore =async () => {
    if (!loading && hasMore) {
    await   fetchBook(page + 1);
    }
  };
const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "long", // or "short" for "Jun"
    year: "numeric",
  });
};

  // Helper function to render stars based on rating
  const renderStars = (rating) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <Ionicons
          key={i}
          name={i <= rating ? "star" : "star-outline"}
          size={20}
          color={i <= rating ? "#f4b400" : "#ccc"}
          style={{ marginHorizontal: 2 }}
        />
      );
    }
    return <View style={styles.starContainer}>{stars}</View>;
  };

  const renderListItem = ({ item }) => (
    <View style={styles.bookCard}>
      <View style={styles.bookHeader}>
        <View style={styles.userInfo}>
          <Image
            source={{ uri: item.user.profileImage.imageUrl }}
            style={styles.avatar}
          />
          <Text style={styles.userName}>{item.user.userFirstName}</Text>
        </View>
      </View>

      <View style={styles.bookImageContainer}>
        <Image
          source={{ uri: item.image.imageUrl }}
          style={styles.bookImage}
          resizeMode="cover"
        />
      </View>

      <Text style={styles.bookTitle}>{item.title}</Text>

      {/* Render stars here */}
      {renderStars(item.rating)}
      
      <Text style={styles.bookDate}>{formatDate(item.updatedAt)}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
     <FlatList
  data={book}
  renderItem={renderListItem}
  keyExtractor={(item, index) => `${item._id}_${index}`}
  contentContainerStyle={styles.listContainer}
  showsVerticalScrollIndicator={false}
  onEndReached={handleLoadMore}
  onEndReachedThreshold={0.5}
  refreshing={refresh}
  onRefresh={() => fetchBook(1, true)}
  ListFooterComponent={
    loading && <ActivityIndicator size="large" color="#0000ff" />
  }
  ListHeaderComponent={
    <View style={styles.header}>
      <Text style={styles.headerTitle}>Book Recomendation</Text>
<Text style={styles.headerSubtitle}> Discover great read from community.</Text>
    </View>
  }
  ListEmptyComponent={ <View style={styles.emptyContrainer}>
      <Ionicons
            name={ "book-outline"}
            size={32}
            color={ COLORS.textSecondary}
          />
      <Text style={styles.emptyTitle}>No Recomendation</Text>
<Text style={styles.emptySubtitle}> Be First to share a book</Text>
    </View>}
/>

    </View>
  );
};

export default Home;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
    paddingHorizontal: 10,
  },
  listContainer: {
    paddingVertical: 10,
  },
  bookCard: {
    backgroundColor: "#fff",
    borderRadius: 10,
    marginBottom: 15,
    padding: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  bookHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  userInfo: {
    flexDirection: "row",
    alignItems: "center",
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
  },
  userName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
  },
  bookImageContainer: {
    width: "100%",
    height: 200,
    borderRadius: 10,
    overflow: "hidden",
    marginBottom: 10,
  },
  bookImage: {
    width: "100%",
    height: "100%",
  },
  bookTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    marginTop: 5,
  },
  starContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 5,
  },
   header: {
    paddingVertical: 20,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
    marginBottom: 10,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#222",
    marginBottom: 5,
  },
  headerSubtitle: {
    fontSize: 14,
    color: "#666",
  },
  emptyContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 50,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
    marginTop: 10,
  },
  emptySubtitle: {
    fontSize: 14,
    color: "#666",
    marginTop: 5,
  },
  bookDate:{
    color:"gray"
  },
  
  emptyContrainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 50,
  }

});
