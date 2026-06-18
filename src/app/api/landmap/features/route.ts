import { NextResponse } from "next/server";
import { pool, isEditor } from "@/lib/landmap-db";

export const dynamic = "force-dynamic";

// GET /api/landmap/features → FeatureCollection of everything in the DB
export async function GET() {
  try {
    const { rows } = await pool.query(
      `SELECT id, layer, name, props, global_phase, sub_phase,
              ST_AsGeoJSON(geom) AS geom
       FROM features ORDER BY id`
    );
    const features = rows.map((r) => ({
      type: "Feature",
      id: r.id,
      geometry: r.geom ? JSON.parse(r.geom) : null,
      properties: {
        id: r.id,
        layer: r.layer,
        name: r.name,
        global_phase: r.global_phase,
        sub_phase: r.sub_phase,
        ...(r.props || {}),
      },
    }));
    return NextResponse.json({ type: "FeatureCollection", features });
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}

// POST /api/landmap/features → create a feature (editor only)
export async function POST(req: Request) {
  if (!isEditor(req))
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  try {
    const b = await req.json();
    if (!b.geometry)
      return NextResponse.json({ error: "geometry required" }, { status: 400 });
    const { rows } = await pool.query(
      `INSERT INTO features(layer, name, props, global_phase, sub_phase, geom)
       VALUES($1,$2,$3,$4,$5, ST_SetSRID(ST_GeomFromGeoJSON($6),4326))
       RETURNING id`,
      [
        b.layer || "custom",
        b.name ?? null,
        b.props ?? {},
        b.global_phase ?? null,
        b.sub_phase ?? null,
        JSON.stringify(b.geometry),
      ]
    );
    return NextResponse.json({ id: rows[0].id });
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}
