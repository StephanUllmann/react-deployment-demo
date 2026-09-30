export default async function fetchPage(url, signal) {
  const res = await fetch(url, { signal });
  if (!res.ok) throw new Error('Fetch failed');

  return await res.json();
}
