export type ToolStatus = "available" | "borrowed" | "maintenance";
export type ToolCondition = "excellent" | "good" | "fair";
export type ToolCategory = "Power Tools" | "Garden" | "Outdoor Recreation" | "Kitchen" | "Specialty";

export interface ToolBorrower {
  name: string;
  /** Member type — affects badge color */
  type: "Member" | "Work-Stay" | "Guest";
}

export interface Tool {
  id: string;
  name: string;
  category: ToolCategory;
  status: ToolStatus;
  condition: ToolCondition;
  location: string;
  borrower?: ToolBorrower;
  /** ISO-style date string e.g. "Jun 8" */
  checkedOutDate?: string;
  dueDate?: string;
  /** True if dueDate has passed */
  overdue?: boolean;
  notes?: string;
}

export const tools: Tool[] = [
  // Power Tools
  {
    id: "chainsaw-husq",
    name: "Husqvarna 450 Chainsaw",
    category: "Power Tools",
    status: "borrowed",
    condition: "good",
    location: "Workshop A",
    borrower: { name: "Marcus R.", type: "Member" },
    checkedOutDate: "Jun 8",
    dueDate: "Jun 12",
    overdue: true,
    notes: "Fresh chain — sharpened May 28",
  },
  {
    id: "drill-dewalt",
    name: "DeWalt Cordless Drill (20V)",
    category: "Power Tools",
    status: "available",
    condition: "excellent",
    location: "Workshop A",
  },
  {
    id: "circular-saw",
    name: "Makita Circular Saw",
    category: "Power Tools",
    status: "borrowed",
    condition: "good",
    location: "Workshop A",
    borrower: { name: "Kai N.", type: "Member" },
    checkedOutDate: "Jun 10",
    dueDate: "Jun 17",
  },
  {
    id: "angle-grinder",
    name: "Bosch Angle Grinder",
    category: "Power Tools",
    status: "available",
    condition: "good",
    location: "Workshop A",
  },
  {
    id: "orbital-sander",
    name: "Random Orbital Sander",
    category: "Power Tools",
    status: "maintenance",
    condition: "fair",
    location: "Workshop A",
    notes: "Bearings need replacement — parts on order",
  },
  {
    id: "impact-driver",
    name: "Milwaukee Impact Driver",
    category: "Power Tools",
    status: "available",
    condition: "excellent",
    location: "Workshop A",
  },

  // Garden
  {
    id: "rototiller",
    name: "Honda Rototiller",
    category: "Garden",
    status: "borrowed",
    condition: "good",
    location: "Garden Shed",
    borrower: { name: "Elena V.", type: "Member" },
    checkedOutDate: "Jun 9",
    dueDate: "Jun 11",
    overdue: true,
  },
  {
    id: "lawn-mower",
    name: "Toro Self-Propelled Mower",
    category: "Garden",
    status: "available",
    condition: "good",
    location: "Garden Shed",
  },
  {
    id: "weedeater",
    name: "Stihl String Trimmer",
    category: "Garden",
    status: "available",
    condition: "good",
    location: "Garden Shed",
  },
  {
    id: "wood-chipper",
    name: "DR PowerMax Chipper",
    category: "Garden",
    status: "available",
    condition: "excellent",
    location: "Equipment Yard",
  },
  {
    id: "wheelbarrow",
    name: "Heavy-Duty Wheelbarrow",
    category: "Garden",
    status: "available",
    condition: "fair",
    location: "Garden Shed",
  },

  // Outdoor Recreation
  {
    id: "kayak-1",
    name: "Tandem Sea Kayak",
    category: "Outdoor Recreation",
    status: "borrowed",
    condition: "excellent",
    location: "Boat House",
    borrower: { name: "Hannah F.", type: "Guest" },
    checkedOutDate: "Jun 11",
    dueDate: "Jun 13",
  },
  {
    id: "kayak-2",
    name: "Solo Touring Kayak",
    category: "Outdoor Recreation",
    status: "available",
    condition: "good",
    location: "Boat House",
  },
  {
    id: "snowshoes",
    name: "Atlas Snowshoes (Pair)",
    category: "Outdoor Recreation",
    status: "available",
    condition: "good",
    location: "Gear Closet",
    notes: "Off-season — stored until November",
  },
  {
    id: "mtn-bike",
    name: "Mountain Bike (Adult M)",
    category: "Outdoor Recreation",
    status: "available",
    condition: "good",
    location: "Bike Shed",
  },
  {
    id: "tent-6person",
    name: "MSR 6-Person Tent",
    category: "Outdoor Recreation",
    status: "available",
    condition: "excellent",
    location: "Gear Closet",
  },

  // Kitchen
  {
    id: "dehydrator",
    name: "Excalibur 9-Tray Dehydrator",
    category: "Kitchen",
    status: "borrowed",
    condition: "excellent",
    location: "Communal Kitchen",
    borrower: { name: "Yuki T.", type: "Member" },
    checkedOutDate: "Jun 10",
    dueDate: "Jun 14",
  },
  {
    id: "pressure-canner",
    name: "All-American Pressure Canner",
    category: "Kitchen",
    status: "available",
    condition: "good",
    location: "Communal Kitchen",
  },
  {
    id: "stand-mixer",
    name: "KitchenAid Stand Mixer",
    category: "Kitchen",
    status: "available",
    condition: "excellent",
    location: "Communal Kitchen",
  },

  // Specialty
  {
    id: "pressure-washer",
    name: "Karcher Pressure Washer",
    category: "Specialty",
    status: "available",
    condition: "good",
    location: "Equipment Yard",
  },
  {
    id: "generator",
    name: "Honda EU2200i Generator",
    category: "Specialty",
    status: "available",
    condition: "excellent",
    location: "Equipment Yard",
  },
  {
    id: "scaffolding",
    name: "Aluminum Scaffold Set (8 ft)",
    category: "Specialty",
    status: "maintenance",
    condition: "fair",
    location: "Workshop A",
    notes: "Cross-brace replaced — re-certifying this week",
  },
  {
    id: "ladder-ext",
    name: "32 ft Extension Ladder",
    category: "Specialty",
    status: "available",
    condition: "good",
    location: "Workshop A",
  },
];

