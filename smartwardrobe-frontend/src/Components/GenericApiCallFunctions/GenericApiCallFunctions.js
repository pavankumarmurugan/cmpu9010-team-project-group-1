import { showToastError, showToastSuccess } from "../GenericToasters/GenericToasters";

const reFreshToken = async () => {
  debugger
  let token = localStorage.getItem("user")
    ? JSON.parse(localStorage.getItem("user"))
    : null;

  if (!token) {
    return null;
  }

  const response = await fetch("https://smartwardrobe-backend.azurewebsites.net/auth/refresh", {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token?.refreshToken}`,
    },
  });

  if (!response.ok) {
    const errorData = await response.json();
    showToastError(errorData?.message || response.statusText);
    return null;
  }

  const responseData = await response.json();
  if(responseData){
    token.token = responseData?.token;
    token.refreshToken = responseData?.refreshToken;
  }
  localStorage.setItem("token", token);
  return token;
}


const apiCall = async (method = "GET", url, data = null, token = null) => {
  try {
    debugger
    const authHeaders = token ? { Authorization: `Bearer ${token}` } : {};

    const options = {
      method,
      headers: {
        "Content-Type": data ? "application/json" : undefined,
        ...authHeaders,
      },
    };

    if (data) {
      options.body = JSON.stringify(data);
    }

    const response = await fetch(url, options);

    if (!response.ok) {
      const errorData = await response.json();
      if(errorData?.message !== "USER ALREADY LIKED THIS MODEL"){
        showToastError(errorData?.message || response.statusText);
      }
      return errorData;
    }
    const responseData = await response.json();
    // showToastSuccess(responseData?.message);
    return responseData;
  } catch (error) {
    console.error("API call failed:", error);
    showToastError(error.message || "An error occurred");
  }
};

export default apiCall;
