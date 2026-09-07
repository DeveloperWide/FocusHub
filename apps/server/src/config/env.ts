const requiredEnv = (name: string): string => {
  const value = process.env[name];

  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }

  return value;
};

export const env = {
  RAZORPAY_KEY_ID: requiredEnv("RAZORPAY_KEY_ID"),
  RAZORPAY_KEY_SECRET: requiredEnv("RAZORPAY_KEY_SECRET"),
};
