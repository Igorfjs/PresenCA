"use client";
import { useCallback, useState } from "react";

type ToastMessage = { id: number; title: string; description?: string };

/** Lightweight local toast store. Replace the implementation with an API-backed notification service as needed. */
export function useToast() {
  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  const dismiss = useCallback((id: number) => setToasts((items) => items.filter((item) => item.id !== id)), []);
  const toast = useCallback((title: string, description?: string) => {
    const id = Date.now() + Math.random();
    setToasts((items) => [...items, { id, title, description }]);
    window.setTimeout(() => dismiss(id), 3200);
  }, [dismiss]);
  return { toast, toasts, dismiss };
}
