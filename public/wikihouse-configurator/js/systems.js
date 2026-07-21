// System profiles. Each WikiHouse Skylark system has its OWN block-naming scheme.
// The assembler generates block IDs ONLY through the active profile, so a block
// from one system can never appear in another system's assembly. Adding a system
// = adding a profile + its blocks-<SYSTEM>.json manifest. Nothing is shared.

export const SYSTEMS = {
  SKYLARK250: {
    id: "SKYLARK250",
    label: "Skylark 250",
    blurb: "250 mm walls · 1–3 storey · full block range",
    wallDepth: 0.25,
    wallHeights: { S: 2.1, M: 2.4, L: 2.7, XL: 3.0 },
    // block-id factories (span code + wall-height code)
    wall: (h) => `WALL-${h}`,
    corner: (h) => `CORNER-${h}`,
    floor: (s) => `FLOOR-${s}-0`,
    endFloor: (s) => `END-${s}-0`,
    window1: (h) => `WINDOW-${h}3`,   // 1-module window
    window2: (h) => `WINDOW-${h}4`,   // 2-module window
    door: (h) => `DOOR-${h}1`,        // 2-module door
    skylight: (s) => `SKYLIGHT-${s}`,
    gableEndFamily: "WALL-G42",
    skillionToppers: "WALL-S10",
    roofTypes: [
      { id: "gable42", label: "Gable 42°", kind: "gable", block: (s) => `ROOF-${s}42`, perModule: 2, endWall: "gable42" },
      { id: "skillion10", label: "Skillion 10°", kind: "skillion", block: (s) => `ROOF-${s}10`, perModule: 1, endWall: "skillion10" },
    ],
  },

  SKYLARK200: {
    id: "SKYLARK200",
    label: "Skylark 200",
    blurb: "200 mm walls · lighter · flat or gable roofs",
    wallDepth: 0.20,
    wallHeights: { S: 2.1, M: 2.4, L: 2.7, XL: 3.0 },
    wall: (h) => `WALL-${h}`,
    corner: (h) => `CORNER-${h}`,
    floor: (s) => `FLOOR-${s}-0`,
    endFloor: (s) => `END-${s}-0`,
    window1: (h) => `WINDOW-${h}3`,
    window2: (h) => `WINDOW-${h}4`,
    door: (h) => `DOOR-${h}1`,
    skylight: (s) => `SKYLIGHT-${s}`,
    gableEndFamily: "WALL-G42",
    vergeFamily: "VERGE",             // flat-roof edge pieces (VERGE+S / VERGE-S)
    roofTypes: [
      { id: "gable42", label: "Gable 42°", kind: "gable", block: (s) => `ROOF-42-${s}`, perModule: 2, endWall: "gable42" },
      { id: "flat", label: "Flat (1:80 fall)", kind: "flat", block: (s) => `ROOF-${s}`, perModule: 1, endWall: "flat" },
    ],
  },
};

export const DEFAULT_SYSTEM = "SKYLARK250";
