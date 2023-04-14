import * as THREE from 'three';
import {ExtrudeGeometryOptions, Mesh} from 'three';
import {CSG} from '@hi-level/three-csg';

import {ElementRef, Injectable, NgZone, OnDestroy} from '@angular/core';
import {AnimationFrameService} from '../../shared/animation-frame.service';
import {DrawingCanvasStateService} from '../state/drawing-canvas-state.service';
import {CanvasMode, DrawingCanvasState} from '../state/drawing-canvas-state';
import * as exportSTL from 'threejs-export-stl/lib/index.js';
import {Point} from '../geo/point';
import {DEFAULT_THREE_D_SETTINGS, ThreeDSettings} from './three-d-settings';
import {UserActivityService} from '../../shared/user-activity.service';
import {CanvasConstants} from '../../shared/canvas-constants';
import {LoadingService} from '../../shared/loading/loading.service';
/*
dpi is the pixel density or dots per inch.
96 dpi means there are 96 pixels per inch.
1 inch is equal to 25.4 millimeters.

1 inch = 25.4 mm
dpi = 96 px / in
96 px / 25.4 mm

Therefore one pixel is equal to
1 px = 25.4 mm / 96
1 px = 0.26458333 mm
 */
const pixelToMM = 0.26458333;
const LOADING_INDICATOR_KEY = 'ThreeEngineService::Render';

@Injectable()
export class ThreeEngineService implements OnDestroy {


  private canvas: HTMLCanvasElement;
  private renderer: THREE.WebGLRenderer;
  private camera: THREE.PerspectiveCamera;
  private scene: THREE.Scene;
  private light: THREE.AmbientLight;
  private obj3d: Mesh;
  private drawingCanvasState: DrawingCanvasState;
  public needToDraw = false;
  private frameId: number = null;
  private _spin = true;
  private activeRender;
  private _threeDSettings = DEFAULT_THREE_D_SETTINGS;

  public constructor(private ngZone: NgZone,
                     private animationFrameService: AnimationFrameService,
                     private canvasStateService: DrawingCanvasStateService,
                     private loadingService: LoadingService,
                     private userActivityService: UserActivityService) {
    this.registerCanvasStateSubscription();
    this.registerUserActivitySubscription();
  }

  ngOnDestroy() {
    if (this.frameId != null) {
      cancelAnimationFrame(this.frameId);
    }

    if (this.activeRender) {
      clearTimeout(this.activeRender);
    }
  }

  createScene(canvas: ElementRef<HTMLCanvasElement>): void {
    // The first step is to get the reference of the canvas element from our HTML document
    this.canvas = canvas.nativeElement;
    const windowWidth = CanvasConstants.previewWidth;
    const windowHeight = CanvasConstants.previewHeight;


    this.renderer = new THREE.WebGLRenderer({
      canvas: this.canvas,
      alpha: true,    // transparent background
      antialias: true // smooth edges
    });
    this.renderer.setSize(windowWidth, windowHeight);

    // create the scene
    this.scene = new THREE.Scene();

    this.camera = new THREE.PerspectiveCamera(
      75, windowWidth / windowHeight, 0.1, 1000
    );
    this.camera.position.z = 400;
    this.scene.add(this.camera);

    // soft white light
    this.light = new THREE.AmbientLight(0x404040);
    this.light.position.z = 400;
    this.scene.add(this.light);

    // this.obj3d = this.buildShape();
    // this.scene.add(this.obj3d);
    // this.scene.remove(this.obj3d);

  }

  private registerCanvasStateSubscription() {
    this.canvasStateService.getCurrentState()
      .subscribe((canvasState: DrawingCanvasState) => {
        this.drawingCanvasState = canvasState;
        this.needToDraw = true;
      });
  }


  private registerUserActivitySubscription() {
    this.userActivityService.userActiveObservable.subscribe((active: boolean) => {
      if (!active && this.drawingCanvasState && this.scene && this.needToDraw) {
        this.render3DCutter();
      }
    });
  }

