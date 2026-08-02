import { Fragment, type ReactNode } from 'react';

/**
 * A deliberately tiny Markdown renderer for our own trusted blog bodies. It
 * supports the subset the posts use: `## `/`### ` headings, blank-line
 * paragraphs and `- ` bullet lists. Nothing here is user input, so there is no
 * sanitisation burden — but there is also no raw HTML pass-through.
 */
export function Article({ body }: { body: string }) {
  const lines = body.replace(/\r\n/g, '\n').split('\n');
  const blocks: ReactNode[] = [];
  let paragraph: string[] = [];
  let list: string[] = [];
  let key = 0;

  const flushParagraph = () => {
    if (paragraph.length === 0) return;
    blocks.push(
      <p
        key={key++}
        className="mb-5 text-base leading-relaxed text-light/70 md:text-lg"
      >
        {paragraph.join(' ')}
      </p>,
    );
    paragraph = [];
  };

  const flushList = () => {
    if (list.length === 0) return;
    blocks.push(
      <ul
        key={key++}
        className="mb-6 ml-1 space-y-2.5 text-base leading-relaxed text-light/70 md:text-lg"
      >
        {list.map((item, i) => (
          <li key={i} className="flex gap-3">
            <span aria-hidden className="mt-2.5 h-1.5 w-1.5 shrink-0 rounded-full bg-signal" />
            <span>{item}</span>
          </li>
        ))}
      </ul>,
    );
    list = [];
  };

  for (const raw of lines) {
    const line = raw.trimEnd();

    if (line.startsWith('## ')) {
      flushParagraph();
      flushList();
      blocks.push(
        <h2
          key={key++}
          className="mt-12 mb-4 text-2xl font-semibold tracking-tight text-light md:text-3xl"
        >
          {line.slice(3)}
        </h2>,
      );
    } else if (line.startsWith('### ')) {
      flushParagraph();
      flushList();
      blocks.push(
        <h3
          key={key++}
          className="mt-8 mb-3 text-xl font-medium tracking-tight text-light"
        >
          {line.slice(4)}
        </h3>,
      );
    } else if (line.startsWith('- ')) {
      flushParagraph();
      list.push(line.slice(2));
    } else if (line.trim() === '') {
      flushParagraph();
      flushList();
    } else {
      flushList();
      paragraph.push(line.trim());
    }
  }
  flushParagraph();
  flushList();

  return <Fragment>{blocks}</Fragment>;
}
