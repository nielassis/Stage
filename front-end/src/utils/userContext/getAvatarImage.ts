export const getAvatarLetters = (name: string) => {
  const parts = name.split(" ");
  return parts.length >= 2
    ? `${parts[0][0]}${parts[1][0]}`.toUpperCase()
    : name[0].toUpperCase();
};
