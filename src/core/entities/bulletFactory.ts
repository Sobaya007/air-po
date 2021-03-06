import { Entity } from '../ecs/entity'
import { EntityFactory } from './entityFactory'
import { PositionComponent } from '../components/positionComponent'
import { HorizontalDirectionComponent } from '../components/directionComponent'
import { DrawComponent } from '../components/drawComponent'
import { ColliderComponent, AABBDef } from '../components/colliderComponent'
import { PlayerComponent } from '../components/playerComponent'
import { BulletComponent } from '../components/bulletComponent'
import { Vec2 } from '../math/vec2'
import { Category } from './category'
import { Graphics } from 'pixi.js'

export class BulletFactory extends EntityFactory {
  readonly WIDTH = 10
  readonly HEIGHT = 3
  readonly SPEED = 10

  public player?: Entity

  public create(): Entity {
    if (!this.player) {
      console.log('player is not defined')
      return new Entity()
    }
    const player = this.player.getComponent('Player') as PlayerComponent
    const playerPosition = this.player.getComponent(
      'Position'
    ) as PositionComponent
    const playerDirection = this.player.getComponent(
      'HorizontalDirection'
    ) as HorizontalDirectionComponent

    const direction = new Vec2(
      (playerDirection.looking == 'Left' ? -1 : +1) *
        Math.cos((player.bulletAngle * Math.PI) / 180),
      Math.sin((player.bulletAngle * Math.PI) / 180)
    )

    const entity = new Entity()
    const position = new PositionComponent(playerPosition.x, playerPosition.y)
    const draw = new DrawComponent()
    const bullet = new BulletComponent(
      new Vec2(direction.x * this.SPEED, direction.y * this.SPEED)
    )
    const collider = new ColliderComponent(entity)

    const aabbBody = new AABBDef(new Vec2(this.WIDTH, this.HEIGHT))
    aabbBody.offset = new Vec2(0, 0)
    aabbBody.category = Category.PLAYER
    aabbBody.mask = Category.WALL
    aabbBody.maxClipTolerance = new Vec2(0, 0)
    collider.createCollider(aabbBody)

    const graphics = new Graphics()
    graphics.beginFill(0x00ff00)
    graphics.drawRect(0, 0, this.WIDTH, this.HEIGHT)
    draw.addChild(graphics)

    entity.addComponent('Position', position)
    entity.addComponent('Draw', draw)
    entity.addComponent('Collider', collider)
    entity.addComponent('Bullet', bullet)
    return entity
  }
}
