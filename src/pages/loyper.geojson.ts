// Alle løypene som én GeoJSON til oversiktskartet: /loyper.geojson
import type { APIRoute } from 'astro';
import { loyper } from '../features/loypekart/data/katalog.ts';
import { tilGeoJson } from '../features/loypekart/motor/katalog.ts';

export const GET: APIRoute = () => new Response(JSON.stringify(tilGeoJson(loyper)), { headers: { 'Content-Type': 'application/geo+json' } });
