import { forEachLeadingCommentRange } from "typescript";
import { C } from "../C";
import { Player } from "../entities/Player";
import { EntityInstance, LDtkMapPack } from "../map/LDtkReader";
import { GameScene } from "../scenes/GameScene";

export class SetupMapHelper {
    
    static SetupMap(gs:GameScene, maps:LDtkMapPack) {
        gs.collideMap=[];

        gs.maps.displayLayers.find((l:Phaser.Tilemaps.TilemapLayer) => {
            if(l.name == 'Bg')
                l.setDepth(0);
            if(l.name == 'Mg')
                l.setDepth(100);
            if(l.name == 'Fg')
                l.setDepth(200);
        });

        //TODO:  Set collision logic here.
        maps.collideLayer.setCollision([1,3]);

        //TODO: Set lighting here if needed.
        // gs.lights.enable();
        // let amb = maps.settings[0];
        // let amb = maps.settings.find((i:FieldInstance) => {i.__identifier === 'Ambient'} );
        // gs.lights.setAmbientColor(Number(amb.__value));

        // gs.maps.displayLayers.forEach(element => {
        //     element.setPipeline('Light2D');
        // });

        //TODO:  Set camera bounds here.
        // gs.cameras.main.setBounds(0,0, maps.collideLayer.width, maps.collideLayer.height);


        this.CreatePlayer(gs,maps);
        this.CreateEntities(gs, maps);
        this.CreatePhysics(gs,maps);


    }
    static CreateEntities(gs: GameScene, maps: LDtkMapPack) {
        maps.entityLayers.entityInstances.forEach(element => {
            switch (element.__identifier) {
                //TODO : Initialize entity instances here.
                //@ts-ignore
                // case 'Block':
                //     new Blocker(gs, gs.ih, element);
                // break;
                default:
                    break;
            }
        });

    }

    static CreatePlayer(gs:GameScene, maps:LDtkMapPack) {
        let StartLocation = maps.entityLayers.entityInstances.find((i:EntityInstance) =>  i.__identifier === 'Start');
        //TODO: Add player logic here.
    }

    static CreatePhysics(gs:GameScene, maps:LDtkMapPack) {
        gs.physics.add.collider(gs.collideMap, maps.collideLayer);

        let dl = maps.displayLayers.find((t:Phaser.Tilemaps.TilemapLayer) => t.name == 'Fg');
        // let tiles = dl.getTilesWithin(0,0,dl.width, dl.height);
        // tiles.forEach(element => {
        //     //TODO: Add tile logic here.
        //     // if(element.index == 50) {
        //     //     let dz = gs.add.zone(element.pixelX + 5, element.pixelY + 8, 7, 4);
        //     //     gs.physics.world.enable(dz);
        //     //     gs.deathZones.push(dz);
        //     // }
        // });

        //TODO: Add overlap logic here.
        // gs.physics.add.overlap(gs.player.sprite, gs.soakZones , () => { if(gs.player.holdingLight) gs.events.emit('flameoff');});



    }


}