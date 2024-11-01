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

    const res: IAPIResponse = {
      status: 200,
      code: 200,
    };

    xhr.onreadystatechange = () => {
      if (xhr.readyState !== 4) return;
      console.log("XHR Completed");
      // Handle request completed
      res.status = xhr.status;
      console.log("XHR response", xhr.response);
      if (xhr.status < 400) {
        // Successful
        res.data = xhr.response.data;
      } else {
        // Handle API Error
        res.error = xhr.response.error || "Unknown Error";
      }
      resolve(res);
    };
    xhr.onerror = (err) => {
      console.error("XHR Error", err);
    };
    xhr.send(formData);
  });
};
