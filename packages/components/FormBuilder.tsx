import React, { FormEventHandler } from "react";
import { Form, useLocation } from "remix";
import { log } from "~/lib/console-utils";
import InputText, { InputTextProps } from "./InputText";
function isHtmlElement(object: any) {
  return object != null && typeof object.tagName === "string";
}

function isButtonElement(object: any) {
  return isHtmlElement(object) && object.tagName.toLowerCase() === "button";
}

function isFormElement(object: any) {
  return isHtmlElement(object) && object.tagName.toLowerCase() === "form";
}

function isInputElement(object: any) {
  return isHtmlElement(object) && object.tagName.toLowerCase() === "input";
}
interface ButtonProps {
  rounded?: boolean;
  color?:
    | "white"
    | "gray"
    | "red"
    | "yellow"
    | "green"
    | "blue"
    | "purple"
    | "pink"
    | "indigo";
  icon?: JSX.Element;
  disabled?: boolean;
  submit?: "submit" | "reset" | "button";
  isFat?: boolean;
  label?: string;
  onClick?: () => void;
}
const colors = {
  white:
    "bg-white hover:bg-gray-100 focus:ring-indigo-500 focus:ring-offset-indigo-200 text-indigo-500",
  gray: "bg-gray-600 hover:bg-gray-700 focus:ring-gray-500 focus:ring-offset-gray-200",
  red: "bg-red-600 hover:bg-red-700 focus:ring-red-500 focus:ring-offset-red-200",
  yellow:
    "bg-yellow-600 hover:bg-yellow-700 focus:ring-yellow-500 focus:ring-offset-yellow-200",
  green:
    "bg-green-500 hover:bg-green-700 focus:ring-green-500 focus:ring-offset-green-200",
  blue: "bg-blue-600 hover:bg-blue-700 focus:ring-blue-500 focus:ring-offset-blue-200",
  indigo:
    "bg-indigo-600 hover:bg-indigo-700 focus:ring-indigo-500 focus:ring-offset-indigo-200",
  purple:
    "bg-purple-600 hover:bg-purple-700 focus:ring-purple-500 focus:ring-offset-purple-200",
  pink: "bg-pink-600 hover:bg-pink-700 focus:ring-pink-500 focus:ring-offset-pink-200",
};
const FormBuilder = () => {
  return {
    Form<T>({
      children,
      ariaDescribed,
      method,
      action,
      className,
      reloadDocument,
      encType,
      replace,
      onSubmit,
    }: {
      children: React.PropsWithChildren<T>;
      ariaDescribed?: string;
      method?: "get" | "post";
      action?: string;
      className?: string;
      reloadDocument?: boolean;
      encType?: "multipart/form-data" | "application/x-www-form-urlencoded";
      replace?: boolean;
      onSubmit?: FormEventHandler<HTMLFormElement>;
    }) {
      let { pathname } = useLocation();
      return (
        <>
          {encType === "multipart/form-data" ? (
            <form
              encType={encType}
              method={method ?? "post"}
              action={action ?? pathname}
              aria-describedby={ariaDescribed}
              onSubmit={({ target }) => {
                if (target instanceof HTMLFormElement) {
                  const formData = new FormData(target);
                  console.log(formData, "Form");
                }
              }}
              className={
                className ??
                "flex flex-col  w-3/4 md:w-2/3 max-w-xl space-y-3 justify-center mx-auto"
              }
            >
              {children}
            </form>
          ) : (
            <Form
              method={method ?? "post"}
              action={action}
              aria-describedby={ariaDescribed}
              reloadDocument={reloadDocument}
              replace={replace}
              onSubmit={onSubmit}
              className={
                className ??
                "flex flex-col  w-3/4 md:w-2/3 max-w-xl space-y-3 justify-center mx-auto"
              }
            >
              {children}
            </Form>
          )}
        </>
      );
    },
    Input(prop: InputTextProps) {
      return <InputText {...prop} id={`"form-${prop?.label}`} />;
    },
    Submit(props: ButtonProps) {
      return (
        <button
          onClick={props.onClick}
          type={props.submit ?? "submit"}
          disabled={props.disabled}
          className={`${props.isFat ? "py-3 px-4 " : "py-2 px-2 "} ${
            props.icon ? "flex justify-center items-center " : ""
          } ${
            colors[props.color ?? "indigo"]
          } text-white w-full transition ease-in duration-200 hover:mb-2 text-center text-base font-semibold shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2 ${
            props.disabled ? " opacity-70 cursor-not-allowed" : ""
          }${!props.label ? " w-8 h-8" : ""} ${
            props.rounded ? "rounded-full" : "rounded-lg "
          } mx-auto mt-1  `}
        >
          {props.icon && props.icon}

          {props.label && props.label}
        </button>
      );
    },
    Switch({
      onClick,
      state,
      name,
      value,
      color,
      icon,
      rounded,
      label,
    }: {
      onClick: (e: any) => void;
      state: boolean;
      name: string;
      value: string;
      color?:
        | "white"
        | "gray"
        | "red"
        | "yellow"
        | "green"
        | "blue"
        | "purple"
        | "pink"
        | "indigo";
      icon?: JSX.Element;
      rounded?: boolean;
      label?: string;
    }) {
      const colorPicker = (primary: string, secondary: string) =>
        `bg-${primary}-500 hover:bg-${primary}-700 focus:ring-${secondary}-500 focus:ring-offset-${secondary}-200`;

      return (
        <div className="flex justify-center items-center m-auto w-10">
          <label className="text-gray-700 px-4">{label}</label>
          <input type="hidden" name={name} value={value} />
          <div
            onClick={onClick}
            className={` py-2 px-10 ${
              icon && "flex justify-center items-center "
            } ${
              colors[color ?? "indigo"]
            } text-white w-full transition ease-in duration-200  text-center text-base font-semibold shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2 
       ${rounded ? "rounded-full" : "rounded-lg "}  
           mx-auto mt-1`}
          >
            <span className="">
              {icon ?? (
                <svg
                  width="20"
                  height="70"
                  className={` bg-white w-6 h-6 transition-all duration-200  rounded-full shadow-md transform ${
                    state ? "-translate-x-8" : "translate-x-2"
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
              )}
            </span>
          </div>
        </div>
      );
    },
  };
};
export default FormBuilder;
