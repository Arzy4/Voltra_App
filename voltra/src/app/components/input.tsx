import { InputHTMLAttributes } from "react";

type InputProps = InputHTMLAttributes<HTMLInputElement>;

export default function Input({
  className = "",
  ...props
}: InputProps) {
  return (
    <input
      {...props}
      className={`w-full rounded-xl border border-[2px] px-4 py-3 outline-none focus:ring-2 focus:ring-primary-green ${className}`}
    />
  );
}