
import StatusFilter from "@/components/StatusFilter";
import SortFilter from "@/components/SortFilter";
import { FilterStatus, SortByType } from "./types";
import { useSearchParams } from "react-router-dom";

/**
 * TASK 5: Remove Redux usage
 * 
 * This component uses Redux for local component state that should be:
 * - React useState for local state
 * - React Query for server state
 * - URL params for shareable state (bonus)
 */
const TicketFilters = () => {
  const [params, setParams] = useSearchParams();
  const statusFilter = (params.get('status') || 'all') as FilterStatus;
  const sortBy = (params.get('sortBy') || 'date') as SortByType;

  const handleFilterChange = (newFilter: FilterStatus) => {
    setParams(prevParams => {
      const newParams = new URLSearchParams(prevParams)
      newParams.set('status', newFilter);
      return newParams;
    })
  };

  const handleSortChange = (newSort: SortByType) => {
    setParams(prevParams => {
      const newParams = new URLSearchParams(prevParams)
      newParams.set('sortBy', newSort);
      return newParams;
    })
  }

  return (
    <div>
      <div>
        <StatusFilter status={statusFilter} onChange={handleFilterChange} />
        <SortFilter sortBy={sortBy} onChange={handleSortChange} />
        <p style={{margin: '8px 0'}}>Current Status filter: {statusFilter}</p>
        <p style={{marginTop: '8px 0'}}>Current Sort by: {sortBy}</p>
      </div>
    </div>
  );
};

export default TicketFilters;
