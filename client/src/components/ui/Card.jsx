import { forwardRef } from "react";

const Card = forwardRef(function Card({ children, className = "", ...rest }, ref) {
  return (
    <section
      ref={ref}
      className={`bg-white rounded-2xl p-5 shadow-md border border-gray-100 transition-all duration-300 ease-out hover:scale-[1.01] hover:shadow-lg md:p-6 dark:bg-white/5 dark:border-white/10 dark:hover:shadow-[0_20px_50px_-12px_rgba(0,0,0,0.5)] ${className}`}
      {...rest}
    >
      {children}
    </section>
  );
});

export default Card;
