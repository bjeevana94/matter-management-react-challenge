import { FilterStatus } from "@/pages/tickets/types";

interface StatusFilterProps {
  status: FilterStatus;
  onChange: (value: FilterStatus) => void;
}

const StatusFilter = ({ status, onChange }: StatusFilterProps) => {
  return (
    <label>
      Filter By Status:
      <select
        value={status}
        onChange={(e) => onChange(e.target.value as FilterStatus)}
        style={{ width: '100%', padding: '8px', marginBottom: '10px' }}
      >
        <option value="all">All</option>
        <option value="open">Open</option>
        <option value="in-progress">In Progress</option>
        <option value="closed">Closed</option>
      </select>
    </label>
  );
};

export default StatusFilter;
