import MarkdownIt from 'markdown-it';
import anchor from 'markdown-it-anchor';

const md = new MarkdownIt({ html: true, linkify: true, typographer: true }).use(anchor, {
  permalink: anchor.permalink.headerLink(),
});

export function renderMarkdown(content: string): string {
  return md.render(content);
}
