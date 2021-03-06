import { System } from '../ecs/system'
import { Family, FamilyBuilder } from '../ecs/family'
import { World } from '../ecs/world'
import { DrawComponent } from '../components/drawComponent'
import { PositionComponent } from '../components/positionComponent'
import { Container } from 'pixi.js'
import { Entity } from '../ecs/entity'

export default class DrawSystem extends System {
  private family: Family

  private container: Container = new Container()

  public constructor(world: World, stage: Container) {
    super(world)

    stage.addChild(this.container)

    this.family = new FamilyBuilder(world).include('Draw').build()

    for (const entity of this.family.entities) {
      this.onContainerAdded(entity)
    }
    this.family.entityAddedEvent.addObserver(entity =>
      this.onContainerAdded(entity)
    )
    this.family.entityRemovedEvent.addObserver(entity =>
      this.onContainerRemoved(entity)
    )
  }

  public onContainerAdded(entity: Entity): void {
    const container = entity.getComponent('Draw') as DrawComponent
    this.container.addChild(container)
  }

  public onContainerRemoved(entity: Entity): void {
    const container = entity.getComponent('Draw') as DrawComponent
    if (container) {
      this.container.removeChild(container)
    }
  }

  public update(): void {
    for (const entity of this.family.entities) {
      const container = entity.getComponent('Draw') as DrawComponent
      if (entity.hasComponent('Position')) {
        const position = entity.getComponent('Position') as PositionComponent
        container.position.set(position.x, position.y)
      }
    }
  }
}
