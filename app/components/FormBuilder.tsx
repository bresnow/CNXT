import React from "react";
import { Form } from "remix";
import InputText, { InputTextProps } from "./InputText";

const FormBuilder = () => {
  return {
    Form({
      children,
      ariaDescribed,
      method,
      action,
    }: {
      children: React.PropsWithChildren<any>;
      ariaDescribed?: string;
      method?: "get" | "post";
      action?: string;
    }) {
      return (
        <Form
          method={method ?? "post"}
          action={action && action}
          aria-describedby={ariaDescribed}
          className="flex flex-col md:flex-row w-3/4 md:w-full max-w-sm md:space-x-3 space-y-3 md:space-y-0 justify-center"
        >
          {children}
        </Form>
      );
    },
    Input(prop: InputTextProps) {
      return (
        <InputText
          type={prop?.type}
          label={prop?.label}
          required={prop?.required}
          error={prop?.error}
          icon={prop?.icon}
          helper={prop?.helper}
          name={prop?.name}
          disabled={prop?.disabled}
          square={prop?.square}
          withForceIndications={prop?.withForceIndications}
          placeholder={prop?.placeholder}
          id={`"form-${prop?.label}`}
        />
      );
    },
    Submit({
      label,
      onSubmit,
      className,
      disabled,
      name,
    }: {
      label: string;
      onSubmit: () => any;
      className?: string;
      disabled?: boolean;
      name?: string;
    }) {
      return (
        <button
          onSubmit={onSubmit()}
          className={
            className ??
            `flex-shrink-0 px-4 py-2 text-base font-semibold text-white bg-purple-600 rounded-lg shadow-md hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-purple-200`
          }
          type="submit"
          disabled={disabled}
          name={name && name}
        >
          {label}
        </button>
      );
    },
    Switch({
      onClick,
      state,
      name,
      value,
    }: {
      onClick: () => void;
      state: boolean;
      name: string;
      value: string;
    }) {
      return (
        <div className="flex justify-center items-center m-auto">
          <input type="hidden" name={name} value={value} />
          <div
            onClick={onClick}
            className={`w-20 h-8 flex items-center transition-all duration-200 rounded-full border-l-2 border-b-2 border-black shadow-xl mx-3 px-1 ${
              state
                ? "bg-gradient-to-b from-blue-200 to-purple-50 "
                : "bg-gradient-to-b from-red-200 to-red-50 "
            }`}
          >
            <span className="">
              <svg
                width="20"
                fill={`${state ? "#3497fb" : "#cb2326"}`}
                height="70"
                className={`bg-white w-5 h-5 transition-all duration-200  rounded-full shadow-md transform ${
                  state ? "translate-x-12" : "translate-x-0"
                }`}
                viewBox="0 0 1792 1792"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d={
                    "M1523 1339q-22-155-87.5-257.5t-184.5-118.5q-67 74-159.5 115.5t-195.5 41.5-195.5-41.5-159.5-115.5q-119 16-184.5 118.5t-87.5 257.5q106 150 271 237.5t356 87.5 356-87.5 271-237.5zm-243-699q0-159-112.5-271.5t-271.5-112.5-271.5 112.5-112.5 271.5 112.5 271.5 271.5 112.5 271.5-112.5 112.5-271.5zm512 256q0 182-71 347.5t-190.5 286-285.5 191.5-349 71q-182 0-348-71t-286-191-191-286-71-348 71-348 191-286 286-191 348-71 348 71 286 191 191 286 71 348z"
                  }
                />
              </svg>
            </span>
          </div>
        </div>
      );
    },
  };
};
export default FormBuilder;
