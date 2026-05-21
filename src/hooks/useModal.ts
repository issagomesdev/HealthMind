import { useState, useCallback } from "react";

export type AppModalType = "success" | "error" | "warning" | "info" | "coming-soon";

interface AppModalConfig {
  type?: AppModalType;
  title: string;
  message?: string;
  actionLabel?: string;
  onClose?: () => void;
}

export function useModal() {
  const [visible, setVisible] = useState(false);
  const [config, setConfig] = useState<AppModalConfig>({ title: "" });

  const show = useCallback((cfg: AppModalConfig) => {
    setConfig(cfg);
    setVisible(true);
  }, []);

  const hide = useCallback(() => {
    setVisible(false);
  }, []);

  const modalProps = {
    visible,
    type: (config.type ?? "info") as AppModalType,
    title: config.title,
    message: config.message,
    actionLabel: config.actionLabel ?? "Entendi",
    onClose: () => {
      hide();
      config.onClose?.();
    },
  };

  return { show, hide, modalProps };
}
