import { isFunction, isObject } from "lodash";

function _getStatusMessage(status) {
  let message = "";
  switch (status) {
    case 200:
      message = "All done. Request successfully executed";
      break;
    case 201:
      message = "Data successfully created";
      break;
    case 400:
      message = "Bad Request";
      break;
    case 401:
      message = "Need auth";
      break;
    case 404:
      message = "Not found";
      break;
    case 503:
      message = "Service Unavailable";
      break;
    default:
      message = "Something wrong. Client default error message";
      break;
  }
  return message;
}

export function getResponseErrorMessage(error) {
  if (error?.response?.data?.message) return error.response.data.message;
  if (error?.response?.data?.errors) {
    const { errors } = error?.response?.data;
    return Array.isArray(errors)
      ? isObject(errors?.[0])
        ? Object.values(errors?.[0])?.join("\r\n")
        : errors.join("\r\n")
      : errors;
  }
  if (error?.isAxiosError) return error?.response?.data;
  if (error.message) return error.message;
  if (error.errors) return error.errors;
  return "Неизвестная ошибка";
}

export default function handleError(error, { $notify, callback } = {}) {
  // console.trace(error);
  const message = getResponseErrorMessage(error);

  if (message instanceof Blob) {
    const fr = new FileReader();

    fr.onload = function () {
      const data = JSON.parse(this.result);

      console.error("[!] handleError", error, data?.message?.[0] || data?.messages?.[0]);
      if ($notify) {
        $notify({
          type: "error",
          text: data?.message?.[0] || data?.messages?.[0],
        });
      }
    };

    fr.readAsText(message);
    return;
  }

  console.error("[!] handleError", [error, message]);
  if ($notify) {
    $notify({
      type: "error",
      text: message,
      // duration: 100000000,
      data: error.payload || {},
    });
  }

  if (callback && isFunction(callback)) {
    callback(error?.response?.data);
  }
}
