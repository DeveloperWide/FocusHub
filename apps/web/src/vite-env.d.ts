/// <reference types="vite/client" />

interface Window {
  adsbygoogle: unknown[];
  Razorpay: new (options: Record<string, unknown>) => {
    open: () => void;
    on: (event: string, handler: (response: unknown) => void) => void;
  };
  webkitAudioContext?: typeof AudioContext;
}