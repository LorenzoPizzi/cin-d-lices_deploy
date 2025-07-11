import fetch from "node-fetch";
import dotenv from "dotenv";
dotenv.config();

const TMDB_API_KEY = process.env.TMDB_API_KEY;

async function fetchTMDB(url) {
    const res = await fetch(url);
    if (!res.ok) return null;
    return res.json();
}

export async function getMediaById(id) {
    const base = "https://api.themoviedb.org/3";
    const params = `api_key=${TMDB_API_KEY}&language=fr-FR`;

    // Film
    const movie = await fetchTMDB(`${base}/movie/${id}?${params}`);
    if (movie) {
        return { id: movie.id, title: movie.title, type: "Film" };
    }

    // Série
    const tv = await fetchTMDB(`${base}/tv/${id}?${params}`);
    if (tv) {
        return { id: tv.id, title: tv.name, type: "Série" };
    }

    throw new Error(`Aucun média trouvé pour l’ID ${id}`);
}
