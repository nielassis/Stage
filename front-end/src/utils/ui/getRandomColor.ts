export function generateRandomHexColor(): string {
  const letters = "0123456789ABCDEF";
  let color = "#";
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}

export function getUserAvatarColor(key: string, persist = false): string {
  if (typeof window === "undefined") return "#888888";

  const storageKey = `avatarColor_${key}`;
  let color = localStorage.getItem(storageKey);

  if (!color) {
    color = generateRandomHexColor();
    if (persist) {
      localStorage.setItem(storageKey, color);
    }
  }

  return color;
}
