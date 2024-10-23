import { showToastError } from "../GenericToasters/GenericToasters";

const apiCall = async (url, method = "GET", data = null, token = null) => {
  try {
    debugger;
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

    const response = await fetch(url, options)
      // .then((response) => response.json())
      // .then((data) => {
      //   if (data) {
      //     return data;
      //   }
      // })
      // .catch((err) => {
      //   return err;
      // });
    if (!response.ok) {
      // throw new Error(`HTTP error! Status: ${response.status}`);
      showToastError(response.statusText);
      return;
    }

    const result = await response.json();
    return result;
  } catch (error) {
    console.error("API call failed:", error);
    throw error;
  }
};

export default apiCall;
