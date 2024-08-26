import { cn } from "@/lib/utils";
import CopyButton from "@/components/copy-button";

function CodeBlock({
  value,
  className,
  copyable = true,
}: {
  value: string;
  className?: string;
  codeClass?: string;
  copyable?: boolean;
  codeWrap?: boolean;
  noCodeFont?: boolean;
  noMask?: boolean;
}) {
  value = value || "";

  return (
    <pre
      style={{ maxHeight: "500px", overflowY: "auto" }}
      className={cn(
        `} relative h-full w-full whitespace-pre-wrap rounded-lg border bg-zinc-950 p-4 text-sm text-white/75
          dark:bg-zinc-800 `,
        className,
      )}
    >
      <CopyButton value={value} copyable={copyable} />
      {value}
    </pre>
  );
}

export default CodeBlock;