interface CardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
}

export function Card({ children, className = "", hover = true }: CardProps) {
  return (
    <div
      className={`rounded-2xl border border-gray-200 bg-white p-6 ${
        hover ? "transition-shadow duration-200 hover:shadow-lg" : ""
      } ${className}`}
    >
      {children}
    </div>
  );
}
