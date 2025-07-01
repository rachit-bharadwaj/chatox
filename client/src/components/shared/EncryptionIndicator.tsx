import { Shield, ShieldCheck, ShieldX, Loader2 } from "lucide-react";
import { useCrypto } from "../../hooks/useCrypto";

interface EncryptionIndicatorProps {
  className?: string;
  showText?: boolean;
}

export default function EncryptionIndicator({ className = "", showText = false }: EncryptionIndicatorProps) {
  const { isInitialized, isGeneratingKeys, canEncrypt } = useCrypto();

  const getIndicatorContent = () => {
    if (isGeneratingKeys) {
      return {
        icon: <Loader2 className="h-4 w-4 animate-spin" />,
        text: "Generating keys...",
        color: "text-yellow-500",
        title: "Generating encryption keys"
      };
    }

    if (!isInitialized) {
      return {
        icon: <Shield className="h-4 w-4" />,
        text: "Initializing...",
        color: "text-gray-500",
        title: "Initializing encryption"
      };
    }

    if (canEncrypt) {
      return {
        icon: <ShieldCheck className="h-4 w-4" />,
        text: "Encrypted",
        color: "text-green-500",
        title: "Messages are end-to-end encrypted"
      };
    }

    return {
      icon: <ShieldX className="h-4 w-4" />,
      text: "Not encrypted",
      color: "text-red-500",
      title: "Encryption not available"
    };
  };

  const { icon, text, color, title } = getIndicatorContent();

  return (
    <div className={`flex items-center gap-1 ${color} ${className}`} title={title}>
      {icon}
      {showText && <span className="text-xs">{text}</span>}
    </div>
  );
}