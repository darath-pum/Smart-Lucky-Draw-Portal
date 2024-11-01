import { getAPIURL } from "~/configs";
import type { IAPIResponse } from "~/types";

export const callAPI = async (path: string, method?: string, body?: any): Promise<IAPIResponse> => {
  const headers = useRequestHeaders(["cookie"]);
  const h: any = {
    ...headers,
    "Content-Type": "application/json",
    Accept: "application/json",
  };
  if (body && body instanceof FormData) {
    delete h["Content-Type"];
  }
  const resp: IAPIResponse = {
    status: 200,
    code: 200,
  };
  const res = await $fetch<any>(getAPIURL(path), {
    headers: h,
    credentials: "include",
    cache: "no-cache",
    //@ts-expect-error
    method: method || "GET",
    body,
    ignoreResponseError: true,
  });
  const { code, error, data } = res;
  resp.code = code;
  resp.error = error;
  resp.data = data;
  if (error) {
    resp.status = code >= 500 ? 500 : 400;
  }
  return resp;
};
