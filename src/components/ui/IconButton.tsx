import type { ButtonHTMLAttributes } from "react";

export default function IconButton({
  className = "",
  ...rest
}: ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      className={`inline-flex h-8 w-8 cursor-pointer items-center justify-center rounded-md text-text-secondary transition-colors hover:bg-surface-hover hover:text-text-primary ${className}`}
      {...rest}
    />
  );
}
