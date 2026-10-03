import type { ReactNode } from 'react';

export default function Faq({ data }: { data: { rows: { title: string; content: ReactNode }[] } }) {
  return (
    <div className="faq-row-wrapper">
      <div className="faq-body">
        {data.rows.map((row) => (
          <details className="faq-row" key={row.title}>
            <summary className="row-title" style={{ cursor: 'pointer', padding: '20px 0' }}>
              <span className="row-title-text">{row.title}</span>
            </summary>
            <div className="row-content-text" style={{ paddingBottom: 20 }}>
              {row.content}
            </div>
          </details>
        ))}
      </div>
    </div>
  );
}
