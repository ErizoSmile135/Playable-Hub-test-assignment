import GameCtrl from "./GameCtrl";

const {ccclass, property} = cc._decorator;
const READY_EVENT = "Ready";

@ccclass
export default class GameManager {
    static gameCtrl: GameCtrl = null;
    private static _eventTarget: cc.EventTarget = new cc.EventTarget();

    static init(gameCtrl: GameCtrl) {
        this.gameCtrl = gameCtrl;
        this._eventTarget.emit(READY_EVENT);
    }

    static onReady(callback: () => void) {
        if (this.gameCtrl) {
            callback();
        } else {
            this._eventTarget.on(READY_EVENT, callback);
        }
    }

    static offReady(callback: () => void) {
        this._eventTarget.off(READY_EVENT, callback);
    }
}
