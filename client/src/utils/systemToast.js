import { toast } from "react-toastify";

const baseStyle = {
  borderRadius: "0px",
  border: "2px solid black",
  boxShadow: "6px 6px 0px rgba(0,0,0,1)",
  fontWeight: "900",
  fontSize: "11px",
  letterSpacing: "0.15em",
  textTransform: "uppercase",
  fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace",
  padding: "12px 14px",
};

const baseConfig = {
  position: "top-right",
  autoClose: 2500,
  hideProgressBar: true,
  closeOnClick: true,
  pauseOnHover: false,
  draggable: false,
};

export const systemToast = {
  success: (message) =>
    toast(message, {
      ...baseConfig,
      style: {
        ...baseStyle,
        background: "#bbf7d0", // success green
        color: "black",
      },
    }),

  error: (message) =>
    toast(message, {
      ...baseConfig,
      style: {
        ...baseStyle,
        background: "#fca5a5", // error red
        color: "black",
      },
    }),

  info: (message) =>
    toast(message, {
      ...baseConfig,
      style: {
        ...baseStyle,
        background: "#e5e7eb", // neutral gray
        color: "black",
      },
    }),
};
