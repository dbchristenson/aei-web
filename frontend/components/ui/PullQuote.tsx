interface PullQuoteProps {
  quote: string;
  attribution?: string;
}

export default function PullQuote({ quote, attribution }: PullQuoteProps) {
  return (
    <blockquote className="relative pl-8 py-4">
      <span
        className="absolute top-0 left-0 text-[6rem] leading-none font-serif text-teal-blue/20 select-none"
        aria-hidden="true"
      >
        &ldquo;
      </span>
      <p
        className="font-serif italic text-neutral-100"
        style={{ fontSize: "var(--text-quote)", lineHeight: 1.4 }}
      >
        {quote}
      </p>
      {attribution && (
        <footer
          className="mt-4 text-neutral-400"
          style={{ fontSize: "var(--text-small)" }}
        >
          &mdash; {attribution}
        </footer>
      )}
    </blockquote>
  );
}
