import { ITransformProperties } from "engine/components/Transform";
import { IAttributesProperties } from "engine/components/Attributes";
import { CircleShape } from "engine/components/shapes";
import { BaseObject } from "engine/components/objects";
import { Movement } from "engine/components/Movement";
import { World } from "engine/World";

import { IKeyboardHandler } from "../..//KeyboardHandler";

import { Bullet } from "../Bullet";

import { AirplaneSprite } from "./AirplaneSprite";
import { AirplaneKeyboardHandler } from "./AirplaneKeyboardHandler";

interface IAirplaneProperties {
  attributes: IAttributesProperties;
  transform: ITransformProperties;
}

export class Airplane extends BaseObject<AirplaneSprite, CircleShape> {
  private keyboardHandler: IKeyboardHandler;

  constructor(world: World, properties: IAirplaneProperties) {
    super(world, {
      attributes: properties.attributes,
      shape: new CircleShape({
        radius: 16,
        transform: {
          position: properties.transform.position,
          scale: properties.transform.scale * 4,
        },
      }),
      sprite: new AirplaneSprite({
        transform: {
          position: properties.transform.position,
          scale: properties.transform.scale * 4,
        },
      }),
    });

    this.keyboardHandler = new AirplaneKeyboardHandler(this);
    this.keyboardHandler.enable();
  }

  update = (): void => {
    Movement.boundary(this, {
      position: { x: 0, y: 0 },
      width: this.world.game.properties.width,
      height: this.world.game.properties.height,
    });

    this.sprite.transform.setPosition({
      x: this.sprite.transform.position.x + this.attributes.velocity.x,
      y: this.sprite.transform.position.y + this.attributes.velocity.y,
    });

    this.shape.transform.setPosition({
      x: this.shape.transform.position.x + this.attributes.velocity.x,
      y: this.shape.transform.position.y + this.attributes.velocity.y,
    });
  };

  shot = (): void => {
    this.world.addObject(
      new Bullet(this.world, {
        transform: {
          position: this.shape.transform.position,
          scale: 1,
        },
        attributes: {
          velocity: { x: 0, y: -30 },
          maxVelocity: 15,
          mass: 1,
          friction: 0.996,
          restitution: 1,
        },
      })
    );

    this.world.addObject(
      new Bullet(this.world, {
        transform: {
          position: {
            x: this.shape.transform.position.x + this.shape.radius * 2,
            y: this.shape.transform.position.y,
          },
          scale: 1,
        },
        attributes: {
          velocity: { x: 0, y: -30 },
          maxVelocity: 15,
          mass: 1,
          friction: 0.996,
          restitution: 1,
        },
      })
    );
  };

  moveLeft = (): void => {
    this.sprite.setCurrentAnimationID("walk-left");
    this.attributes.setVelocity({
      x: -this.attributes.maxVelocity,
      y: this.attributes.velocity.y,
    });
  };

  moveRight = (): void => {
    this.sprite.setCurrentAnimationID("walk-right");
    this.attributes.setVelocity({
      x: this.attributes.maxVelocity,
      y: this.attributes.velocity.y,
    });
  };

  moveUp = (): void => {
    this.sprite.setCurrentAnimationID("walk-up");
    this.attributes.setVelocity({
      x: this.attributes.velocity.x,
      y: -this.attributes.maxVelocity,
    });
  };

  moveDown = (): void => {
    this.sprite.setCurrentAnimationID("walk-down");
    this.attributes.setVelocity({
      x: this.attributes.velocity.x,
      y: this.attributes.maxVelocity,
    });
  };

  stopLeft = (): void => {
    if (this.attributes.velocity.x <= 0) {
      this.sprite.setCurrentAnimationID("idle-left");
      this.stop();
    }
  };

  stopRight = (): void => {
    if (this.attributes.velocity.x >= 0) {
      this.sprite.setCurrentAnimationID("idle-right");
      this.stop();
    }
  };

  stopUp = (): void => {
    if (this.attributes.velocity.y <= 0) {
      this.sprite.setCurrentAnimationID("idle-up");
      this.stop();
    }
  };

  stopDown = (): void => {
    if (this.attributes.velocity.y >= 0) {
      this.sprite.setCurrentAnimationID("idle-down");
      this.stop();
    }
  };

  stop = (): void => {
    this.attributes.setVelocity({
      x: 0,
      y: 0,
    });
  };
}
