'use client';

/* eslint-disable @typescript-eslint/no-explicit-any --
   Le typage de D3 + TopoJSON pour des géométries dynamiques (features,
   meshes, callbacks de projection) est notoirement verbeux et apporte peu
   de sécurité réelle ici. On désactive la règle pour ce fichier plutôt que
   de truffer le code de casts artificiels. */

/**
 * AuditGlobe — globe interactif pour le hero de la landing page d'audit
 * -----------------------------------------------------------------------
 * Adapté du globe D3/SVG du projet World Census (bootcamp Le Wagon).
 *
 * Différences avec l'original :
 *  - Branding "World Census" et CTA retirés (le hero a déjà son propre CTA)
 *  - Pas de fausses données de sondage — juste des points de scan ambiants
 *  - Fond transparent pour s'intégrer au hero existant
 *  - Palette dorée/charcoal (à ajuster via les props `accentColor` si besoin)
 *  - Respecte prefers-reduced-motion (rotation désactivée si l'utilisateur
 *    préfère moins d'animation)
 *
 * Installation :
 *   npm install d3 topojson-client
 *   npm install -D @types/d3 @types/topojson-client
 *
 * Utilisation (dans le Hero, en dynamic import pour éviter tout souci SSR) :
 *
 *   import dynamic from 'next/dynamic';
 *   const AuditGlobe = dynamic(() => import('@/components/AuditGlobe'), { ssr: false });
 *
 *   <div className="absolute inset-0 -z-10 opacity-80">
 *     <AuditGlobe />
 *   </div>
 */

import { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import * as topojson from 'topojson-client';

type ScanPoint = {
  lat: number;
  lon: number;
  label: string;
};

type AuditGlobeProps = {
  /** Couleur d'accent principale (points, contours actifs) */
  accentColor?: string;
  /** Couleur des contours de pays au repos */
  landColor?: string;
  /** Couleur de l'océan / fond du globe */
  oceanColor?: string;
  /** Vitesse de rotation automatique (0 = statique) */
  rotationSpeed?: number;
  className?: string;
};

// Quelques points de scan ambiants — décoratifs, pas des données réelles.
// Libre à toi d'en faire une vraie carte de couverture géographique plus tard.
const SCAN_POINTS: ScanPoint[] = [
  { lat: 48.85, lon: 2.35, label: 'Paris' },
  { lat: 45.75, lon: 4.85, label: 'Lyon' },
  { lat: 43.6, lon: 1.44, label: 'Toulouse' },
  { lat: 47.22, lon: -1.55, label: 'Nantes' },
  { lat: 50.63, lon: 3.06, label: 'Lille' },
  { lat: 43.3, lon: 5.37, label: 'Marseille' },
];

export default function AuditGlobe({
  accentColor = '#C9A227', // or — à remplacer par ton token Tailwind exact
  landColor = 'rgba(201, 162, 39, 0.18)',
  oceanColor = 'transparent',
  rotationSpeed = 0.006,
  className = '',
}: AuditGlobeProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const prefersReducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches;

    let W = container.clientWidth;
    let H = container.clientHeight;
    let R = Math.min(W, H) * 0.45;

    const svg = d3
      .select(container)
      .append('svg')
      .attr('width', W)
      .attr('height', H)
      .style('display', 'block');

    const pinsSvg = d3
      .select(container)
      .append('svg')
      .attr('width', W)
      .attr('height', H)
      .style('position', 'absolute')
      .style('top', '0')
      .style('left', '0')
      .style('pointer-events', 'none')
      .style('overflow', 'visible');

    const defs = svg.append('defs');
    const clipId = `globe-clip-${Math.random().toString(36).slice(2)}`;
    const clipCircle = defs
      .append('clipPath')
      .attr('id', clipId)
      .append('circle')
      .attr('cx', W / 2)
      .attr('cy', H / 2)
      .attr('r', R);

    const proj = d3
      .geoOrthographic()
      .translate([W / 2, H / 2])
      .scale(R)
      .clipAngle(90);

    const gpath = d3.geoPath(proj);
    const grat = d3.geoGraticule10();

    const oceanCircle = svg
      .append('circle')
      .attr('cx', W / 2)
      .attr('cy', H / 2)
      .attr('r', R)
      .attr('fill', oceanColor)
      .attr('stroke', accentColor)
      .attr('stroke-opacity', 0.15);

    const scene = svg.append('g').attr('clip-path', `url(#${clipId})`);

    const gratPath = scene
      .append('path')
      .datum(grat)
      .attr('fill', 'none')
      .attr('stroke', accentColor)
      .attr('stroke-opacity', 0.08)
      .attr('stroke-width', 0.5);

    const countryGroup = scene.append('g');
    const borderPath = scene
      .append('path')
      .attr('fill', 'none')
      .attr('stroke', accentColor)
      .attr('stroke-opacity', 0.35)
      .attr('stroke-width', 0.6);

    const rimCircle = svg
      .append('circle')
      .attr('cx', W / 2)
      .attr('cy', H / 2)
      .attr('r', R)
      .attr('fill', 'none')
      .attr('stroke', accentColor)
      .attr('stroke-opacity', 0.4)
      .attr('stroke-width', 1);

    function projectAt(lat: number, lon: number): [number, number] | null {
      const p = proj([lon, lat]);
      if (!p) return null;
      // masque les points au dos du globe
      const rot = proj.rotate();
      const centerLon = -rot[0];
      const centerLat = -rot[1];
      const dist = d3.geoDistance([lon, lat], [centerLon, centerLat]);
      if (dist > Math.PI / 2) return null;
      return p;
    }

    function drawPins() {
      pinsSvg.selectAll('*').remove();
      SCAN_POINTS.forEach((p) => {
        const pos = projectAt(p.lat, p.lon);
        if (!pos) return;
        const g = pinsSvg.append('g');
        g.append('circle')
          .attr('cx', pos[0])
          .attr('cy', pos[1])
          .attr('r', 2.5)
          .attr('fill', accentColor)
          .attr('opacity', 0.9);
        g.append('circle')
          .attr('cx', pos[0])
          .attr('cy', pos[1])
          .attr('r', 6)
          .attr('fill', 'none')
          .attr('stroke', accentColor)
          .attr('stroke-opacity', 0.35)
          .attr('stroke-width', 1);
      });
    }

    function redraw() {
      countryGroup
        .selectAll('path')
        .attr('d', (d) => gpath(d as d3.GeoPermissibleObjects));
      gratPath.attr('d', gpath as unknown as string);
      drawPins();
    }

    let borders: d3.ExtendedFeatureCollection | d3.GeoGeometryObjects | null = null;

    d3.json('https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json').then(
      (world: any) => {
        if (!world) return;
        const countries = topojson.feature(world, world.objects.countries) as any;
        borders = topojson.mesh(
          world,
          world.objects.countries,
          (a: any, b: any) => a !== b
        ) as any;

        countryGroup
          .selectAll('path')
          .data(countries.features)
          .join('path')
          .attr('d', (d: any) => gpath(d))
          .attr('fill', landColor);

        borderPath.datum(borders).attr('d', gpath as any);
        gratPath.attr('d', gpath(grat) as any);
        drawPins();
      }
    );

    let rotating = !prefersReducedMotion;
    let lastT = 0;
    let frameId: number;

    function animate(t: number) {
      if (rotating && lastT) {
        const dt = t - lastT;
        const r = proj.rotate();
        proj.rotate([r[0] + dt * rotationSpeed, r[1], r[2]]);
        redraw();
      }
      lastT = t;
      frameId = requestAnimationFrame(animate);
    }
    frameId = requestAnimationFrame(animate);

    // Rotation manuelle à la souris — désactivée si reduced motion,
    // pour ne pas surprendre un utilisateur qui a explicitement demandé
    // moins de mouvement.
    let dragStart: [number, number] | null = null;
    let rotateStart: [number, number, number] | null = null;

    const dragBehavior = d3
      .drag<HTMLDivElement, unknown>()
      .on('start', (e) => {
        rotating = false;
        dragStart = [e.x, e.y];
        rotateStart = proj.rotate();
      })
      .on('drag', (e) => {
        if (!dragStart || !rotateStart) return;
        proj.rotate([
          rotateStart[0] + (e.x - dragStart[0]) * 0.3,
          rotateStart[1] - (e.y - dragStart[1]) * 0.3,
          rotateStart[2],
        ]);
        redraw();
      })
      .on('end', () => {
        rotating = !prefersReducedMotion;
      });

    if (!prefersReducedMotion) {
      d3.select(container).call(dragBehavior as any);
      container.style.cursor = 'grab';
    }

    function handleResize() {
      if (!container) return;
      W = container.clientWidth;
      H = container.clientHeight;
      R = Math.min(W, H) * 0.45;

      svg.attr('width', W).attr('height', H);
      pinsSvg.attr('width', W).attr('height', H);
      clipCircle.attr('cx', W / 2).attr('cy', H / 2).attr('r', R);
      oceanCircle.attr('cx', W / 2).attr('cy', H / 2).attr('r', R);
      rimCircle.attr('cx', W / 2).attr('cy', H / 2).attr('r', R);
      proj.translate([W / 2, H / 2]).scale(R);
      redraw();
    }

    const resizeObserver = new ResizeObserver(handleResize);
    resizeObserver.observe(container);

    return () => {
      cancelAnimationFrame(frameId);
      resizeObserver.disconnect();
      d3.select(container).selectAll('svg').remove();
    };
  }, [accentColor, landColor, oceanColor, rotationSpeed]);

  return (
    <div
      ref={containerRef}
      className={`relative w-full h-full ${className}`}
      aria-hidden="true"
    />
  );
}
