import styles from './Pagination.module.css';

interface PaginationProps {
  currentPage: number;
  totalCount: number;
  pageSize?: number;
  onPageChange: (page: number) => void;
}

export default function Pagination({
  currentPage,
  totalCount,
  pageSize = 20,
  onPageChange,
}: PaginationProps) {
  const totalPages = Math.ceil(totalCount / pageSize);

  if (totalPages <= 1) return null;

  const pages: number[] = [];
  const start = Math.max(1, currentPage - 2);
  const end = Math.min(totalPages, currentPage + 2);

  for (let i = start; i <= end; i++) {
    pages.push(i);
  }

  return (
    <nav className={styles.pagination} aria-label="Pagination">
      <button
        className={styles.button}
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage <= 1}
      >
        Previous
      </button>

      {start > 1 && (
        <>
          <button className={styles.button} onClick={() => onPageChange(1)}>
            1
          </button>
          {start > 2 && <span className={styles.ellipsis}>...</span>}
        </>
      )}

      {pages.map((page) => (
        <button
          key={page}
          className={`${styles.button} ${page === currentPage ? styles.active : ''}`}
          onClick={() => onPageChange(page)}
        >
          {page}
        </button>
      ))}

      {end < totalPages && (
        <>
          {end < totalPages - 1 && <span className={styles.ellipsis}>...</span>}
          <button
            className={styles.button}
            onClick={() => onPageChange(totalPages)}
          >
            {totalPages}
          </button>
        </>
      )}

      <button
        className={styles.button}
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage >= totalPages}
      >
        Next
      </button>
    </nav>
  );
}
