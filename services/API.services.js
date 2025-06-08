import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
const apiUrl = process.env.EXPO_PUBLIC_API_URL;
const registerApi = async (payload) => {
  try {
    const response = await axios.post(`${apiUrl}/api/sign-up`, payload);

    console.log("result1", response);

    return {
      data: response?.data,
      error: null,
      meta: response?.meta,
    };
  } catch (error) {
    console.log("AXIOS ERROR", error);

    return {
      data: null,
      error: {
        title: error.title
          ? error.title
          : error.message
          ? error.message
          : "Something Went Wrong",
        status: error.status ? error.status : 500,
      },
      meta: null,
    };
  }
};

const loginApi = async (payload) => {
  try {
    const response = await axios.post(`${apiUrl}/api/login`, payload);

    console.log("result1", response);

    return {
      data: response?.data,
      error: null,
      meta: response?.meta,
    };
  } catch (error) {
    console.log("AXIOS ERROR", error);

    return {
      data: null,
      error: {
        title: error.title
          ? error.title
          : error.message
          ? error.message
          : "Something Went Wrong",
        status: error.status ? error.status : 500,
      },
      meta: null,
    };
  }
};

const createBookRecomendation = async (payload) => {
  try {
    const token = await AsyncStorage.getItem("token");
  
    console.log("payload_!", `${apiUrl}/api/book`,payload);

    const response = await axios.post(`${apiUrl}/api/book`, payload, {
      headers: {
        "Content-Type": "multipart/form-data",
        Authorization: `Bearer ${token}`,
      },
    });
    console.log("response1", response);
    return {
      data: response?.data.data,
      error: response?.data.error,
      meta: response?.data.meta,
    };
  } catch (error) {
    console.log("error", error);

    return {
      data: null,
      error: {
        title: error.title
          ? error.title
          : error.message
          ? error.message
          : "Something Went Wrong",
        status: error.status ? error.status : 500,
      },
      meta: null,
    };
  }
};

const editBookApi = async (bookId,payload) => {
  try {
    const token = await AsyncStorage.getItem("token");
  
    console.log("payload_!", `${apiUrl}/api/book`,payload);

    const response = await axios.patch(`${apiUrl}/api/book/${bookId}`, payload, {
      headers: {
        "Content-Type": "multipart/form-data",
        Authorization: `Bearer ${token}`,
      },
    })
    console.log("response1", response);
    return {
      data: response?.data.data,
      error: response?.data.error,
      meta: response?.data.meta,
    };
  } catch (error) {
    console.log("error", error);

    return {
      data: null,
      error: {
        title: error.title
          ? error.title
          : error.message
          ? error.message
          : "Something Went Wrong",
        status: error.status ? error.status : 500,
      },
      meta: null,
    };
  }
};

const deleteBookRecomendation = async (id) => {
  try {
    const token = await AsyncStorage.getItem("token");
  
    console.log("payload_!", `${apiUrl}/api/book`);

    const response = await axios.delete(`${apiUrl}/api/book/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    console.log("response1", response);
    return {
      data: response?.data.data,
      error: response?.data.error,
      meta: response?.data.meta,
    };
  } catch (error) {
    console.log("error", error);

    return {
      data: null,
      error: {
        title: error.title
          ? error.title
          : error.message
          ? error.message
          : "Something Went Wrong",
        status: error.status ? error.status : 500,
      },
      meta: null,
    };
  }
};

const fetchBookApi = async (payload=1,user,bookId) => {
  try {
    console.log("1356",bookId);
    
    const token = await AsyncStorage.getItem("token");
let   response
    if(user){
      console.log("1_1");
      
   response = await axios.get(
      `${apiUrl}/api/book?page[number]=${payload}&page[size]=2&userId=${user}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
}
else if(bookId){
  
      console.log("1_2",bookId);
   response = await axios.get(
      `${apiUrl}/api/book?bookId=${bookId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
}
else{
   console.log("1_3");
 
   response = await axios.get(
      `${apiUrl}/api/book?page[number]=${payload}&page[size]=2`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
}
 

    if (response) {
      return {
        data: response?.data.data,
        error: response?.data.error,
        meta: response?.data.meta,
      };
    }
  } catch (error) {
    console.log("error2", error);

    return {
      data: null,
      error: {
        title: error.response?.data?.title
          ? error.response.data.title
          : error.message
          ? error.message
          : "Something Went Wrong",
        status: error.response?.status ? error.response.status : 500,
      },
      meta: null,
    };
  }
};

const updateUser=async(payload)=>{
   try {
    const token = await AsyncStorage.getItem("token");
    console.log("payload_!", `${apiUrl}/api/book`,payload);
  const userJson = await AsyncStorage.getItem("user");
      const user = userJson ? JSON.parse(userJson) : null;

    const response = await axios.patch(`${apiUrl}/api/user/${user._id}`, payload, {
      headers: {
        "Content-Type": "multipart/form-data",
        Authorization: `Bearer ${token}`,
      },
    });
    console.log("response1", response);
    return {
      data: response?.data.data,
      error: response?.data.error,
      meta: response?.data.meta,
    };
  } catch (error) {
    console.log("error", error);

    return {
      data: null,
      error: {
        title: error.title
          ? error.title
          : error.message
          ? error.message
          : "Something Went Wrong",
        status: error.status ? error.status : 500,
      },
      meta: null,
    };
  }
}

export {updateUser,editBookApi, registerApi, loginApi, createBookRecomendation, fetchBookApi,deleteBookRecomendation };
