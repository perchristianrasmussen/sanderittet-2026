// Stabile nedlastingsadresser for GPX-filene: /gpx/<slug>.gpx
import type { APIRoute, GetStaticPaths } from 'astro';
import { loyper } from '../../features/loypekart/data/katalog.ts';

export const getStaticPaths = (() => loyper.map((l) => ({ params: { slug: l.slug }, props: { tekst: l.tekst } }))) satisfies GetStaticPaths;

export const GET: APIRoute = ({ props }) => new Response(props.tekst as string, { headers: { 'Content-Type': 'application/gpx+xml; charset=utf-8' } });
