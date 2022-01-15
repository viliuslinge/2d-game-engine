import { IGameRenderer } from "../../GameRenderer";

import { Transform, ITransformProperties } from "../Transform";

import { IBaseShape } from "./types";

export interface IRectShapeProperties {
  width: number;
  height: number;
  transform: ITransformProperties;
}

export class RectShape implements IBaseShape {
  readonly type: "rect";
  private _width: number;
  private _height: number;
  transform: Transform;

  constructor(properties: IRectShapeProperties) {
    this.type = "rect";
    this._width = properties.width;
    this._height = properties.height;
    this.transform = new Transform(properties.transform);
  }

  get width(): number {
    return this._width * this.transform.scale;
  }

  get height(): number {
    return this._height * this.transform.scale;
  }

  render = (renderer: IGameRenderer): void => {
    renderer.lineWidth = 0.5;
    renderer.strokeStyle = "orange";
    renderer.strokeRect(
      this.transform.position.x,
      this.transform.position.y,
      this.width,
      this.height
    );
  };
}
