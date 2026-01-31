import { SortByType } from "@/pages/tickets/types";

interface SortFilterProps {
  sortBy: SortByType;
  onChange: (value: SortByType) => void;
}

const SortFilter = ({ sortBy, onChange }: SortFilterProps) => {
  return (
    <label>
      Sort By:
      <select
        value={sortBy}
        onChange={(e) => onChange(e.target.value as SortByType)}
        style={{ width: '100%', padding: '8px' }}
      >
        <option value="date">Date</option>
        <option value="title">Title</option>
      </select>
    </label>
  );
};

export default SortFilter;
