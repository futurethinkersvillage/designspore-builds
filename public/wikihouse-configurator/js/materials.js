// Roofing & cladding finish options. These are outer finishes over the WikiHouse
// chassis — they change the 3D colour and add a $/m² cost line (Canadian ballparks,
// installed, 2026). Rates are editable in the cost panel like everything else.

export const ROOFING = [
  { id: "epdm", label: "EPDM membrane", color: "#3a3f45", cad: 70 },
  { id: "standingseam", label: "Standing-seam steel", color: "#8a9299", cad: 145 },
  { id: "corrugated", label: "Corrugated steel", color: "#6f7a82", cad: 95 },
  { id: "asphalt", label: "Asphalt shingle", color: "#4a4640", cad: 78 },
  { id: "cedar", label: "Cedar shingle", color: "#9c6b3f", cad: 165 },
  { id: "greenroof", label: "Green / sedum roof", color: "#5c7a4a", cad: 210 },
];

export const CLADDING = [
  { id: "larch", label: "Larch board (natural)", color: "#c19a68", cad: 95 },
  { id: "charred", label: "Charred timber (shou sugi ban)", color: "#2c2824", cad: 130 },
  { id: "painted", label: "Painted ply / panel", color: "#d8d2c4", cad: 72 },
  { id: "cementboard", label: "Fibre-cement board", color: "#b8bcbd", cad: 88 },
  { id: "cedar", label: "Cedar board", color: "#a9713f", cad: 140 },
  { id: "corten", label: "Corten steel", color: "#8a5a3c", cad: 175 },
  { id: "render", label: "Lime render", color: "#e6e1d6", cad: 110 },
];

export const roofingById = (id) => ROOFING.find((r) => r.id === id) || ROOFING[0];
export const claddingById = (id) => CLADDING.find((c) => c.id === id) || CLADDING[0];
