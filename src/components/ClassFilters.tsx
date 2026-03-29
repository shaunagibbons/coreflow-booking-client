import { type ChangeEvent } from 'react';
import type { ClassFilters } from '@/data/types';
import styles from './ClassFilters.module.css';

interface ClassFiltersProps {
  filters: ClassFilters;
  onChange: (filters: ClassFilters) => void;
}

export default function ClassFiltersBar({ filters, onChange }: ClassFiltersProps) {
  function update(field: keyof ClassFilters, value: string | boolean) {
    onChange({ ...filters, [field]: value, page: 1 });
  }

  function handleText(e: ChangeEvent<HTMLInputElement>) {
    update('search', e.target.value);
  }

  return (
    <div className={styles.bar}>
      <input
        className={styles.search}
        type="text"
        placeholder="Search classes..."
        value={filters.search ?? ''}
        onChange={handleText}
      />
      <div className={styles.group}>
        <label className={styles.label}>
          From
          <input
            className={styles.dateInput}
            type="date"
            value={filters.date_from ?? ''}
            onChange={(e) => update('date_from', e.target.value)}
          />
        </label>
        <label className={styles.label}>
          To
          <input
            className={styles.dateInput}
            type="date"
            value={filters.date_to ?? ''}
            onChange={(e) => update('date_to', e.target.value)}
          />
        </label>
      </div>
      <label className={styles.checkbox}>
        <input
          type="checkbox"
          checked={filters.available_only ?? false}
          onChange={(e) => update('available_only', e.target.checked)}
        />
        Available only
      </label>
    </div>
  );
}
