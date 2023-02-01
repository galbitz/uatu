import { base64ToBytes, bytesToBase64 } from "./base64";
import type { EncryptedData } from "./types";

const encoder = new TextEncoder();
const decoder = new TextDecoder();

async function PBKDF2(
  password: string,
  salt: Uint8Array,
  iterations: number,
  length: number,
  hash: string,
  algorithm = "AES-CBC"
) {
  const keyMaterial = await crypto.subtle.importKey(
    "raw",
    encoder.encode(password),
    { name: "PBKDF2" },
    false,
    ["deriveKey"]
  );

  return await crypto.subtle.deriveKey(
    {
      name: "PBKDF2",
      salt: salt,
      iterations,
      hash,
    },
    keyMaterial,
    { name: algorithm, length },
    false, // we don't need to export our key!!!
    ["encrypt", "decrypt"]
  );
}

export async function encrypt(
  password: string,
  toEncrypt: string
): Promise<EncryptedData> {
  const salt = crypto.getRandomValues(new Uint8Array(16));
  const iv = crypto.getRandomValues(new Uint8Array(16));
  const key = await PBKDF2(password, salt, 100000, 256, "SHA-256");
  const plain_text = encoder.encode(toEncrypt);
  const encrypted = await crypto.subtle.encrypt(
    { name: "AES-CBC", iv },
    key,
    plain_text
  );

  return {
    salt_base64: bytesToBase64(salt),
    iv_base64: bytesToBase64(iv),
    ciphertext_base64: bytesToBase64(new Uint8Array(encrypted)),
  };
}

export async function decrypt(password: string, encryptedData: EncryptedData) {
  const key = await PBKDF2(
    password,
    base64ToBytes(encryptedData.salt_base64),
    100000,
    256,
    "SHA-256"
  );
  return decoder.decode(
    await crypto.subtle.decrypt(
      { name: "AES-CBC", iv: base64ToBytes(encryptedData.iv_base64) },
      key,
      base64ToBytes(encryptedData.ciphertext_base64)
    )
  );
}
