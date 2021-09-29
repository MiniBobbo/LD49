export class Effects {
    s:Phaser.Scene;
    effects:Phaser.GameObjects.Group;
    constructor(s:Phaser.Scene) {
        this.s = s;
        this.effects = s.add.group({
            classType:Phaser.GameObjects.Sprite
        });


    }

    Effect(effect:EFFECT, x:number, y:number) {
        let e:Phaser.GameObjects.Sprite = this.effects.getFirstDead(true, 100,100,'atlas');
        e.setActive(true);
        e.setDepth(155);
        e.visible = true;
        e.setPipeline('Light2D');

        e.play(effect).setPosition(x, y);
        e.once('animationcomplete', () => {e.setActive(false).setVisible(false);}, this);
    }


}

export enum EFFECT {
    LAND = 'landpoof',
    BOLTHIT = 'bolthit',
    FOOTSTEP = 'footstep',
    FLAMEHIT = 'flamehit',
}