export interface BorrowingActivity {
  type: "checkout" | "return" | "added" | "maintenance";
  toolName: string;
  borrower?: string;
  time: string;
}

export const borrowingActivity: BorrowingActivity[] = [
  { type: "checkout", toolName: "Tandem Sea Kayak", borrower: "Hannah F.", time: "2 hrs ago" },
  { type: "return", toolName: "Bosch Angle Grinder", borrower: "Ben M.", time: "4 hrs ago" },
  { type: "checkout", toolName: "Excalibur Dehydrator", borrower: "Yuki T.", time: "Yesterday" },
  { type: "checkout", toolName: "Makita Circular Saw", borrower: "Kai N.", time: "Yesterday" },
  { type: "return", toolName: "DeWalt Cordless Drill", borrower: "Anika P.", time: "2 days ago" },
  { type: "maintenance", toolName: "Aluminum Scaffold Set", time: "2 days ago" },
  { type: "added", toolName: "Honda EU2200i Generator", time: "3 days ago" },
  { type: "checkout", toolName: "Honda Rototiller", borrower: "Elena V.", time: "4 days ago" },
];

export const toolStats = (() => {
  const total = tools.length;
  const available = tools.filter((t) => t.status === "available").length;
  const borrowed = tools.filter((t) => t.status === "borrowed").length;
  const overdue = tools.filter((t) => t.overdue).length;
  const maintenance = tools.filter((t) => t.status === "maintenance").length;
  return { total, available, borrowed, overdue, maintenance };
})();

export const toolCategories: ToolCategory[] = [
  "Power Tools",
  "Garden",
  "Outdoor Recreation",
  "Kitchen",
  "Specialty",
];
