import GameManager from "./GameManager";
import type GameCtrl from "./GameCtrl";

const {ccclass, property} = cc._decorator;

@ccclass
export default class StartMenu extends cc.Component {
   
    @property(cc.Node)
    private blocker: cc.Node = null;

    private ctrl: GameCtrl;

    start() {
        this.blocker.active = true;
        GameManager.onReady(this.handleGameCtrlReady.bind(this));
    }

    handleGameCtrlReady() {
        this.ctrl = GameManager.gameCtrl;
        this.ctrl.bestScoreLabel.string = "";
        this.ctrl.scoreLabel.string = "";
    }
    
    onDestroy() {
        GameManager.offReady(this.handleGameCtrlReady.bind(this));
    }

    onClickStart() {
        this.node.active = false;

        if (this.blocker) {
            this.blocker.active = false;
        }

        this.ctrl.startGame();
    }
}
