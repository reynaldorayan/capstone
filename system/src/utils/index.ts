import { TimeValue } from "@react-types/datepicker";
import axios from "axios";
import clsx, { ClassValue } from "clsx";
import dayjs from "dayjs";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getEnv(key: string) {
  return process.env[key];
}

export function capitalize(str: string) {
  return str.charAt(0).toUpperCase() + lowercase(str.slice(1));
}

export function lowercase(str: string) {
  return str.toLowerCase();
}

export function uppercase(str: string) {
  return str.toUpperCase();
}

export function pascalcase(str: string) {
  return str
    .split(" ")
    .map((word) => capitalize(word))
    .join("");
}

export function kebabcase(str: string) {
  return str
    .split(" ")
    .map((word) => lowercase(word))
    .join("-");
}

export function snakecase(str: string) {
  return str
    .split(" ")
    .map((word) => lowercase(word))
    .join("_");
}

export function camelcase(str: string) {
  return str
    .split(" ")
    .map((word, idx) => (idx === 0 ? lowercase(word) : capitalize(word)))
    .join("");
}

export function slug(str: string) {
  return kebabcase(str);
}

export function genOtp() {
  return Math.floor(100000 + Math.random() * 900000);
}

export function genBookNo() {
  return `B${Math.floor(100000 + Math.random() * 900000)}`;
}

export function peso(value: number): string {
  return new Intl.NumberFormat("en-PH", {
    style: "currency",
    currency: "PHP",
  }).format(value);
}

export async function fetcher(url: string) {
  return axios.get(url).then((res) => res.data);
}

export function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export function getUniqueStrings(array: string[]): string[] {
  return [...new Set(array)];
}

export async function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
  });
}

export async function base64ToFile(base64: string): Promise<File> {
  const [, mime, data] = base64.match(/data:(.*);base64,(.*)/);

  const buffer = Buffer.from(data, "base64");

  return new File([buffer], "file", { type: mime });
}

export function maskEmail(email: string): string {
  // Split the email into parts before and after '@'
  const parts: string[] = email.split("@");

  // Check if there's a valid email format
  if (parts.length !== 2 || parts[0].length === 0 || parts[1].length === 0) {
    return email; // Return original email if format is incorrect
  }

  // Get the first part (before '@') and mask it
  const masked: string = parts[0].substring(0, 4) + "...@" + parts[1]; // Change the number in the substring to increase or decrease the number of masked characters

  return masked;
}

export function maskMobileNumber(mobileNumber: string): string {
  // Remove non-numeric characters from the input mobile number
  const numericPart: string = mobileNumber.replace(/\D/g, "");

  // Check if the numeric part has at least 4 characters
  if (numericPart.length < 4) {
    return mobileNumber; // Return original number if it's too short to mask
  }

  // Extract the last 4 digits of the numeric part
  const lastFourDigits: string = numericPart.slice(-4);

  // Mask the rest of the digits with asterisks
  const maskedPart: string = "*".repeat(numericPart.length - 4);

  // Combine the masked part with the last 4 digits
  const maskedMobileNumber: string = maskedPart + lastFourDigits;

  return maskedMobileNumber;
}

export const calculateDaysInRanges = (from: Date, to: Date) => {
  if (from instanceof Date && to instanceof Date) {
    const days = dayjs(to).diff(dayjs(from), "day");
    return days;
  }
  return 0;
};

export function timeValueToString(time: TimeValue): string {
  const { hour, minute, second } = time;

  // Pad the numbers with leading zeros if necessary
  const paddedHour = String(hour).padStart(2, "0");
  const paddedMinute = String(minute).padStart(2, "0");
  const paddedSecond = String(second).padStart(2, "0");

  let timeString = `${paddedHour}:${paddedMinute}:${paddedSecond}`;

  return timeString;
}

export function timeStringToTimeValue(timeString: string): TimeValue {
  if (!timeString) return null;

  // Split the main time into hour, minute, and second
  const [hour, minute, second] = timeString.split(":").map(Number);

  // Create a new TimeValue object and assign the values
  const timeValue = {
    hour: hour || 0,
    minute: minute || 0,
    second: second || 0,
    millisecond: 0,
  } as TimeValue;

  // Return the TimeValue object
  return timeValue;
}
