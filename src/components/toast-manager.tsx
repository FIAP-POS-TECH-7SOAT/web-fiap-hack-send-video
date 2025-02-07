import { toast, ToastOptions } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export class ToastManager {
  static toastIds: any;

  static showToast(message: string, duration: number, id: string): void {
    const options: ToastOptions = {
      autoClose: duration,
      position: "top-right",
    };

    toast(message, options);
  }

  static success(message: string, duration: number, id?: string): void {
    const options: ToastOptions = {
      autoClose: duration,
      type: "success",
      position: "top-right",
    };

    toast(message, options);
  }

  static error(
    message: string,
    duration: number,
    reload: boolean = false,
    id?: string
  ): void {
    const options: ToastOptions = {
      autoClose: duration,
      type: "error",
      position: "top-right",
      onClose: () => {
        if (reload) {
          window.location.reload();
        }
      },
    };

    toast(message, options);
  }

  static warning(message: string, duration: number, id?: string): void {
    const options: ToastOptions = {
      autoClose: duration,
      type: "warning",
      position: "top-right",
    };

    toast(message, options);
  }

  static info(
    message: string,
    duration: number,
    id: string = "default-info-toast"
  ): void {
    if (!toast.isActive(id)) {
      toast.info(message, {
        toastId: id,
        autoClose: duration,
        position: "top-right",
      });
    }
  }
}
