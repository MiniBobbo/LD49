import { GameScene } from "./scenes/GameScene";


export class Cutscene {
    elements:Array<CutsceneElement>;
    scene:GameScene;
    currentElement:CutsceneElement|undefined;
    flag:number = 0;


    constructor(scene:Phaser.Scene) {
        this.scene = scene as GameScene;
        scene.events.on('closedialog', this.Next, this);
        scene.events.on('update', this.update, this);
        this.elements = [];
    }
    Launch() {
        this.scene.time.addEvent({
            delay:300,
            callbackScope:this,
            callback:() =>{        
                this.Next();
            }
        });
    }

    update(time:number, dt:number) {
        if(this.currentElement != null)
            this.currentElement.update(dt);
    }
    Next() {
        if(this.elements.length == 0)
            this.Finished();
        else {
            let e = this.elements.shift();
            e!.Fire();
            this.currentElement = e;

        }
    }
    AddElement(e:CutsceneElement) {
        this.elements.push(e);
        e.parent = this;
    }

    Finished() {
        this.scene.events.removeListener('update', this.update, this);
        this.scene.events.on('closedialog', this.Next, this);
    }

    AddDialog(speaker:any, message:string) {
        let d = new DialogElement(this.scene, speaker, message);
        d.parent = this;
        this.elements.push(d);
    }

    AddWait(waitTime:number) {
        let w = new WaitElement(this.scene, waitTime);
        w.parent = this;
        this.elements.push(w);
    }
}

/**
 * A cutscene element is a single set of things (tweens, animations, etc) that
 * should happen in a row.  When these things are completed the cutscene should
 * move onto the next CutsceneElement (generally these will be broken up by dialog
 * boxes that the user has to press a key to advance through.)
 */
export class CutsceneElement {
    gs:GameScene;
    parent!:Cutscene;
    delay:number = 100000;
    constructor(gs:GameScene) {
        this.gs = gs;
    }
    Fire() {
        
    }
    update(dt:number) {
        this.delay -= dt;
        if(this.delay <= 0)
            this.parent.Next(); 
    }
}

/**
 * A cutscene element is a single set of things (tweens, animations, etc) that
 * should happen in a row.  When these things are completed the cutscene should
 * move onto the next CutsceneElement (generally these will be broken up by dialog
 * boxes that the user has to press a key to advance through.)
 */
class DialogElement {
    gs:GameScene;
    parent!:Cutscene;
    delay:number = 100000;
    speaker:any;
    message:string;
    constructor(gs:GameScene, speaker:any, message:string) {
        this.gs = gs;
        this.speaker = speaker;
        this.message = message;
    }
    Fire() {
        this.gs.events.emit('textbox', this.speaker, this.message);
    }
    update(dt:number) {
        this.delay -= dt;
        // if(!this.gs.tb.visible || this.delay <= 0)
            // this.parent.Next(); 
    }
}

class WaitElement {
    gs:GameScene;
    parent!:Cutscene;
    delay:number = 100000;
    speaker:any;
    message:string = "";
    constructor(gs:GameScene, delay:number) {
        this.gs = gs;
        this.delay = delay;
    }
    Fire() {
    }
    update(dt:number) {
        this.delay -= dt;
        if(this.delay <= 0)
            this.parent.Next(); 
    }
}