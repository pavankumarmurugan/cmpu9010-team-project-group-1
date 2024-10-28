import { showToastError, showToastSuccess } from "../GenericToasters/GenericToasters";

const apiCall = async (method = "GET", url, data = null, token = null) => {
  try {
    debugger
    const authHeaders = token ? { Authorization: `Bearer ${token}` } : {};

    const options = {
      method,
      headers: {
        "Content-Type": "application/json",
        "Control-Allow-Origin": "*",
        ...authHeaders,
      },
    };

    if (data) {
      options.body = JSON.stringify(data);
    }

    const response = await fetch(url, options);

    if (!response.ok) {
      const errorData = await response.json();
      showToastError(errorData?.message || response.statusText);
      // throw new Error(errorData?.message || 'API call failed');
      return errorData;
    }

    const responseData = await response.json();
    showToastSuccess(responseData?.message);
    return responseData;
  } catch (error) {
    console.error("API call failed:", error);
    showToastError(error.message || "An error occurred");
    // throw error;
  }
};

export default apiCall;
