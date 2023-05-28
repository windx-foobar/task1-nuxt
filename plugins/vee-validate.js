import Vue from "vue";
import { extend, ValidationObserver, ValidationProvider, setInteractionMode } from "vee-validate";
import {
  required,
  length,
  min,
  max,
  email,
  numeric,
  double,
  alpha_num,
  alpha,
  regex,
  digits,
  min_value,
  max_value,
} from "vee-validate/dist/rules";
// import ru from "vee-validate/dist/locale/ru";

setInteractionMode("betterPassive", ({ errors, flags, value }) => {
  if (errors.length) {
    return {
      on: ["input", "change"],
      debounce: 350,
    };
  }

  return {
    on: ["change", "blur"],
  };
});

export default ({ app }) => {
  extend("betweenDates", {
    params: ["dates"],
    validate: (valueDate, { dates }) => {
      // TODO moment compare dates
      const [compareDate, today] = dates;

      const d1 = new Date(today.split(".").reverse().join("-"));
      const d2 = new Date(valueDate.split(".").reverse().join("-"));
      const d3 = new Date(compareDate.split(".").reverse().join("-"));
      let bool = +d1 >= +d2;
      let res = +d2 >= d3;
      return {
        valid: bool && res,
      };
    },
    message: "Между значениями",
  });

  extend("between", {
    params: ["target"],
    validate: (value, target) => {
      return {
        valid: true,
      };
    },
    message: "Введите между",
  });

  extend("required", {
    ...required,
    message: "Поле {_field_} обязательно для заполнения",
  });

  extend("decimal", {
    validate: (value, { decimals = 2 }) => {
      if (value === null || value === undefined || value === "" || value < 0) {
        return {
          valid: false,
        };
      }
      if (Number(decimals) === 0) {
        return {
          valid: /^-?\d*$/.test(value),
        };
      }
      const regexPart = decimals === "*" ? "+" : `{1,${decimals}}`;
      const regex = new RegExp(`^[-+]?\\d{1,2}((\\.|\\,)\\d${regexPart})?([eE]{1}[-]?\\d+)?$`);
      return {
        valid: regex.test(value),
      };
    },
    message: "Введите {_field_}",
  });

  extend("today", {
    validate: (value) => {
      const d1 = new Date(value.split(".").reverse().join("-"));
      d1.setHours(0, 0, 0, 0);
      const d2 = new Date();
      d2.setHours(0, 0, 0, 0);
      return +d1 >= +d2;
    },
    message: "Дата начала не может быть раньше сегодняшнего числа",
  });

  extend("tillToday", {
    validate: (value) => {
      const d1 = new Date(value.split(".").reverse().join("-"));
      const d2 = new Date();
      return +d1 <= +d2;
    },
    message: "Дата не может быть позже сегодняшнего числа",
  });

  extend("phone", {
    ...regex,
    message: "Введите корректный номер",
  });

  extend("alpha_num", {
    ...alpha_num,
    message: "поле {_field_} может содержать только буквенно-цифровые символы ",
  });

  extend("after", {
    validate: (value, { date = "2000-01-01" }) => {
      const d1 = new Date(value.split(".").reverse().join("-"));
      const d2 = new Date(date);
      return +d1 >= +d2;
    },
    message: (field, { date = "2000-01-01" }) =>
      `Дата начала договора должна быть не раньше ${date.split("-").reverse().join(".")}`,
  });

  extend("double", {
    ...double,
    message: "Поле содержит недопустимые символы",
  });

  extend("digits", {
    ...digits,
    message: "Поле должно состоять из {length} цифр",
  });

  extend("regex", {
    ...regex,
    message: "Пароль должен содержать от 6 до 12 символов и как минимум 1 цифру в верхнем и 1 в нижнем регистре",
  });

  extend("alpha", {
    ...alpha,
    message: "Поле содержит недопустимые символы",
  });

  extend("nameregex", {
    ...regex,
    message: "Поле содержит недопустимые символы",
  });

  extend("numeric", {
    ...numeric,
    message: "Поле содержит недопустимые символы",
  });

  extend("email", {
    ...email,
    message: "Введите корректный {_field_}",
  });

  extend("length", {
    ...length,
    message: "Длина поля - {length} символа",
  });

  extend("min_value", {
    ...min_value,

    params: ["min"],
    message: `{_field_} не может быть меньше {min}`,
  });

  extend("max_value", {
    ...max_value,

    params: ["max"],
    message: `{_field_} не может быть больше {max}`,
  });

  extend("min", {
    ...min,
    message: `{_field_} не может быть короче {length} символов`,
  });

  extend("max", {
    ...max,
    message: `{_field_} не может быть длиннее {length} символов`,
  });

  extend("password", {
    params: ["target"],
    validate(value, { target }) {
      return value === target;
    },
    message: "Пароли не совпадают",
  });

  extend("address", {
    params: ["target"],
    validate(value, { target }) {
      return value === target;
    },
    message: "Необходимо выбрать адрес из списка",
  });
};

const ValidationObserverExtended = ValidationObserver.extend({
  methods: {
    setErrors(errors) {
      Object.keys(errors).forEach((key) => {
        const provider = this.refs[key];
        if (!provider) {
          if (!process.env.CHECK_SERVER_VALIDATION_DISABLE) {
            console.warn(`[!] Сервер вернул ошибку для поля "${key}", но поле не найдено`);
          }
          return;
        }
        let errorArr = errors[key] || [];
        errorArr = typeof errorArr === "string" ? [errorArr] : errorArr;

        provider.setErrors(errorArr);
      });

      this.observers.forEach((observer) => {
        observer.setErrors(errors);
      });
    },
  },
});

Vue.component("ValidationObserver", ValidationObserverExtended);
Vue.component("ValidationProvider", ValidationProvider);

// localize("ru", ru);
