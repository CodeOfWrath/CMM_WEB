declare module "jspdf-autotable" {
  import { jsPDF } from "jspdf";

  export interface CellDef {
    content?: string | number | null;
    styles?: Partial<CellStyles>;
  }

  export interface CellStyles {
    font?: string;
    fontStyle?: string;
    fontSize?: number;
    halign?: "left" | "center" | "right";
    valign?: "top" | "middle" | "bottom";
    textColor?: string | number | number[];
    fillColor?: string | number | number[];
    cellPadding?: number | { top?: number; right?: number; bottom?: number; left?: number };
    lineColor?: string | number | number[];
    lineWidth?: number;
  }

  export interface AutoTableOptions {
    startY?: number;
    margin?: number | { top?: number; right?: number; bottom?: number; left?: number };
    tableWidth?: "auto" | "wrap" | number;
    theme?: "striped" | "grid" | "plain";
    head?: (string | CellDef)[][];
    body?: (string | CellDef)[][];
    foot?: (string | CellDef)[][];
    headStyles?: Partial<CellStyles>;
    bodyStyles?: Partial<CellStyles>;
    footStyles?: Partial<CellStyles>;
    alternateRowStyles?: Partial<CellStyles>;
    styles?: Partial<CellStyles>;
    showHead?: "firstPage" | "everyPage" | "never";
    showFoot?: "lastPage" | "everyPage" | "never";
    didDrawPage?: (data: HookData) => void;
    didDrawCell?: (data: HookData) => void;
    willDrawCell?: (data: HookData) => void;
    didParseCell?: (data: HookData) => void;
    willParseCell?: (data: HookData) => void;
  }

  export interface HookData {
    cell: CellDef;
    row: { index: number; raw: any };
    column: { index: number; raw: any };
    section: "head" | "body" | "foot";
    table: any;
    cursor: { x: number; y: number };
  }

  export default function autoTable(doc: jsPDF, options: AutoTableOptions): jsPDF;
}