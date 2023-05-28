import enhanceError from "axios/lib/core/enhanceError";
import { getResponseErrorMessage } from "~/utils/v2/handleError";

export default function ({ $axios, store, route, app }) {
  $axios.onRequest((config) => {
    // config.headers.common["Cache-Control"] = "no-cache";
    // if (store.getters['auth/token']) {
    // config.headers.common['Authorization'] = `Bearer ${store.getters['auth/token']}`;
    // }
  });

  $axios.onError((error) => {
    // if ($axios.isCancel(error)) return;
    console.log("$axios.error", $axios.isCancel(error), error);
    // const isAuth = store.getters["auth/check"];
    // const url = error?.config?.url;
    // const code = parseInt(error?.response?.status);
    // if (isAuth && code === 401) {
    //   // store.dispatch("auth/logout");
    //   // app.router.push({name:'auth-login'})
    // } else if (code === 403 && (/\/*contract\/+/.test(url) || /\/*policy\/+/.test(url))) {
    //   store.dispatch("layout/setFlashMessage", { type: "error", text: getResponseErrorMessage(error) });

    //   app.router.push({ path: "/contracts" });
    // }
  });

  // $axios.interceptors.response.use(
  //   function (response) {
  //     console.log("$axios.interceptors.response", response);
  //     if (response?.config?.compatibility) return response;

  //     if (response?.data?.success === false) {
  //       const error = new Error("Ошибка обработки данных");
  //       throw enhanceError(error, response?.config, 412, response.request, response);
  //     }

  //     return response;
  //   },
  //   function (error) {
  //     return Promise.reject(error);
  //   }
  // );
}
