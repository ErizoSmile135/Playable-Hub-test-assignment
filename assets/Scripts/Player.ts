import type GameCtrl from "./GameCtrl";
import GameManager from "./GameManager";

const {ccclass, property} = cc._decorator;

@ccclass 
export default class Player extends cc.Component {
 
    private ctrl: GameCtrl;
    private startPositionX: number;
    private startPositionY: number;

    @property
    public moveSpeed: number = 500; 
    @property
    public fallSpeed: number = 1000; 

    onLoad () {
        GameManager.onReady(this.handleGameCtrlReady.bind(this));        
    }

    handleGameCtrlReady() {
        this.ctrl = GameManager.gameCtrl;
        this.startPositionX = this.ctrl.getStartPositionX();
        this.startPositionY = this.ctrl.getStartPositionY();
        this.reset();
    }

    onDestroy() {
        GameManager.offReady(this.handleGameCtrlReady.bind(this));
    }

    reset() {
        this.node.angle = 0;
        this.node.setPosition(cc.v2(this.node.width/2, this.startPositionY));
    } 

    setStartPlayerPosition(){
        const startPositionDistance = -this.startPositionX + this.node.x + this.node.width;

        cc.tween(this.node)
            .to(startPositionDistance/this.ctrl.camera.moveSpeed, { x: this.startPositionX }, { easing: 'linear' }) 
            .start();
    }

    move(distance: number, positionFirstColumn: number, widthFirstColumn: number, positionNextColumn: number, widthNextColumn: number) {
        const maxColumnDistance = positionNextColumn + widthNextColumn; 
        let targetX: number = positionFirstColumn + widthFirstColumn + distance;

        if(targetX >= positionNextColumn && targetX <= maxColumnDistance){
            targetX = maxColumnDistance;
        } else {
            this.ctrl.onGameOver();
        }

        cc.tween(this.node)
            .to(distance/this.moveSpeed, { x: targetX }, { easing: 'linear' }) 
            .call(() => {
                this.ctrl.onMovePlayerFinished();
            })
            .start();
    }

    fall() {
        cc.tween(this.node)
            .to(this.ctrl.screenHeight/this.fallSpeed, { y: this.node.y - this.ctrl.screenHeight, angle: 180 }, { easing: 'quadIn' })
            .call(() => {
                this.ctrl.onFallPlayerFinished();
            })
            .start();
    }   
}
