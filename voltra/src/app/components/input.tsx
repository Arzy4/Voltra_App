type InputProps = {
  type: string;
  placeholder: string;
};

export default function Input({
  type,
  placeholder,
}: InputProps) {
  return (
    <input
      type={type}
      placeholder={placeholder}
      className="
        w-full
        rounded-xl
        border
        border-border-soft
        px-4
        py-3
        outline-none
        bg-white
      "
    />
  );
}