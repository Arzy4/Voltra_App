type CardProps = {
  children: React.ReactNode;
};

export default function Card({ children }: CardProps) {
  return (
    <div className="rounded-2xl border border-border-soft bg-primary-green p-6 shadow-lg max-w-[300px] md:max-w-[500px] lg:max-w-[700px] w-full">
      {children}
    </div>
  );
}