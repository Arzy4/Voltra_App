type CardProps = {
  children: React.ReactNode;
};

export default function Card({ children }: CardProps) {
  return (
    <div className="rounded-2xl border border-border-soft bg-primary-green p-6 shadow-lg max-w-md">
      {children}
    </div>
  );
}