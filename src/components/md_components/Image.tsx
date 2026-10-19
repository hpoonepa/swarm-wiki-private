import clsx from "clsx";
export interface Props {
  src: string;
  caption?: string;
  alt?: string;
  width?: number;
  height?: number;
  size?: string;
}

function getMaxWidthClass(size?: string) {
  switch (size) {
    case "xs":
      return "max-w-sm";
    case "sm":
      return "max-w-md";
    case "md":
      return "max-w-lg";
    case "lg":
      return "max-w-xl";
    case "xl":
      return "max-w-2xl";
    case "5xl":
      return "max-w-5xl";
    default:
      return "max-w-lg";
  }
}

export default function Image(props: Props) {
  if (!props.src.trim() || /\bREPLACE(?:[-_\s]|$)/i.test(props.src)) return null;

  return (
    <figure className="flex w-full flex-col items-center justify-center p-1">
      <img
        src={props.src}
        alt={props.alt ?? ""}
        width={props.width}
        height={props.height}
        loading={props.width && props.height ? "lazy" : undefined}
        decoding="async"
        className={clsx("rounded-xl w-full sm:w-[80%]", getMaxWidthClass(props.size))}
      />
      {props.caption && <figcaption className="text-center">{props.caption}</figcaption>}
    </figure>
  );
}