  public render3DCutter() {
    this.loadingService.startLoading(LOADING_INDICATOR_KEY);
    if (this.activeRender) {
      clearTimeout(this.activeRender);
    }
    this.activeRender = setTimeout(() => {
      console.log('rendering  using settings', this._threeDSettings);
      if (this.obj3d) {
        this.scene.remove(this.obj3d);
      }
      if (this.canRender3dCutter()) {
        // this.obj3d = this.buildCookieCutterMesh(this.drawingCanvasState);
        const mmPerPixels = 1;
        this.obj3d = this.buildCookieCutterMesh(this.drawingCanvasState, mmPerPixels,
          this._threeDSettings.heightMM, this._threeDSettings.wallThicknessMM);
        const flip = new THREE.Matrix4().makeScale(1, -1, -1);
        this.obj3d.applyMatrix4(flip);
        this.scene.add(this.obj3d);
        console.log('added 3dObj');
      }
      this.needToDraw = false;
      this.activeRender = null;
      this.loadingService.endLoading(LOADING_INDICATOR_KEY);
    }, 100);
  }

  canRender3dCutter(): boolean {
    return this.drawingCanvasState &&
      this.drawingCanvasState.mode === CanvasMode.QUAD_ADJUST &&
      this.drawingCanvasState.quads.length > 1;
  }

  public get pendingRenderUpdates(): boolean {
    return this.needToDraw && this.canRender3dCutter();
  }


  private buildOutlineCSG(canvasState: DrawingCanvasState,
                          pixelConversion: number,
                          outlineThickness: number,
                          outlineThetaSlices: number,
                          extrudeSettings: ExtrudeGeometryOptions,
                          starter: CSG): CSG {
    let outlineShapeCSG = starter;
    const radius = outlineThickness * pixelConversion;
    for (let theta = 0; theta < 360; theta += outlineThetaSlices) {
      const xMove = radius * Math.sin(theta);
      const yMove = radius * Math.cos(theta);

      const outlineShape = new THREE.Shape();
      outlineShape.moveTo(
        (canvasState.quads[0].start.x * pixelConversion) + xMove,
        (canvasState.quads[0].start.y * pixelConversion) + yMove);
      canvasState.quads.forEach(q => {
        outlineShape.quadraticCurveTo(
          (q.middle.x * pixelConversion) + xMove,
          (q.middle.y * pixelConversion) + yMove,
          (q.end.x * pixelConversion) + xMove,
          (q.end.y * pixelConversion) + yMove);
      });
      const outlineGeometry = new THREE.ExtrudeGeometry(outlineShape, extrudeSettings);
      const outlineMesh = new THREE.Mesh(outlineGeometry);
      outlineMesh.updateMatrix();
      const csg = CSG.fromMesh(outlineMesh);
      if (outlineShapeCSG) {
        outlineShapeCSG = outlineShapeCSG.union(csg);
      } else {
        outlineShapeCSG = csg;
      }
    }
    return outlineShapeCSG;
  }

  private buildCookieCutterCSG(canvasState: DrawingCanvasState,
                               pixelConversion: number,
                               depth: number,
                               outlineThickness: number,
                               outlineThetaSlices: number): { mesh: Mesh, csg: CSG } {


    const innerShape = new THREE.Shape();
    innerShape.moveTo(
      canvasState.quads[0].start.x * pixelConversion,
      canvasState.quads[0].start.y * pixelConversion);
    canvasState.quads.forEach(q => {
      innerShape.quadraticCurveTo(
        q.middle.x * pixelConversion,
        q.middle.y * pixelConversion,
        q.end.x * pixelConversion,
        q.end.y * pixelConversion);
    });

    const extrudeSettings: ExtrudeGeometryOptions = {
      steps: 0,
      depth: depth * pixelConversion,
      bevelEnabled: true,
      bevelThickness: 0,
      bevelSize: 0,
      bevelOffset: 0,
      bevelSegments: 1
    };
    const extrudeSettingsHandle: ExtrudeGeometryOptions = {
      steps: 0,
      depth: depth / 4.0 * pixelConversion,
      bevelEnabled: true,
      bevelThickness: 0,
      bevelSize: 0,
      bevelOffset: 0,
      bevelSegments: 1
    };


    let outlineShapeCSG = this.buildOutlineCSG(canvasState,
      pixelConversion,
      outlineThickness,
      outlineThetaSlices,
      extrudeSettings,
      null);
    outlineShapeCSG = this.buildOutlineCSG(canvasState,
      pixelConversion,
      outlineThickness * 4,
      outlineThetaSlices,
      extrudeSettingsHandle,
      outlineShapeCSG);

    const innerGeometry = new THREE.ExtrudeGeometry(innerShape, extrudeSettings);
    const innerMesh = new THREE.Mesh(innerGeometry);
    innerMesh.updateMatrix();
    innerMesh.position.set(innerMesh.position.x, innerMesh.position.y, 0);
    const innerShapeCSG = CSG.fromMesh(innerMesh);
    const differenceCSG = outlineShapeCSG.subtract(innerShapeCSG);
    return {csg: differenceCSG, mesh: innerMesh};
  }

