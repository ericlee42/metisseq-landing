import * as React from 'react';
import { IconPaginationArrowLeft, IconPaginationArrowRight } from '@/assets/icons/IconGroup';
import './index.scss';

export interface PaginationProps {
  current: number;
  total: number;
  pageSize?: number;
  onChange?: (v: number) => any;
}

const groupCount = 5;

const Pagination: React.FC<PaginationProps> = React.forwardRef((props: PaginationProps) => {
  const { current = 1, total, pageSize = 20, onChange } = props;

  const [currentPage, setCurrentPage] = React.useState<number>(current);
  const [startPage, setStartPage] = React.useState<number>(1);
  const [totalPage, setTotalPage] = React.useState<number>(0);

  React.useEffect(() => {
    setTotalPage(Math.floor((total - 1) / pageSize) + 1);
  }, [pageSize, total]);

  const pageClick = React.useCallback(
    (num: number) => {
      if (num >= groupCount) {
        setStartPage(num - 2);
      }
      if (num < groupCount) {
        setStartPage(1);
      }
      if (num === 1) {
        setStartPage(1);
      }
      setCurrentPage(num);
      onChange?.(num);
    },
    [onChange],
  );

  const renderPrev = React.useMemo(() => {
    const disabled = currentPage <= 1;
    return (
      <li
        className={`flex flex-row items-center justify-center ${disabled ? 'disabled' : ''}`.trimEnd()}
        onClick={() => {
          if (disabled) return;
          pageClick(currentPage - 1);
        }}
      >
        <IconPaginationArrowRight />
      </li>
    );
  }, [currentPage, pageClick]);

  const renderNext = React.useMemo(() => {
    const disabled = currentPage >= totalPage;
    return (
      <li
        className={`flex flex-row items-center justify-center ${disabled ? 'disabled' : ''}`.trimEnd()}
        onClick={() => {
          if (disabled) return;
          pageClick(currentPage + 1);
        }}
      >
        <IconPaginationArrowLeft />
      </li>
    );
  }, [currentPage, pageClick, totalPage]);

  const calcList = React.useMemo(() => {
    const pageListArr: number[] = [];
    for (let i = 0; i < totalPage; i++) {
      pageListArr.push(i + 1);
    }

    const pages: React.ReactNode[] = [];

    pages.push(
      <li
        className={`item flex flex-row items-center justify-center ${currentPage === 1 ? 'selected' : ''}`}
        key={1}
        onClick={() => pageClick(1)}
      >
        1
      </li>,
    );

    let pageLength = 0;
    if (groupCount + startPage > totalPage) {
      pageLength = totalPage;
    } else {
      pageLength = groupCount + startPage;
    }

    if (currentPage >= groupCount) {
      pages.push(
        <li
          className="item flex flex-row items-center justify-center omit"
          key={-1}
          onClick={() => {
            pageClick(Math.max(1, currentPage - groupCount));
          }}
        >
          ...
        </li>,
      );
    }

    for (let i = startPage; i < pageLength; i++) {
      if (i <= totalPage - 1 && i > 1) {
        pages.push(
          <li
            className={`item flex flex-row items-center justify-center ${currentPage === i ? 'selected' : ''}`}
            key={i}
            onClick={() => pageClick(i)}
          >
            {i}
          </li>,
        );
      }
    }

    if (totalPage - startPage >= groupCount + 1) {
      pages.push(
        <li
          className="item flex flex-row items-center justify-center omit"
          key={-2}
          onClick={() => {
            pageClick(Math.min(Math.floor((total - 1) / pageSize) + 1, currentPage + groupCount));
          }}
        >
          ...
        </li>,
      );
    }
    pages.push(
      <li
        className={`item flex flex-row items-center justify-center ${currentPage === totalPage ? 'selected' : ''}`}
        key={totalPage}
        onClick={() => pageClick(totalPage)}
      >
        {totalPage}
      </li>,
    );

    return pages.map((item) => item);
  }, [currentPage, pageClick, pageSize, startPage, total, totalPage]);

  if (totalPage < 2) {
    return null;
  }

  return (
    <ul className="component-pagination flex flex-row items-center justify-end">
      {renderPrev}
      {calcList}
      {renderNext}
    </ul>
  );
});

export default Pagination;
