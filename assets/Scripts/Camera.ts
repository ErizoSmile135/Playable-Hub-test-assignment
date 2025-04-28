import GameManager from "./GameManager";
import type GameCtrl from "./GameCtrl";

const {ccclass, property} = cc._decorator;

@ccclass
export default class Camera extends cc.Component {

    @property (cc.Node)
    public background: cc.Node = null;

    @property
    public moveSpeed: number = 2300;
    @property
    private shakeStrength: number = 10; 

    private originalPosition: cc.Vec2 = null;
    private ctrl: GameCtrl;

    start() {
        GameManager.onReady(this.handleGameCtrlReady.bind(this));
        this.background.setPosition(cc.v2(0, 0));
    }

    handleGameCtrlReady() {
        this.ctrl = GameManager.gameCtrl;
    }
    
    onDestroy() {
        GameManager.offReady(this.handleGameCtrlReady.bind(this));
    }

    startShakeAnimation() {
        this.originalPosition = this.node.getPosition();

        const t: cc.Tween = cc.tween(this.node);
    
        for (let i = 0; i < 10; i++) {
            const offsetX = (Math.random() * 2 - 1) * this.shakeStrength;
            const offsetY = (Math.random() * 2 - 1) * this.shakeStrength;
    
            t.to(0.02, { position: cc.v2(this.originalPosition.x + offsetX, this.originalPosition.y + offsetY) });
        }
    
        t.to(0.02, { position: this.originalPosition })
         .start();
    }

    move(){
        const tempCol: cc.Node[] = this.ctrl.columns.move();

        const camera = this.node;
        const startPositionDistance = tempCol[1].x - tempCol[0].x;
        const targetX = tempCol[1].x + tempCol[1].width + this.ctrl.screenWidth/2 - this.ctrl.startDistance;

        cc.tween(camera)
            .to(startPositionDistance/this.moveSpeed, { x: targetX }, { easing: 'linear' })
            .start();

        cc.tween(this.background)
            .to(startPositionDistance/this.moveSpeed, { x: targetX }, { easing: 'linear' })
            .start();

    }

}
