function Skeleton({ className = "", ...props }) {
  return (
    <div
      role="presentation"
      aria-hidden
      className={`motion-safe:animate-pulse rounded-xl bg-neutral-200/90 motion-reduce:animate-none dark:bg-white/[0.08] ${className}`}
      {...props}
    />
  );
}

export default Skeleton;
