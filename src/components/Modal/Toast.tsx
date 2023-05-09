import { useToastMessage, toastMessage } from "../Constants";
import styles from "../../styles/Toast.module.css";
import { useEffect } from "react";

const Toast = () => {
  const [toast] = useToastMessage();

  const message = toast?.message ?? null; // it will be an html component
  const timmer = toast?.timmer || 3000;

  //   const setToastMessage = (value: any) => {
  //     toastMessage.next(value);
  //   };
  //   const handleResetConnection = () => {
  //     setToastMessage(null);
  //   };
  useEffect(() => {
    let timeOut: any;
    if (message) {
      timeOut = setTimeout(() => toastMessage.next(null), timmer);
    }
    return () => {
      clearTimeout(timeOut);
    };
  }, [message, timmer]);
  return (
    <div
      className={styles.ToastWrapper}
      style={{
        opacity: message ? 1 : 0,
        transform: message ? "translateX(0)" : "translateX(-100vh)",
        transition: "all 0.5s ease-out",
      }}
    >
      {message}
    </div>
  );
};

export default Toast;
