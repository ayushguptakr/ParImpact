import { forwardRef } from "react";

const Card = forwardRef(function Card({ children, className = "", ...rest }, ref) {
  return (
    <section
      ref={ref}
      className={`surface-glass rounded-2xl p-5 shadow-lg transition-[transform,box-shadow] duration-200 ease-out hover:-translate-y-0.5 hover:shadow-xl md:p-6 dark:hover:shadow-[0_20px_50px_-12px_rgba(0,0,0,0.5)] ${className}`}
      {...rest}
    >
      {children}
    </section>
  );
});

export default Card;
