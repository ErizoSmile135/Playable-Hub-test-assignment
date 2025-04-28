import GameManager from "./GameManager";
import type GameCtrl from "./GameCtrl";

const {ccclass, property} = cc._decorator;

@ccclass
export default class RetryMenu extends cc.Component {

    @property(cc.Node)
    private blocker: cc.Node = null;

    @property(cc.Label)
    private scoreLabel: cc.Label = null;
    @property(cc.Label)
    private bestScoreLabel: cc.Label = null;
    
    private ctrl: GameCtrl;

    start() {
        this.blocker.active = true;
        this.node.active = false;
        GameManager.onReady(this.handleGameCtrlReady.bind(this));
    }

    handleGameCtrlReady() {
        this.ctrl = GameManager.gameCtrl;
    }
    
    onDestroy() {
        GameManager.offReady(this.handleGameCtrlReady.bind(this));
    }

    show(score: number) {
        this.ctrl.bestScoreLabel.string = "";
        this.ctrl.scoreLabel.string = "";
        
        this.node.active = true;
        this.scoreLabel.string = score.toString();
        const bestScore = Math.max(score, this.getBestScore());
        this.setBestScore(bestScore);
        this.bestScoreLabel.string = bestScore.toString();
    }

    getBestScore(): number {
        const saved = cc.sys.localStorage.getItem("bestScore");
        return saved ? parseInt(saved) : 0;
    }

    setBestScore(score: number) {
        cc.sys.localStorage.setItem("bestScore", score.toString());
    }

    onClickRetry() {
        this.node.active = false;

        if (this.blocker) {
            this.blocker.active = false;
        }

        this.ctrl.restartGame();
    }
}
