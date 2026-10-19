export default function PDFAccordian({
  name,
  src,
}: {
  name: string;
  src: string;
}) {
  // Unpublished upload placeholders must not become broken controls on the wiki.
  if (!src || /\/REPLACE[-_]/i.test(src)) return null;

  return (
    <details className="w-full my-4 border-y border-[#dce2d8]">
      <summary className="cursor-pointer py-4 font-medium">
        {name} <span className="ml-2 text-xs font-normal">PDF</span>
      </summary>
      <div className="pb-4">
        <a href={src} target="_blank" rel="noopener noreferrer" className="inline-block mb-4 underline underline-offset-4" aria-label={`Open ${name} PDF in a new tab`}>
          Open PDF <span aria-hidden="true">↗</span>
        </a>
        <iframe src={src} title={name} loading="lazy" width="100%" height="720" className="w-full h-[70vh] min-h-[320px] max-h-[900px] border border-[#dce2d8]" />
      </div>
    </details>
  );
}
