const {ccclass, property} = cc._decorator;

@ccclass
export default class Canvas extends cc.Component {

    private canvas: cc.Canvas = null;

    onLoad() {
        this.canvas = this.node.getComponent(cc.Canvas);

        const width = cc.winSize.width;
        const height = cc.winSize.height;
        const myWidth = 720;
        const myHeight = 1280;

        /*const scaleFactor = width / myWidth;
        const scale = Math.min(Math.max(scaleFactor, 1.0), 2.0);
        this.node.scale = scale;*/

        this.canvas.fitWidth = true;
        this.canvas.fitHeight = true;

        /*if (width / height > myWidth / myHeight) {    //если шире 
            this.canvas.fitWidth = true;
            this.canvas.fitHeight = false;
        } else {                              //если выше
            this.canvas.fitWidth = false;
            this.canvas.fitHeight = true;
        }*/
    }
}
