import { showToastError, showToastSuccess } from "../GenericToasters/GenericToasters";

const apiCall = async (method = "GET", url, data = null, token = null) => {
  try {
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
      showToastError(errorData?.message || response.statusText);
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
