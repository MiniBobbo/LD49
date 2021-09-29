import { IH } from "../IH/IH";
import { C } from "../C";
import { EnemyFactory } from "../EnemyFactory";
import { Entity } from "../entities/Entity";
import { DamageZone } from "../zones/DamageZone";
import { Player } from "../entities/Player";
import { LDtkMapPack, LdtkReader } from "../map/LDtkReader";
import { SetupMapHelper } from "../helpers/SetupMapHelper";

export class GameScene extends Phaser.Scene {
    e!:Player;
    ih!:IH;
    debugText!:Phaser.GameObjects.BitmapText;
    map!:Phaser.Tilemaps.Tilemap;
    maps!:LDtkMapPack;
    zones!:Array<Phaser.GameObjects.Zone>;
    collideMap!:Array<Phaser.GameObjects.GameObject>;
    enemies!:Array<Phaser.GameObjects.GameObject>;

    effects!:Phaser.GameObjects.Group;
    mg!:Phaser.Tilemaps.TilemapLayer;

    preload() {
        this.ih = new IH(this);

    }

    create() {
        let g = this.add.graphics();
        this.zones=[];
        this.collideMap=[];
        this.enemies = [];
        var r:LdtkReader = new LdtkReader(this,this.cache.json.get('level'));

        this.maps = r.CreateMap('Level_0', 'mapts');

        SetupMapHelper.SetupMap(this, this.maps);

        this.e = new Player(this, this.ih);
        this.e.sprite.setFrame("player_jumpdown_1");
        this.cameras.main.startFollow(this.e.sprite);
        // this.cameras.main.setBounds(0,0,belowLayer.width, belowLayer.height);
        // this.physics.add.collider(this.collideMap, belowLayer);
        // this.physics.add.overlap(this.e.sprite, this.zones, (sprite:Phaser.Physics.Arcade.Sprite, z:Phaser.GameObjects.Zone) => {
        //     z.emit('overlap', sprite);
            // console.log(`Hit zone ${z.name}`);
        // });

        this.physics.add.overlap(this.e.sprite, this.enemies, (p:any, e:any) => {
            e.emit('hitplayer', p);
        }); 

        this.effects = this.add.group({
            classType:Phaser.GameObjects.Sprite
        });
        
        // let prop = this.map.properties as Array<{name:string, type:string, value:any}>;
        // let ambient = prop.find((e:any) =>{return e.name == 'ambient'});

        this.debugText = this.add.bitmapText(2,22, '6px', '')
        .setScrollFactor(0,0);


        // let hb = new HealthBar(this);
        // hb.setDepth(100);

        this.events.on('effect', this.Effect, this);
        this.e.sprite.on('dead', this.PlayerDied, this);
        this.events.on('shutdown', this.ShutDown, this);
        // this.events.on('debug', (message:string) => {this.debugText.text += message + '\n';}, this);
        this.events.on('travel', () => { this.e.fsm.clearModule(); this.cameras.main.fadeOut(200, 0,0,0,(cam:any, progress:number) => { if(progress == 1) this.scene.restart();}); }, this);
        this.input.on('pointerup', (pointer:any) => {
            },this);
        // this.CreateZones();

        // if(C.previouslevel == 'checkpoint') {
        //     let c:any = this.map.objects[0].objects.find((o)=> {return o.name == 'checkpoint';});
        //     c.y -= 16;
        //     this.e.sprite.setPosition(c.x,c.y);
        // } else {
        //     let c:any = this.map.objects[0].objects.find((o)=> {return o.name == 'd' && o.type == C.previouslevel;});
        //     // c.y -= 16;
        //     this.e.sprite.setPosition(c.x,c.y);

        // }

        this.cameras.main.setRoundPixels(true);
        this.cameras.main.fadeIn(300);
        }

    /**
     * remove the listeners of all the events creted in create() or they will fire multiple times.  
     */
    ShutDown() {
        this.events.removeListener('shutdown');
        this.events.removeListener('debug');
        this.events.removeListener('travel');
        this.events.removeListener('effect');
        this.events.removeListener('pointerup');
    }

    Effect(data:{name:string, x:number, y:number}) {
        let e:Phaser.GameObjects.Sprite = this.effects.getFirstDead(true, 100,100,'atlas');
        e.setActive(true);
        e.setDepth(55);
        e.visible = true;
        switch (data.name) {
            default:
                break;
        }

    }

    update(time:number, dt:number) {
        this.debugText.text = '';
        this.ih.update();

        if(this.ih.IsJustPressed('event')) {
            // this.events.emit('unlock');
        }

        // if(this.ih.IsJustPressed('attack')) {
        //     let a = this.GetPlayerAttack();
        //     a.LaunchMeleeAttack(this.p, {x:12,y:0}, 'snake_move');
        // }
        // this.p.fsm.update(time, dt);
        this.events.emit('debug', `Effects: ${this.effects.getLength()}`);
        this.events.emit('debug', `P loc: ${Math.floor(this.e.sprite.body.x)},  ${Math.floor(this.e.sprite.body.y)}`);
        this.events.emit('debug', `Mouse loc: ${Math.floor(this.input.mousePointer.worldX)},  ${Math.floor(this.input.mousePointer.worldY)}`);

    }

    CreateZones() {
        this.map.objects[0].objects.forEach((o)=> {
            switch (o.name) {
                case 'damage':
                    let dz = new DamageZone(this, o);
                    this.zones.push(dz);
                    break;
                case 'enemy':
                    EnemyFactory.CreateEnemy(this, this.ih, o);
                break;
                default:
                    break;
            }
        });
    }

    GetEnemyAttack():any {
        // let a = this.enemyAttacks.find( (a:BaseAttack) => { return a.sprite.body.enable === false;})
        // if(a===undefined) {
        //     a = new BaseAttack(this);
        //     this.enemyAttacks.push(a);
        // }
        // return a;
    }
        
    GetPlayerAttack(type:string):any {
        // let a = this.playerAttacks.find( (a:Phaser.Physics.Arcade.Sprite) => { return a.body.enable === false && a.name === type;})
        // if(a===undefined) {
        //     a = new BaseAttack(this);
        //     this.playerAttacks.push(a);
        //     this.playerAttackSprites.push(a.sprite)
        // }
        // return a;
    }

    PlayerDied() {

    }
        
}