import crypto from "crypto";

const password = "lcslime14a5";

export function decrypt(encryptedData: any) {
  // Extract the first 16 bytes for the IV
  const iv = encryptedData.slice(0, 16);
  const dataToDecrypt = encryptedData.slice(16);

  // Key derivation (PBKDF2 with SHA-1, 100 iterations)
  const key = crypto.pbkdf2Sync(password, iv, 100, 16, "sha1");

  // AES decryption (CBC mode and PKCS7 padding)
  const decipher = crypto.createDecipheriv("aes-128-cbc", key, iv);
  decipher.setAutoPadding(true);

  let decrypted: any = decipher.update(dataToDecrypt);
  decrypted += decipher.final("utf8");

  return decrypted;
}
export function encrypt(data: any) {
  // Generate a random IV
  const iv = crypto.randomBytes(16);

  // Derive a key using the password and IV (similar to Rfc2898DeriveBytes)
  const key = crypto.pbkdf2Sync(password, iv, 100, 16, "sha1");

  // AES encryption
  const cipher = crypto.createCipheriv("aes-128-cbc", key, iv);
  const encrypted = Buffer.concat([
    cipher.update(data, "utf8"),
    cipher.final(),
  ]);

  // Concatenate IV and encrypted data
  const ivAndEncryptedData = Buffer.concat([iv, encrypted]);

  return ivAndEncryptedData;
}
