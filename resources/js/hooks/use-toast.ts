// resources/js/hooks/use-toast.ts
import { toast as sonnerToast } from "sonner";

interface ToastProps {
  title: string;
  description?: string;
  variant?: "default" | "success" | "error" | "warning" | "info" | "destructive";
}

export function useToast() {
  const toast = ({ title, description, variant = "default" }: ToastProps) => {
    // mapping destructive -> error
    if (variant === "destructive") {
      return sonnerToast.error(title, { description });
    }

    switch (variant) {
      case "success":
        sonnerToast.success(title, { description });
        break;

      case "error":
        sonnerToast.error(title, { description });
        break;

      case "warning":
        sonnerToast.warning(title, { description });
        break;

      case "info":
        sonnerToast.info(title, { description });
        break;

      default:
        sonnerToast(title, { description });
        break;
    }
  };

  return { toast };
}
