import clsx from "clsx";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../ui/accordian";

export default function PDFAccordian({
  name,
  src,
}: {
  name: string;
  src: string;
}) {
  return (
    <Accordion type="single" collapsible className="w-full">
      <AccordionItem value="item-1" className="w-full">
        <AccordionTrigger className="bg-[#EDE1D2] rounded-lg p-6 text-lg">
          <div className="flex items-center space-x-4 hover:no-underline no-underline w-full">
            <div className="text-base hover:no-underline flex justify-center items-center text-center bg-red-9 font-bold text-white-1 w-14 h-14 rounded-sm">
              <span className="no-underline">PDF</span>
            </div>
            <span className="no-underline text-left">{name}</span>
          </div>
        </AccordionTrigger>
        <AccordionContent className="p-0">
          <iframe
            src={src}
            height="1000px"
            width="100%"
            className="p-4 min-h-[800px]"
          ></iframe>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}
