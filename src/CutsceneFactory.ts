import { Cutscene } from "./Cutscene";

export class CutsceneFactory {
    static GetCutscene(flag:string, scene:Phaser.Scene):Cutscene {
        let c:Cutscene;
        switch (flag) {
            default:
                c = new Cutscene(scene);
                break;
        }
        return c;
    }
}
