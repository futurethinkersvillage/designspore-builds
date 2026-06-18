import { NextResponse } from "next/server";
import { pool, isEditor } from "@/lib/landmap-db";

export const dynamic = "force-dynamic";

type Ctx = { params: Promise<{ id: string }> };

// PATCH /api/landmap/features/:id → update geometry/name/props/phase (editor only)
export async function PATCH(req: Request, { params }: Ctx) {
  if (!isEditor(req))
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  try {
    const { id } = await params;
    const b = await req.json();
    const sets: string[] = [];
    const vals: unknown[] = [id];
    const add = (frag: string, v: unknown) => {
      vals.push(v);
      sets.push(frag.replace("$N", `$${vals.length}`));
    };
    if (b.name !== undefined) add("name = $N", b.name);
    if (b.layer !== undefined) add("layer = $N", b.layer);
    if (b.props !== undefined) add("props = $N", b.props);
    if (b.global_phase !== undefined) add("global_phase = $N", b.global_phase);
    if (b.sub_phase !== undefined) add("sub_phase = $N", b.sub_phase);
    if (b.geometry !== undefined)
      add("geom = ST_SetSRID(ST_GeomFromGeoJSON($N),4326)", JSON.stringify(b.geometry));
    if (!sets.length)
      return NextResponse.json({ error: "nothing to update" }, { status: 400 });
    sets.push("updated_at = now()");
    await pool.query(
      `UPDATE features SET ${sets.join(", ")} WHERE id = $1`,
      vals
    );
    return NextResponse.json({ ok: true });
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}

// DELETE /api/landmap/features/:id (editor only)
export async function DELETE(req: Request, { params }: Ctx) {
  if (!isEditor(req))
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  try {
    const { id } = await params;
    await pool.query(`DELETE FROM features WHERE id = $1`, [id]);
    return NextResponse.json({ ok: true });
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}
