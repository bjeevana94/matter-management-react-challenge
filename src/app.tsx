import { Routes, Route } from 'react-router-dom';
import TicketsPage from './pages/tickets/TicketsPage';
import TicketFilters from './pages/tickets/TicketFilters';
import UserProfilePage from './pages/userProfile/userProfile';
import TicketList from './pages/tickets/TicketList';
import NotFound from './pages/notFound';


/* Can simplify this file futher to follow react-router v6 pattern 
  https://reactrouter.com/6.30.3/routers/create-browser-router 
*/
function App() {
  return (
    <Routes>
        <Route path="/tickets" element={<TicketsPage />}>    
          <Route path=":ticketId" element={<TicketsPage />} />
        </Route>

        <Route path="/ticket-list" element={<TicketList />} />
        <Route path="/ticket-filters" element={<TicketFilters />} />
        <Route path="/user-profile" element={<UserProfilePage />} />

        <Route path="/" element={<TicketsPage />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
  );
}

export default App;