import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export const showToastSuccess = (msg) => {
    toast.success(msg, {
      position: "top-right",
    });
  };
  
  export const showToastError = (msg) => {
    toast.error(msg, {
      position: "top-right",
    });
  };
  
  export const showToastNotification = (msg) => {
    toast.warning(msg, {
      position: "top-right",
    });
  };
  
  export const showToastInfo = (msg) => {
    toast.info(msg, {
      position: "top-right",
    });
  };
  