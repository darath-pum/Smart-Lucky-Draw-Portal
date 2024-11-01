import { getAPIURL } from "~/configs";
import { useAuthStore } from "~/store/auth";

export default defineNuxtRouteMiddleware(async (to, from) => {
  // if (process.client) return;
  const authStore = useAuthStore();
  if (to.path !== "/login" && to.path !== "/reset-password/" && to.path !== "/register") {
    try {
      const headers = useRequestHeaders(["cookie"]);
      const res = await $fetch<any>(getAPIURL("/user/session"), {
        headers: { "Content-Type": "application/json", ...headers },
        credentials: "include",
        cache: "no-cache",
        ignoreResponseError: true,
      });
      const { session_data } = res.data;
      authStore.setState(session_data);
      if (to.path === "/users") {
        if (session_data.role !== "admin") {
          return navigateTo("/");
        }
      }
    } catch (err) {
      console.error("Error: " + err);
      return navigateTo("/login");
    }
  }
});
