import { World } from './core/ecs/world'
import { PositionComponent } from './core/components/positionComponent'
import DebugDrawSystem from './core/systems/debugDrawSystem'
import { application, initializeApplication } from './core/application'
import PhysicsSystem from './core/systems/physicsSystem'
import GravitySystem from './core/systems/gravitySystem'
import { Container } from 'pixi.js'
import DrawSystem from './core/systems/drawSystem'
import { KeyController } from './core/controller'
import { PlayerControlSystem } from './core/systems/playerControlSystem'
import { PlayerFactory } from './core/entities/playerFactory'
import { WallFactory } from './core/entities/wallFactory'
import * as Art from './core/graphics/art'
import { Enemy1Factory } from './core/entities/enemy1Factory'
import { BehaviourTree } from './core/ai/behaviourTree'
import { Sequence } from './core/ai/composite/sequence'
import { MoveTo, Direction } from './core/ai/action/moveTo'
import { AIComponent } from './core/components/aiComponent'
import AISystem from './core/systems/aiSystem'
import { While } from './core/ai/decorator/while'
import { True } from './core/ai/condition/true'

export class Main {
  public static world = new World()
  /*+.† INITIALIZATION †.+*/
  public static init(): void {
    initializeApplication()
    KeyController.init()
    Art.init()

    const debugContainer = new Container()
    debugContainer.zIndex = Infinity
    application.stage.addChild(debugContainer)

    this.world.addSystem(
      new AISystem(this.world),
      new PhysicsSystem(this.world),
      new GravitySystem(this.world),
      new PlayerControlSystem(this.world),
      new DrawSystem(this.world, application.stage),
      new DebugDrawSystem(this.world, debugContainer)
    )

    // 主人公
    const player = new PlayerFactory().create()
    const position = player.getComponent('Position') as PositionComponent
    position.x = 100
    position.y = 50
    this.world.addEntity(player)

    // 敵
    const enemy1 = new Enemy1Factory().create()
    const enemyPosition = enemy1.getComponent('Position') as PositionComponent
    enemyPosition.x = 160
    enemyPosition.y = 140
    this.world.addEntity(enemy1)

    // 壁
    for (let x = 0; x < 50; x++) {
      const wall = new WallFactory().create()
      const p = wall.getComponent('Position') as PositionComponent
      p.x = 8 * x
      if (x < 16) {
        p.y = 50 + 8 * x
      } else {
        p.y = 178
      }
      this.world.addEntity(wall)
    }

    const enemyAI = new While(
      new True(),
      new Sequence([
        new MoveTo(Direction.Right, 2, 60),
        new MoveTo(Direction.Left, 2, 60),
      ])
    )
    const tree = new BehaviourTree(enemyAI)
    enemy1.addComponent('AI', new AIComponent(tree))

    application.ticker.add((delta: number) => this.world.update(delta / 60))
  }
}
Main.init()
