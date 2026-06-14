import { create } from "zustand";
import type { MindMap, MapNode } from "./types";
import { PORTAL_PLACE_MAP } from "./seed";

export type ViewMode = "map" | "read";
export type LeafLayout = "list" | "columns" | "tree";
export type FocusStyle = "top-grid" | "rotate" | "header-grid";

/** Funding tier stops in $M, from the real phased plan (Project Facts).
 *  $3M near-term · $6M Phase 2 · $20M Phase 3 · $50M+ full network. */
export const FUNDING_TIERS = [3, 6, 20, 50];

interface MapState {
  map: MindMap;
  /** branchId -> expanded (leaves visible). */
  expanded: Record<string, boolean>;
  hoveredId: string | null;
  selectedId: string | null;
  /** Branch currently focused (zoomed-to); dims the rest. */
  focusBranchId: string | null;
  view: ViewMode;
  query: string;
  /** Current funding level ($M). Nodes with a higher tier are shown faded. */
  funding: number;
  /** How expanded sub-items are arranged (radial in-place expansion). */
  leafLayout: LeafLayout;
  /** Branch currently opened in the full Focus/grid view (null = radial overview). */
  exploreId: string | null;
  /** Which Focus-view arrangement to use. */
  focusStyle: FocusStyle;
  /** Image src currently open in the fullscreen lightbox (null = closed). */
  lightbox: { src: string; caption?: string } | null;
  /** YouTube embed URL open in the video modal (null = closed). */
  video: { url: string; title?: string } | null;

  byId: (id: string) => MapNode | undefined;
  childrenOf: (id: string) => MapNode[];
  toggleBranch: (id: string) => void;
  setHovered: (id: string | null) => void;
  selectNode: (id: string | null) => void;
  setFocus: (id: string | null) => void;
  setView: (v: ViewMode) => void;
  setQuery: (q: string) => void;
  setFunding: (n: number) => void;
  setLeafLayout: (l: LeafLayout) => void;
  explore: (id: string) => void;
  exitExplore: () => void;
  setFocusStyle: (s: FocusStyle) => void;
  openLightbox: (src: string, caption?: string) => void;
  closeLightbox: () => void;
  openVideo: (url: string, title?: string) => void;
  closeVideo: () => void;
  collapseAll: () => void;
  /** Expand the relevant branch and focus/select a node (by id). */
  focusOnNode: (id: string) => void;
}

export const useMapStore = create<MapState>((set, get) => ({
  map: PORTAL_PLACE_MAP,
  expanded: {},
  hoveredId: null,
  selectedId: null,
  focusBranchId: null,
  view: "map",
  query: "",
  funding: 50, // start with the full vision lit; drag down to see what exists today
  leafLayout: "list",
  exploreId: null,
  focusStyle: "top-grid",
  lightbox: null,
  video: null,

  byId: (id) => get().map.nodes.find((n) => n.id === id),
  childrenOf: (id) => get().map.nodes.filter((n) => n.parentId === id),

  toggleBranch: (id) =>
    set((s) => {
      const willExpand = !s.expanded[id];
      // Accordion: only one branch open at a time, so sub-nodes never collide.
      return {
        expanded: willExpand ? { [id]: true } : {},
        focusBranchId: willExpand ? id : null,
        selectedId: id,
      };
    }),

  setHovered: (id) => set({ hoveredId: id }),
  selectNode: (id) => set({ selectedId: id }),
  setFocus: (id) => set({ focusBranchId: id }),
  setView: (v) => set({ view: v }),
  setQuery: (q) => set({ query: q }),
  setFunding: (n) => set({ funding: n }),
  setLeafLayout: (l) => set({ leafLayout: l }),
  explore: (id) =>
    set((s) =>
      s.exploreId === id
        ? { exploreId: null, selectedId: null }
        : { exploreId: id, selectedId: id },
    ),
  exitExplore: () => set({ exploreId: null, selectedId: null, hoveredId: null }),
  setFocusStyle: (s) => set({ focusStyle: s }),
  openLightbox: (src, caption) => set({ lightbox: { src, caption } }),
  closeLightbox: () => set({ lightbox: null }),
  openVideo: (url, title) => set({ video: { url, title } }),
  closeVideo: () => set({ video: null }),
  collapseAll: () => set({ expanded: {}, focusBranchId: null, selectedId: null }),

  focusOnNode: (id) =>
    set((s) => {
      const node = s.map.nodes.find((nn) => nn.id === id);
      if (!node) return {};
      const branchId =
        node.kind === "leaf" ? node.parentId! : node.kind === "branch" ? node.id : null;
      return {
        selectedId: id,
        focusBranchId: branchId,
        expanded: branchId ? { [branchId]: true } : {},
      };
    }),
}));
