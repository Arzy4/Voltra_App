type ButtonProps = {
  text: string;
};

export default function Button({ text }: ButtonProps) {
  return (
    <button
      className="
        w-full
        rounded-xl
        bg-primary-green
        px-6
        py-3
        font-semibold
        text-white
        hover:opacity-90
        duration-300
      "
    >
      {text}
    </button>
  );
}