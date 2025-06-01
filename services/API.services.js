import axios from "axios";
const apiUrl = process.env.EXPO_PUBLIC_API_URL;
const registerApi = async (payload) => {
  try {
     const response=await  axios.post(`${apiUrl}/api/sign-up`,payload )
    
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

const loginApi=async (payload)=>{
  try {
     const response=await  axios.post(`${apiUrl}/api/login`,payload )
    
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
}

export { registerApi,loginApi };
