import { showToastError, showToastSuccess } from "../GenericToasters/GenericToasters";

const apiCall = async (method = "GET", url, data = null, token = null) => {
  try {
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

    // Make the API call using async/await
    const response = await fetch(url, options);

    if (!response.ok) {
      // Show an error if the response was not OK
      const errorData = await response.json();
      showToastError(errorData?.message || response.statusText);
      throw new Error(errorData?.message || 'API call failed');
    }

    // Process and return the response data
    const responseData = await response.json();
    showToastSuccess(responseData?.message);
    return responseData;
  } catch (error) {
    // Handle any errors that occur during the fetch
    console.error("API call failed:", error);
    showToastError(error.message || "An error occurred");
    throw error;  // Rethrow the error so it can be caught by the calling function
  }
};

export default apiCall;
