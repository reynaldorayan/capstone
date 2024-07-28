import axios, { AxiosResponse } from "axios";

export async function sendSms(
  number: string,
  message: string,
  apiKey: string = process.env.NEXT_PUBLIC_SEMAPHORE_API_KEY!,
  senderName: string = process.env.NEXT_PUBLIC_SEMAPHORE_SENDER_NAME!
): Promise<AxiosResponse> {
  const apiUrl = process.env.NEXT_PUBLIC_SEMAPHORE_LINK!;

  const requestData = {
    apikey: apiKey,
    number: number,
    message: message,
    sendername: senderName,
  };

  const headers = {
    "Content-Type": "application/json",
  };

  return await axios.post(apiUrl, requestData, { headers });
}
