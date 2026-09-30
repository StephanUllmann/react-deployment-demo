import { useEffect, useState } from 'react';
import fetchPage from './data/fetchPeople.js';

const START_URL = 'https://swapi.tech/api/people?page=1&limit=10';

function App() {
  // Die ganze Serverantwort als ein State-Objekt: people, next und previous gehören zusammen
  const [page, setPage] = useState(null);

  // const [loading, setLoading] = useState(true)
  // const [error, setError] = useState(null)
  // Komponenten-Status als String statt separate Booleans (weniger State)
  // Startwert "loading": der erste Fetch läuft sofort los → kein setStatus("loading") im Effect nötig
  const [status, setStatus] = useState('loading'); // "error", "success", "loading"

  useEffect(() => {
    const controller = new AbortController();

    async function fetchSWAPI() {
      try {
        console.log('initial fetching');
        const data = await fetchPage(START_URL, controller.signal);
        setPage(data);
        setStatus('success');
      } catch {
        if (!controller.signal.aborted) setStatus('error');
      }
    }
    fetchSWAPI();

    return () => controller.abort();
  }, []);

  async function loadPage(url) {
    setStatus('loading');
    try {
      const data = await fetchPage(url);
      setPage(data);
      setStatus('success');
    } catch (err) {
      setStatus('error');
    }
  }

  return (
    <main className='min-h-screen bg-gray-900 p-8 font-sans'>
      <h1 className='text-3xl font-bold text-center text-gray-300'>Star Wars Characters</h1>

      <div className='flex justify-center gap-4 p-6'>
        {page?.previous && (
          <button
            disabled={status === 'loading'}
            onClick={() => loadPage(page.previous)}
            className='border rounded px-5 py-3 disabled:bg-red-500/20'
            type='button'
          >
            Previous
          </button>
        )}
        {page?.next && (
          <button
            disabled={status === 'loading'}
            onClick={() => {
              loadPage(page.next);
            }}
            className='border rounded px-5 py-3 disabled:bg-red-500/20'
            type='button'
          >
            Next
          </button>
        )}
      </div>

      {/* Status-basiertes Conditional Rendering (statt mehrerer Booleans) */}
      {status === 'loading' && <p className='text-center text-gray-600 font-medium'>Loading...</p>}

      {status === 'error' && <p className='text-center text-red-600 font-medium'>Sorry, try again :(</p>}

      <ul className='grid sm:grid-cols-2 gap-4'>
        {page?.results.map((character) => (
          <li key={character.uid} className='bg-white p-4 rounded shadow text-center capitalize'>
            <span className='font-semibold text-gray-800'>{character.name}</span>
          </li>
        ))}
      </ul>
    </main>
  );
}

export default App;
