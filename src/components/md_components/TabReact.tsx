import clsx from "clsx";

export default function TabReact({
  labels,
  links,
  focus,
  color,
}: {
  labels: string[];
  links: string[];
  focus: string;
  color: string;
}) {
  console.log("focus", focus);
  
  let bgTextColor =
    color == "blue"
      ? `bg-blue-4`
      : color == "magenta"
        ? "bg-magenta-4"
        : color == "green"
        ? "bg-green-4"
        : "bg-pink-4";

  return (
    <div className="w-full tabs md:flex grow space-x-4">
      
      {labels.map((label, index) => {
        const isActive = focus === links[index];
        console.log("Focus", focus);
        return (
          <a
            href={"/lambert-ga/" + links[index]}
            key={index}
            className={clsx(
              "text-center rounded-[20px] mt-6 mb-6 text-[24px] font-bold p-6",
              "text-[#FFF2DF] no-underline flex items-center justify-center",
              isActive
                ? "bg-[#583A00]"
                : "bg-[#BAAC92] hover:bg-[#513600]/60"
            )}
            style={{ textDecoration: "none", color: "white", marginInline: "20px", boxShadow: "0px 15px 5px -14px #00000040;"
             }}
          >
            {label}
          </a>
        );
      })}
    </div>
  );
}
