// Core domain types for the Portal Map mindmap tool.
// Edges are derived from `parentId`, so we never store them explicitly.

export type FileType = "doc" | "sheet" | "slides";

/** A link from a node to a specific sub-location in a Google file. */
export interface NodeLink {
  fileId: string;
  fileType: FileType;
  fileName: string;
  /** Human label for the target, e.g. "Heading: Phase 1 Build". */
  targetLabel: string;
  /** Deep link with the exact fragment (#heading=, #gid=&range=, #slide=). */
  deepLinkUrl: string;
}

export type NodeKind = "root" | "branch" | "leaf";

export interface MapNode {
  id: string;
  parentId: string | null;
  kind: NodeKind;
  label: string;
  /** Small sublabel shown under the node (branches) or omitted (leaves). */
  sublabel?: string;
  /** Short one-line description (lead) shown in the sidebar + cards. */
  detail?: string;
  /** Fuller investor writeup. Multiple paragraphs separated by blank lines (\n\n). */
  body?: string;
  /** A few supporting photos shown in the side panel (paths under /images/...). */
  gallery?: string[];
  /** Optional "learn more" link to a relevant page, shown at the end of the text. */
  moreLink?: { href: string; label: string };
  /** Accent color (hex). Inherited visually by descendants. */
  color?: string;
  /** Phosphor icon key (see ICONS in MindNode). */
  icon?: string;
  /** Image path (e.g. /images/branches/land.jpg) for image-backed cards. */
  image?: string;
  /** 1 (simple) – 5 (complex). Drives sidebar progressive disclosure. */
  complexity?: number;
  /** Funding tier ($M) at which this becomes active. Leaves inherit their branch's tier. */
  tier?: number;
  links?: NodeLink[];
}

export interface MindMap {
  id: string;
  title: string;
  subtitle?: string;
  /** Small mono eyebrow above the title. */
  eyebrow?: string;
  /** One-line description under the title. */
  tagline?: string;
  /** Footer lead-in line above the entity stack. */
  footerLead?: string;
  /** Connective-tissue entities shown in the footer. */
  entities?: string[];
  /** Project walkthrough video (embeddable URL). */
  walkthrough?: { url: string; title: string };
  nodes: MapNode[];
}
