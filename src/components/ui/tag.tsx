import type { HTMLAttributes } from "react";

type TagProps = HTMLAttributes<HTMLSpanElement>;

export function Tag({ className, ...props }: TagProps) {
  return (
    <span className={["tag", className].filter(Boolean).join(" ")} {...props} />
  );
}
