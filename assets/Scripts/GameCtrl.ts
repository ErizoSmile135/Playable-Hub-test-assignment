import Columns from "./Columns";
import Sticks from "./Sticks";
import Player from "./Player";
import RetryMenu from "./RetryMenu";
import Camera from "./Camera";
import GameManager from "./GameManager";

const {ccclass, property,} = cc._decorator;

@ccclass 
export default class GameCtrl extends cc.Component {

    private touch: boolean = false;
    private upd: boolean = false;
    private moveColumnsFinished: boolean = false;
    private fallStickFinished: boolean = false;
    private movePlayerFinished: boolean = false;
    private fallPlayerFinished: boolean = false;
    private fallDownStickFinished: boolean = false;

    private gameOver: boolean = false;

    @property (Columns)
    public columns: Columns = null;
    @property (Player)
    public player: Player = null;
    @property (Sticks)
    public sticks: Sticks = null;
    @property (RetryMenu)
    public retry: RetryMenu = null;
    @property (Camera)
    public camera: Camera = null;

    @property(cc.Label)
    public scoreLabel: cc.Label = null;
    @property(cc.Label)
    public bestScoreLabel: cc.Label = null;
    @property(cc.Node)
    private perfectLabel: cc.Node = null;
    @property(cc.Node)
    private countScoreLabel: cc.Node = null;
    @property
    private moveScoreDistance: number = 30;
    @property
    private moveScoreSpeed: number = 300;

    @property(cc.Node)
    blocker: cc.Node = null;
    
    public screenWidth: number;
    public screenHeight: number;
    private startPositionX: number; 
    public heightColumn: number;
    public score: number = 0;
    public startDistance: number;

    start () {
        GameManager.init(this);
    }

    onLoad () {
        this.screenWidth = cc.winSize.width;
        this.screenHeight = cc.winSize.height
        this.startPositionX = -(this.screenWidth / 2) + (this.screenWidth / 5);
        this.heightColumn = this.columns.heightColumn;
        this.startDistance = this.screenWidth / 2 + this.startPositionX;

        this.blocker.width = this.screenWidth;
        this.blocker.height = this.screenHeight;
        this.node.width = this.screenWidth;
        this.node.height = this.screenHeight;

        this.node.on(cc.Node.EventType.TOUCH_START, this.onTouchUp, this);
        this.node.on(cc.Node.EventType.TOUCH_END, this.onTouchDown, this);
        this.node.on(cc.Node.EventType.TOUCH_CANCEL, this.onTouchDown, this);
    }

    startGame(){
        this.columns.setStartColumnPosition();
        this.player.setStartPlayerPosition();
        this.camera.node.setPosition(cc.v2(0, 0));
        this.blocker.active = false;

        this.scoreLabel.string = this.score.toString();
        this.bestScoreLabel.string = this.retry.getBestScore().toString();
    }

    restartGame(){
        this.score = 0;
        this.camera.node.setPosition(cc.v2(0, 0));
        this.columns.reset();
        this.columns.setStartColumnPosition();
        this.player.reset();
        this.player.setStartPlayerPosition();
        this.sticks.reset();
        this.blocker.active = false;

        this.scoreLabel.string = this.score.toString();
        this.bestScoreLabel.string = this.retry.getBestScore().toString();
        this.gameOver = false;

        this.camera.background.setPosition(cc.v2(0, 0));
    }

    onTouchUp(event) {
        this.touch = true;
    }

    onTouchDown(event) {
        this.blocker.active = true;
        this.touch = false;
        this.upd = true;
    }

    onMoveColumnFinished(){
        this.moveColumnsFinished = true;
    }

    onFallStickFinished(){
        this.fallStickFinished = true;
    }

    onFallDownStickFinished(){
        this.fallDownStickFinished = true;
    }

    onMovePlayerFinished(){
        this.movePlayerFinished = true;
    }

