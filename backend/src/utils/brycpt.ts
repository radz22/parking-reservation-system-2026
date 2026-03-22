import bcrypt from 'bcrypt';

export const hashText = async (text: string): Promise<string> => {
  const salt = await bcrypt.genSalt(12);
  return bcrypt.hash(text, salt);
};

export const compareTextToHashedText = async (
  plainText: string,
  hashedText: string
): Promise<boolean> => {
  try {
    return await bcrypt.compare(plainText, hashedText);
  } catch (error) {
    return false;
  }
};
