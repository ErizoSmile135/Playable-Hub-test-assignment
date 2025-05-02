const {ccclass, property} = cc._decorator;

@ccclass
export default class Canvas extends cc.Component {

    private canvas: cc.Canvas = null;

    onLoad() {
        this.canvas = this.node.getComponent(cc.Canvas);
        this.canvas.fitWidth = false;
        this.canvas.fitHeight = true;
    }
}
