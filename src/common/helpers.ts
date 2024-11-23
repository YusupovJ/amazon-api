export const generateOtp = () => {
  return Number(Date.now().toString().slice(0, 5));
};

export const addMinutes = (minutes: number) => {
  return new Date(new Date().getTime() + minutes * 60000);
};

export const exclude = <T, K extends keyof T>(obj: T, keys: K[]): Omit<T, K> => {
  for (const key of keys) {
    delete obj[key];
  }
  return obj;
};
