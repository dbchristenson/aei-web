interface PullQuoteProps {
  quote: string;
  attribution?: string;
}

export default function PullQuote({ quote, attribution }: PullQuoteProps) {
  return (
    <blockquote className="relative pl-8 py-4">
      <span
        className="absolute top-0 left-0 text-[6rem] leading-none font-serif text-primary/20 select-none"
        aria-hidden="true"
      >
        &ldquo;
      </span>
      <p className="font-serif italic text-fg-secondary text-quote">
        {quote}
      </p>
      {attribution && (
        <footer className="mt-4 text-fg-muted text-small">
          &mdash; {attribution}
        </footer>
      )}
    </blockquote>
  );
}
