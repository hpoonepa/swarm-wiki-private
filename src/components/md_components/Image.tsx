import clsx from "clsx";
export interface Props {
  src: string;
  caption?: string;
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
      return "max-w-lg"; // Return an empty string or handle other sizes as needed
  }
}

export default function Image(props: Props) {
  return (
    <div className="flex w-full flex-col items-center justify-center p-1">
      <img
        src={props.src}
        alt=""
        className={clsx(`mx-2 rounded-xl w-[80%]`, getMaxWidthClass(props.size))}
      />
      <div className="text-center italic">{props.caption}</div>
    </div>
  );
}
