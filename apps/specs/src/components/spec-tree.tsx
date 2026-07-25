import { Link } from 'react-router-dom';
import type { SpecNode } from '../core/tree';

interface SpecTreeProps {
  nodes: SpecNode[];
  currentSlug: string;
  depth?: number;
}

export function SpecTree({ nodes, currentSlug, depth = 0 }: SpecTreeProps) {
  return (
    <ul className="space-y-0.5">
      {nodes.map((node) => (
        <li key={node.name}>
          {node.slug ? (
            <Link
              to={`/specs/${node.slug}`}
              style={{ paddingLeft: `${0.5 + depth * 0.75}rem` }}
              className={`block truncate rounded px-2 py-1 text-sm ${
                node.slug === currentSlug
                  ? 'bg-slate-900 text-white'
                  : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
              }`}
            >
              {node.title}
            </Link>
          ) : (
            <span
              style={{ paddingLeft: `${0.5 + depth * 0.75}rem` }}
              className="block truncate px-2 py-1 text-xs font-semibold uppercase tracking-wide text-slate-400"
            >
              {node.title}
            </span>
          )}

          {node.children.length > 0 ? (
            <SpecTree nodes={node.children} currentSlug={currentSlug} depth={depth + 1} />
          ) : null}
        </li>
      ))}
    </ul>
  );
}
