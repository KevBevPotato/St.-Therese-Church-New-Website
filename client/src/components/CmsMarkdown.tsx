import ReactMarkdown from 'react-markdown';

interface CmsMarkdownProps {
  children?: string | null;
  className?: string;
}

export default function CmsMarkdown({ children, className = '' }: CmsMarkdownProps) {
  if (!children) return null;

  return (
    <div className={`prose prose-sm max-w-none whitespace-pre-wrap ${className}`}>
      <ReactMarkdown
        components={{
          a: ({ node: _node, ...props }) => (
            <a
              {...props}
              target="_blank"
              rel="noopener noreferrer"
              className="underline decoration-1 underline-offset-2 hover:decoration-2"
            />
          ),
        }}
      >
        {children}
      </ReactMarkdown>
    </div>
  );
}
