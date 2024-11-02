import { getAPIURL } from "~/configs";
import type { IAPIResponse } from "~/types";

export const callAPIProgress = async (
  path: string,
  method: string,
  formData: FormData,
  onUploadProgress?: (progress: number) => void
): Promise<IAPIResponse> => {
  return new Promise<IAPIResponse>((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.withCredentials = true;
    xhr.open(method, getAPIURL(path), true);
    xhr.upload.onprogress = (ev: ProgressEvent<EventTarget>) => {
      const progress = ev.loaded / ev.total;
      if (onUploadProgress) onUploadProgress(progress);
    };

    xhr.onreadystatechange = () => {
      if (xhr.readyState !== 4) return;
      console.log("XHR Completed");
      const res: IAPIResponse = {
        status: xhr.status,
        code: xhr.status,
        data: null,
        error: null,
      };
      console.log("XHR response", xhr.response);
      try {
        const responseData = JSON.parse(xhr.response); // Ensure response is parsed
        if (xhr.status < 400) {
          res.data = responseData.data; // Assuming your response has a 'data' field
        } else {
          // Handle API Error
          res.error = responseData.error || "Unknown Error";
        }
      } catch (e) {
        res.error = "Invalid response format";
      }
      resolve(res);
    };

    xhr.onerror = (err) => {
      console.error("XHR Error", err);
      reject({ status: 500, error: "Network Error" });
    };
    
    xhr.send(formData);
  });
};
