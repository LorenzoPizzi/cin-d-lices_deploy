import { Router } from 'express';

const router = Router();

const TMDB_API_KEY = process.env.TMDB_API_KEY;


router.get('/search', async (req, res) => {
  const query = req.query.q;


  if (!query) return res.status(400).json({ error: 'Missing search query' });

  try {
    // On lance en parallèle deux requêtes fetch vers l’API TMDB :
    // - une pour rechercher des films (endpoint /search/movie)
    // - une pour rechercher des séries TV (endpoint /search/tv)
    // Les résultats sont demandés en français (language=fr-FR)
    const [movieRes, tvRes] = await Promise.all([
      fetch(`https://api.themoviedb.org/3/search/movie?query=${encodeURIComponent(query)}&api_key=${TMDB_API_KEY}&language=fr-FR`),
      fetch(`https://api.themoviedb.org/3/search/tv?query=${encodeURIComponent(query)}&api_key=${TMDB_API_KEY}&language=fr-FR`)
    ]);

    // On attend la résolution des réponses en JSON
    const [movies, tvShows] = await Promise.all([movieRes.json(), tvRes.json()]);

    // On transforme la liste des films pour ne garder que l’id et le titre
    const formattedMovies = movies.results.map(item => ({
      id: item.id,
      title: item.title,
    }));

    // On transforme la liste des séries TV pour ne garder que l’id et le nom (titre)
    const formattedTV = tvShows.results.map(item => ({
      id: item.id,
      title: item.name,
    }));

    // On combine les deux listes (films + séries)
    const combined = [...formattedMovies, ...formattedTV];

    // On renvoie au client la liste combinée au format JSON
    res.json({ results: combined });

  } catch (err) {
    // En cas d’erreur, on affiche l’erreur dans la console et on renvoie un statut 500 (erreur serveur)
    console.error('TMDB search error:', err);
    res.status(500).json({ error: 'Server error while searching TMDB' });
  }
});

// On exporte ce routeur pour pouvoir l’utiliser dans l’application principale Express
export default router;
