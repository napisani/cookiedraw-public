
export interface SavedCanvasState {
  points: SavedPoint[];
  quads: SavedQuadCurve[];
}

export interface SavedCookieCutter {
  cutterId: number;
  description: string;
  canvasState: SavedCanvasState;
  approved: boolean;
  reviewed: boolean;
  rating: number;
  downloadCount: number;
  createdAt: number;
  updatedAt: number;
  tags: SavedCookieCutterTag[];
}

// export interface SavedCanvasImage {
//   img: any;
//   offsetX: number;
//   offsetY: number;
//   height: number;
//   width: number;
// }


export interface SavedPoint {
  x: number;
  y: number;
}

export interface SavedQuadCurve {
  start: SavedPoint;
  middle: SavedPoint;
  end: SavedPoint;
}

export interface SavedCookieCutterTag {
  tag: string;
  cookieCutters: SavedCookieCutter[];

}
