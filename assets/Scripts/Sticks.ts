import GameManager from "./GameManager";
import type GameCtrl from "./GameCtrl";

const {ccclass, property} = cc._decorator;

@ccclass 
export default class Sticks extends cc.Component {
    
    @property (cc.Prefab)
    private stick: cc.Prefab = null;
    private sticks: cc.Node[] = [];

    @property
    public stickWidth: number = 10;
    @property
    public stickColor: cc.Color = cc.Color.ORANGE;
    @property
    public growSpeed: number = 500;
    @property
    public fallSpeed: number = 1500; 

    private ctrl: GameCtrl;
    private startPositionX: number;

    private firstStickHeight: number = 0;
    private lastStickHeight: number = 0;

    onLoad() {
        GameManager.onReady(this.handleGameCtrlReady.bind(this));
    }

    handleGameCtrlReady() {
        this.ctrl = GameManager.gameCtrl;
        this.startPositionX = this.ctrl.getStartPositionX();
        this.reset();
    }
    
    onDestroy() {
        GameManager.offReady(this.handleGameCtrlReady.bind(this));
    }

    reset() {
        this.removeSticks();
        this.spawnStick(this.startPositionX);
    }

    removeSticks(){
        for (const node of this.sticks) {
            if (cc.isValid(node)) {
                node.destroy();
            }
        }
        this.sticks.length = 0;
    }

    spawnStick(positionX: number) {
        const newStick = cc.instantiate(this.stick);
        newStick.setAnchorPoint(cc.v2(1, 0));
        newStick.setPosition(cc.v2(positionX, -this.ctrl.screenHeight/2 + this.ctrl.heightColumn));
        newStick.width = this.stickWidth;
        newStick.angle = 0;
        newStick.group = this.node.group;

        newStick.addComponent(cc.Graphics);
        this.drawStick(newStick, 0);

        if(this.sticks.length == 2){
            const preLastStick = this.sticks.shift();
            preLastStick.destroy();
        }

        this.node.addChild(newStick);
        this.sticks.push(newStick);
    }

    drawStick(stick: cc.Node, height: number) {
        const graphic = stick.getComponent(cc.Graphics);
        graphic.fillColor = this.stickColor;
        graphic.rect(-this.stickWidth, 0, this.stickWidth, height);
        graphic.fill();

        this.firstStickHeight = this.lastStickHeight;
        this.lastStickHeight = height;
    }

    grow(stick: cc.Node, deltaHeight: number) {
        if(this.lastStickHeight <= this.ctrl.screenHeight)
            this.drawStick(stick, this.lastStickHeight + deltaHeight);
    }
    
    fall(stick: cc.Node) {
        cc.tween(stick)
            .to(this.ctrl.screenWidth/this.fallSpeed, { angle: -90 }, { easing: 'quadIn' })
            .call(() => this.ctrl.onFallStickFinished()) 
            .start();
    }

    fallDown(stick: cc.Node) {
        cc.tween(stick)
            .to(this.ctrl.screenWidth/this.fallSpeed, { angle: -180 }, { easing: 'quadIn' })
            .call(() => this.ctrl.onFallDownStickFinished())
            .start();
    }

    getLastStick(): cc.Node{
        return this.sticks[this.sticks.length - 1];
    }

    getStickHeight(): number{
        return this.lastStickHeight;
    }
}
