import ReactMarkdown from 'react-markdown';

interface CmsMarkdownProps {
  children?: string | null;
  className?: string;
}

export default function CmsMarkdown({ children, className = '' }: CmsMarkdownProps) {
  if (!children) return null;

  return (
    <div className={`prose prose-sm max-w-none ${className}`}>
      <ReactMarkdown
        components={{
          a: ({ node: _node, ...props }) => (
            <a {...props} target="_blank" rel="noopener noreferrer" />
          ),
        }}
      >
        {children}
      </ReactMarkdown>
    </div>
  );
}
