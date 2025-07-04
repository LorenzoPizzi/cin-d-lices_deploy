import { Router } from 'express';
const router = Router();
const TMDB_API_KEY = process.env.TMDB_API_KEY;

router.get('/search', async (req, res) => {
  const query = req.query.q;
  if (!query) return res.status(400).json({ error: 'Missing search query' });

  try {
    const [movieRes, tvRes] = await Promise.all([
      fetch(`https://api.themoviedb.org/3/search/movie?query=${encodeURIComponent(query)}&api_key=${TMDB_API_KEY}&language=fr-FR`),
      fetch(`https://api.themoviedb.org/3/search/tv?query=${encodeURIComponent(query)}&api_key=${TMDB_API_KEY}&language=fr-FR`)
    ]);

    const [movies, tvShows] = await Promise.all([movieRes.json(), tvRes.json()]);

    const formattedMovies = movies.results.map(item => ({
      id: item.id,
      title: item.title,
      type: 'movie'
    }));

    const formattedTV = tvShows.results.map(item => ({
      id: item.id,
      title: item.name,
      type: 'tv'
    }));

    const combined = [...formattedMovies, ...formattedTV];

    res.json({ results: combined });
  } catch (err) {
    console.error('TMDB search error:', err);
    res.status(500).json({ error: 'Server error while searching TMDB' });
  }
});

export default router;