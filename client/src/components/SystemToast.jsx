import { toast } from "react-toastify";

const VARIANTS = {
  success: "bg-[#BEF264]",
  error: "bg-[#FCA5A5]",
  info: "bg-[#A8DADC]",
  warning: "bg-[#FDE047]",
};

export const SystemToast = ({
  message,
  type = "info",
}) => {
  return (
    <div
      className={`
        w-full
        border-2 border-black
        shadow-[4px_4px_0px_0px_#000]
        px-4 py-3
        font-mono font-black uppercase
        tracking-wide text-[11px]
        text-black
        ${VARIANTS[type]}
      `}
    >
      {message}
    </div>
  );
};

export const showToast = ({
  message,
  type = "info",
}) => {
  toast(<SystemToast message={message} type={type} />, {
    closeButton: false,
    hideProgressBar: false,
  });
};