  private buildCookieCutterMesh(canvasState: DrawingCanvasState,
                                mmPerPixel = 1, depthInMM = 16.51, outlineThicknessInMM = 2): Mesh {
    const outlineThetaSlices = 10;
    const cutter = this.buildCookieCutterCSG(canvasState,
      mmPerPixel,
      depthInMM / mmPerPixel,
      outlineThicknessInMM / mmPerPixel,
      outlineThetaSlices);
    const meshResult = CSG.toMesh(cutter.csg, cutter.mesh.matrix);
    const material = new THREE.MeshBasicMaterial({color: 0x000000, wireframe: false});
    return new THREE.Mesh(meshResult.geometry.center(), material);
  }

  canExportToSTL(): boolean {
    return !!(this.drawingCanvasState && this.drawingCanvasState.quads && this.drawingCanvasState.quads.length > 0);
  }

  private findMaxDistanceBetweenPoints(canvasState: DrawingCanvasState): number {
    const dists = [];
    canvasState.points.forEach((pt1: Point) => {
      canvasState.points.forEach((pt2: Point) => {
        dists.push(Point.distanceBetween(pt1, pt2));
      });
    });
    return Math.max(...dists);
  }

  exportToSTL(settings: ThreeDSettings): { blob: Blob, name: string, canvasState: DrawingCanvasState } {
    if (this.canExportToSTL()) {
      this.loadingService.startLoading(LOADING_INDICATOR_KEY);
      let maxPixelDistance = this.findMaxDistanceBetweenPoints(this.drawingCanvasState);
      if (maxPixelDistance <= 0) {
        maxPixelDistance = 1;
      }
      const mmPerPixels = settings.desiredSizeMM / maxPixelDistance;
      const mesh = this.buildCookieCutterMesh(this.drawingCanvasState, mmPerPixels, settings.heightMM, settings.wallThicknessMM);
      mesh.position.set(mesh.position.x, mesh.position.y, 0);
      const buffer = exportSTL.fromMesh(mesh);
      const blob = new Blob([buffer], {type: exportSTL.mimeType});
      this.loadingService.endLoading(LOADING_INDICATOR_KEY);
      return {
        blob,
        name: `cookie_cutter_${(new Date()).getTime()}.stl`,
        canvasState: this.drawingCanvasState.deepCopy()
      };
      // FileSaver.saveAs(blob,);
    }
    return null;
  }


  animate(): void {
    // We have to run this outside angular zones,
    // because it could trigger heavy changeDetection cycles.
    this.render();
    // this.ngZone.runOutsideAngular(() => {
    //   if (document.readyState !== 'loading') {
    //     this.render();
    //   } else {
    //     window.addEventListener('DOMContentLoaded', () => {
    //       this.render();
    //     });
    //   }
    // });
  }

  render() {
    this.frameId = this.animationFrameService.requestAnimationFrame(() => {
      this.render();
    });

    if (this.obj3d && this._spin) {
      // this.obj3d.rotation.x += 0.01;
      this.obj3d.rotation.y += 0.01;
    }

    this.renderer.render(this.scene, this.camera);
  }

  get spin(): boolean {
    return this._spin;
  }

  set spin(s: boolean) {
    this._spin = s;
  }

  get threeDSettings(): ThreeDSettings {
    return this._threeDSettings;
  }

  set threeDSettings(three: ThreeDSettings) {
    this._threeDSettings = three;
    this.needToDraw = true;
  }

}
