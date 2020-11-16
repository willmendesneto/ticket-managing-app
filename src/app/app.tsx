import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import './app.css';
import { BackendService, Ticket } from '../backend';

interface AppProps {
  backend: BackendService;
}

type TicketFormData = {
  filter: string;
  isChecked: boolean;
};

const App = ({ backend }: AppProps) => {
  const [tickets, setTickets] = useState([] as Ticket[]);
  const [form, setTicketForm] = useState({ filter: '', isChecked: false } as TicketFormData);
  const [error, setError] = useState(null as Error | null);

  // The backend returns observables, but you can convert to promises if
  // that is easier to work with. It's up to you.
  useEffect(() => {
    try {
      const fetchData = async () => {
        const result = await backend.tickets().toPromise();
        setTickets(result);
      };
      fetchData();
    } catch (error) {
      setError(error);
    }
  }, [backend]);

  let Content;

  if (error) {
    Content = <p>Error message</p>;
  } else {
    Content =
      tickets.length > 0 ? (
        <>
          <ul data-testid="tickets">
            {tickets
              .filter(
                t => t.description.toLowerCase().includes(form.filter.toLowerCase()) && t.completed === form.isChecked,
              )
              .map(t => (
                <li key={t.id}>
                  <Link to={`/details/${t.id}`}>
                    Ticket: {t.id}, {t.description}
                  </Link>
                </li>
              ))}
          </ul>
        </>
      ) : (
        <p>No tickets</p>
      );
  }

  return (
    <div className="app">
      <h2>Tickets</h2>

      <form>
        <fieldset>
          <legend>Filters</legend>
          <label>Description</label>
          <input
            type="text"
            name="filter"
            value={form.filter}
            aria-label="filter"
            onChange={event => {
              setTicketForm(
                form =>
                  ({
                    ...form,
                    filter: event.target.value || '',
                  } as TicketFormData),
              );
            }}
          />
          <label>Completed tasks?</label>
          <input
            type="checkbox"
            checked={form.isChecked}
            onChange={event => {
              setTicketForm(
                form =>
                  ({
                    ...form,
                    isChecked: !form.isChecked,
                  } as TicketFormData),
              );
            }}
          />
          <Link to="/add">Add</Link>
        </fieldset>
      </form>
      {Content}
    </div>
  );
};

export default App;