    onFallPlayerFinished(){
        this.fallPlayerFinished = true;
    }

    onGameOver(){
        this.gameOver = true;
    }

    countScoreAnimation(){
        this.countScoreLabel.opacity = 0;

        const positionX = this.columns.getSecondColumnPosition() + this.columns.getSecondColumnWidth()/2 - this.camera.node.x;
        const positionY = -this.screenHeight/2 + this.columns.heightColumn - 10;
        this.countScoreLabel.setPosition(cc.v2(positionX, positionY));
        const targetY = positionY + this.moveScoreDistance;

        cc.tween(this.countScoreLabel)
            .parallel(
                cc.tween()
                    .to(this.moveScoreDistance/this.moveScoreSpeed, { opacity: 255 }),
                cc.tween()
                    .to(this.moveScoreDistance/this.moveScoreSpeed, { y: targetY + 10 }, { easing: 'quadOut' })
            )
            .delay(0.2)
            .parallel(
                cc.tween()
                    .to(0.3, { opacity: 0 }),
                cc.tween()
                    .to(0.3, { y: targetY + 25 }, { easing: 'quadIn' }) 
            )
            .start();
    }

    perfectAmination() {
        this.perfectLabel.opacity = 0;
        this.perfectLabel.scale = 1;
        this.perfectLabel.active = true;

        cc.tween(this.perfectLabel)
            .to(0.2, { opacity: 255, scale: 1.2 }, { easing: 'quadOut' })
            .to(0.2, { opacity: 0, scale: 1 }, { easing: 'quadIn' })
            .call(() => {
                this.perfectLabel.active = false;
            })
            .start();
    }
    
    getStartPositionX(): number{
        return this.startPositionX
    }

    getStartPositionY(): number{
        return (-this.screenHeight/2 + this.heightColumn);
    }

    update(dt: number) {
        if (this.touch) {
            this.sticks.grow(this.sticks.getLastStick(), (this.sticks.growSpeed * dt)); 
        }

        if(!this.touch && this.upd){
            this.upd = false;
            this.sticks.fall(this.sticks.getLastStick());
        }

        if (!this.touch && this.fallStickFinished) {
            this.fallStickFinished = false;
            this.player.move(this.sticks.getStickHeight(), 
                             this.columns.getFirstColumnPosition(), this.columns.getFirstColumnWidth(),
                             this.columns.getSecondColumnPosition(), this.columns.getSecondColumnWidth());
                             
            if(!this.gameOver){
                this.score++;
                this.countScoreLabel.getComponent(cc.Label).string = "+1";
                const myPosition= this.sticks.getStickHeight() + this.columns.getFirstColumnPosition() + this.columns.getFirstColumnWidth();
                const perfPosition = this.columns.getSecondColumnPosition() + this.columns.getSecondColumnWidth() / 2;
                if(myPosition >=  perfPosition - 10 && myPosition <=  perfPosition + 10){
                    this.perfectAmination();
                    this.score++;
                    this.countScoreLabel.getComponent(cc.Label).string = "+2";
                }
                this.scoreLabel.string = this.score.toString();
                this.countScoreAnimation();
            }
        }

        if (!this.touch && this.movePlayerFinished) {
            this.movePlayerFinished = false;
            if(this.gameOver){
                this.player.fall();
                this.sticks.fallDown(this.sticks.getLastStick());
            } else 
                this.camera.move();
        }

        if(!this.touch && this.moveColumnsFinished){
            this.moveColumnsFinished = false;
            this.blocker.active = false;

            const positionX = this.columns.getFirstColumnPosition() + this.columns.getFirstColumnWidth();
            this.sticks.spawnStick(positionX);
        }

        if(this.gameOver && this.fallPlayerFinished && this.fallDownStickFinished){
            this.fallPlayerFinished = false;
            this.fallDownStickFinished = false;

            this.camera.startShakeAnimation();
            this.retry.show(this.score);
        }
        
    }
    
}