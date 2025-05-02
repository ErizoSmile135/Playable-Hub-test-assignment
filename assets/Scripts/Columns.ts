import GameManager from "./GameManager";
import type GameCtrl from "./GameCtrl";

const {ccclass, property} = cc._decorator;

@ccclass
export default class Columns extends cc.Component {

    @property (cc.Prefab)
    private column: cc.Prefab = null;
    private columns: cc.Node[] = [];
    
    @property
    public minDistance: number = 50;
    @property
    public minWidthColumn: number = 50;
    @property
    public maxWidthColumn: number = 200;
    @property
    public heightColumn: number = 300
    @property
    private colorColumn: cc.Color = cc.Color.BLUE;

    private ctrl: GameCtrl;
    private screenWidth: number;
    private screenHeight: number;
    private startPositionX: number;
    private startDistance: number;

    onLoad () {
        GameManager.onReady(this.handleGameCtrlReady.bind(this));
    }

    handleGameCtrlReady() {
        this.ctrl = GameManager.gameCtrl;
        this.screenWidth = this.ctrl.screenWidth;
        this.screenHeight = this.ctrl.screenHeight
        this.startPositionX = this.ctrl.getStartPositionX();
        this.startDistance = this.ctrl.startDistance;
        this.reset();
    }

    onDestroy() {
        GameManager.offReady(this.handleGameCtrlReady.bind(this));
    }

    reset() {
        this.removeColumns();

        const firstColumn = this.spawnColumn();
        firstColumn.setPosition(cc.v2(-firstColumn.width/2, -this.screenHeight/2));
        this.node.addChild(firstColumn);
        this.columns.push(firstColumn);

        const secondColumn = this.spawnColumn();
        secondColumn.setPosition(cc.v2(this.screenWidth, -this.screenHeight/2));
        this.node.addChild(secondColumn);
        this.columns.push(secondColumn);
    }

    removeColumns(){
        for (const node of this.columns) {
            if (cc.isValid(node)) {
                node.destroy();
            }
        }
        this.columns.length = 0;
    }
  
    setStartColumnPosition(){
        const startPositionDistance = -this.startPositionX + this.columns[0].x + this.columns[0].width;
        const maxCountAmin: number = 2;
    
        cc.tween(this.columns[0])
            .to(startPositionDistance/this.ctrl.camera.moveSpeed, { x: this.startPositionX - this.columns[0].width }, { easing: 'linear' })
            .start();

        const distance = this.getRandomRange(this.minDistance, this.screenWidth - this.startDistance - this.columns[1].width);
        const secondColumnPosition = this.startPositionX + distance;
        const moveDistance = this.screenWidth - this.startDistance - distance;

        cc.tween(this.columns[1])
            .to(moveDistance/this.ctrl.camera.moveSpeed, { x: secondColumnPosition  }, { easing: 'linear' })
            .start();
    }

    spawnColumn(): cc.Node {
        const newColumn = cc.instantiate(this.column);
        newColumn.setAnchorPoint(cc.v2(0, 0));
        newColumn.width = this.getRandomRange(this.minWidthColumn, this.maxWidthColumn);
        newColumn.height = this.heightColumn;
        newColumn.group = this.node.group;

        const graphic = newColumn.addComponent(cc.Graphics);
        graphic.fillColor = this.colorColumn;
        graphic.rect(0, 0, newColumn.width, newColumn.height);
        graphic.fill();

        return newColumn;
    }

    spawnNextColumn() {
        const nextColumn = this.spawnColumn();
        const positionX = this.columns[this.columns.length - 1].x + this.columns[this.columns.length - 1].width + this.startDistance;
        nextColumn.setPosition(cc.v2(positionX, -this.screenHeight/2));
        this.node.addChild(nextColumn);
        this.columns.push(nextColumn);
    }

    move(): cc.Node[] {
        this.spawnNextColumn();
        const firstColumn = this.columns[this.columns.length - 3];
        const secondColumn = this.columns[this.columns.length - 2];
        const thirdColumn = this.columns[this.columns.length - 1];
        const targetX = secondColumn.x + secondColumn.width + this.screenWidth/2 - this.startDistance;
    
        thirdColumn.setPosition(cc.v2(targetX + this.screenWidth, -this.screenHeight/2))
    
        const distance = this.getRandomRange(this.minDistance, this.screenWidth - this.startDistance - thirdColumn.width);
        const thirdColumnPosition = secondColumn.x + secondColumn.width + distance;
        const moveDistance = this.screenWidth - this.startDistance - distance;
    
        cc.tween(thirdColumn)
            .to(moveDistance/this.ctrl.camera.moveSpeed, { x: thirdColumnPosition  }, { easing: 'linear' })
            .call(() => this.ctrl.onMoveColumnFinished())
            //.call(() => firstColumn.destroy())
            .start();

        if(this.columns.length == 6){
            const oldStick = this.columns.shift();
            oldStick.destroy();
        }

        const tempCol: cc.Node[] = [];
        tempCol.push(firstColumn, secondColumn);
        return tempCol;
    }

    getRandomRange(min: number, max: number): number {
        return min + Math.random() * (max - min);
    }

    getFirstColumnPosition(): number{
        return this.columns[this.columns.length - 2].x;
    }
    
    getFirstColumnWidth(): number{
        return this.columns[this.columns.length - 2].width;
    }

    getSecondColumnPosition(): number{
        return this.columns[this.columns.length - 1].x;
    }
    
    getSecondColumnWidth(): number{
        return this.columns[this.columns.length - 1].width;
    }
}



