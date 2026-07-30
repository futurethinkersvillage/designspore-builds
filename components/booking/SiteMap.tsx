'use client'

import { useEffect, useRef, useState } from 'react'
import type { Map as LeafletMap, Polygon as LeafletPolygon } from 'leaflet'
import type { Equipment, MapSite, SiteMapData, SiteState } from '@/lib/booking/types'
import { siteState } from '@/lib/booking/fit'

interface Props {
  data: SiteMapData
  sites: MapSite[]
  occupied: Set<number>
  equipment: Equipment
  selected: number | null
  onSelect: (n: number) => void
}

const COLOURS: Record<SiteState, { stroke: string; fill: string; weight: number; dash?: string }> = {
  available:      { stroke: '#4ADE80', fill: '#057C34', weight: 2 },
  selected:       { stroke: '#F0EAD9', fill: '#6B9AAD', weight: 3 },
  occupied:       { stroke: '#8A7F70', fill: '#3A342C', weight: 1 },
  'too-short':    { stroke: '#C4703A', fill: '#4A2E1C', weight: 1, dash: '4 4' },
  'not-bookable': { stroke: '#57534E', fill: '#2A2724', weight: 1, dash: '2 4' },
}

export default function SiteMap({ data, sites, occupied, equipment, selected, onSelect }: Props) {
  const elRef = useRef<HTMLDivElement>(null)
  const mapRef = useRef<LeafletMap | null>(null)
  const polysRef = useRef<Map<number, LeafletPolygon>>(new Map())
  const selectRef = useRef(onSelect)
  selectRef.current = onSelect
  // The map builds asynchronously; without this the styling pass below runs
  // against an empty layer set and every site keeps Leaflet's default blue.
  const [ready, setReady] = useState(false)

  const inCategory = new Set(sites.map(s => s.site_number))

  useEffect(() => {
    if (!elRef.current || mapRef.current) return
    let cancelled = false

    ;(async () => {
      const L = (await import('leaflet')).default
      if (cancelled || !elRef.current) return

      const { width: W, height: H } = data.image
      // CRS.Simple: [0,0] is south-west, so image pixel (px,py) -> latlng (H-py, px).
      const bounds: [[number, number], [number, number]] = [[0, 0], [H, W]]

      const map = L.map(elRef.current, {
        crs: L.CRS.Simple,
        minZoom: -3,
        maxZoom: 2,
        zoomSnap: 0.25,
        attributionControl: false,
      })

      L.imageOverlay(data.image.full, bounds).addTo(map)
      map.setMaxBounds(bounds)

      for (const site of data.sites) {
        const latlngs = site.polygon.map(([px, py]) => [H - py, px] as [number, number])
        const poly = L.polygon(latlngs, {
          interactive: true,
          // Generous tolerance: at fitBounds zoom these pads are ~34px, under the
          // 44px touch-target guideline. Tolerance makes them tappable on a phone.
          bubblingMouseEvents: false,
        })
        poly.addTo(map)
        poly.on('click', () => {
          if (site.bookable_by_number && inCategory.has(site.site_number)) {
            selectRef.current(site.site_number)
          }
        })
        polysRef.current.set(site.site_number, poly)

        const [cx, cy] = site.centroid_px
        L.marker([H - cy, cx], {
          interactive: false,
          icon: L.divIcon({ className: 'site-label', html: site.label, iconSize: [28, 14] }),
        }).addTo(map)
      }

      // Frame this category's sites rather than the whole property, so the pads
      // are big enough to tap.
      const mine = data.sites.filter(s => inCategory.has(s.site_number))
      if (mine.length) {
        const xs = mine.flatMap(s => s.polygon.map(p => p[0]))
        const ys = mine.flatMap(s => s.polygon.map(p => p[1]))
        map.fitBounds(
          [[H - Math.max(...ys), Math.min(...xs)], [H - Math.min(...ys), Math.max(...xs)]],
          { padding: [40, 40] },
        )
      } else {
        map.fitBounds(bounds)
      }

      mapRef.current = map
      setReady(true)
    })()

    return () => {
      cancelled = true
      setReady(false)
      mapRef.current?.remove()
      mapRef.current = null
      polysRef.current.clear()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data])

  useEffect(() => {
    if (!ready) return
    for (const site of data.sites) {
      const poly = polysRef.current.get(site.site_number)
      if (!poly) continue

      const mine = inCategory.has(site.site_number)
      const state: SiteState = mine
        ? siteState(site, occupied, equipment, selected)
        : 'not-bookable'
      const c = COLOURS[state]

      poly.setStyle({
        color: c.stroke,
        fillColor: c.fill,
        weight: c.weight,
        dashArray: c.dash,
        fillOpacity: state === 'available' || state === 'selected' ? 0.55 : mine ? 0.4 : 0.18,
        opacity: mine ? 1 : 0.35,
      })

      const fit = site.max_rv_length_ft ? `up to ${Math.floor(site.max_rv_length_ft)} ft` : ''
      const why =
        !mine ? ' — different category'
        : state === 'too-short' ? ' — doesn’t fit your setup'
        : state === 'occupied' ? ' — already booked'
        : state === 'not-bookable' ? ' — assigned on arrival'
        : ''
      poly.bindTooltip(`Site ${site.label}${fit ? ' · ' + fit : ''}${why}`, { sticky: true })
    }
  }, [ready, data, sites, occupied, equipment, selected])

  return <div ref={elRef} className="h-full w-full rounded-lg overflow-hidden" />
}
