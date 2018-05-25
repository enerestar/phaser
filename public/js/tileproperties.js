
let game = new Phaser.Game(800, 600, Phaser.AUTO, 'phaser-example', { preload: preload, create: create, update: update, render: render });

function preload() {

    game.load.tilemap('level1', 'assets/tilemaps/maps/tile_properties.json', null, Phaser.Tilemap.TILED_JSON);
    game.load.image('test', 'assets/tilemaps/tiles/gridtiles.png');
    game.load.image('phaser', 'assets/sprites/phaser-ship.png');
}

let map;
let layer;
let marker;

let sprite;
let cursors;
// let safetile = 1;
let currentDataString;

function create() {

    game.physics.startSystem(Phaser.Physics.ARCADE);

    map = game.add.tilemap('level1');

    map.addTilesetImage('test'); // tied to json tileset's name

    layer = map.createLayer('Tile Layer 1'); // tied to json layer's name

    layer.resizeWorld();

    // setCollisionBetween: function (start, stop, collides, recalculateFaces, layer)
    // map.setCollisionByExclusion([safetile], true, this.layer)
    
    // this setting allows the sprite to go through all the tiles that has the special properties
    // map.setCollisionBetween(20, 25);
    
    // this gives the inverse of the maps path
    map.setCollisionBetween(20, 20);
    map.setCollisionBetween(73, 73);
    // map.setCollisionBetween(99, 112)


    //  Our painting marker
    marker = game.add.graphics();
    marker.lineStyle(2, 0xffffff, 1);
    marker.drawRect(0, 0, 32, 32);

    game.input.addMoveCallback(updateMarker, this);

    game.input.onDown.add(getTileProperties, this);
    sprite = game.add.sprite(300,90, 'phaser');
    sprite.anchor.set(6,3.5);
    // this 2 codes set the image moving in the x-axis
    game.physics.enable(sprite, Phaser.Physics.ARCADE);
    sprite.body.velocity.x=150
    // sprite.body.tilePadding.set(32,32);
    // game.camera.follow(sprite)
    cursors = game.input.keyboard.createCursorKeys();
}

function getTileProperties() {

    let x = layer.getTileX(game.input.activePointer.worldX);
    let y = layer.getTileY(game.input.activePointer.worldY);

    let tile = map.getTile(x, y, layer);
    
    // Note: JSON.stringify will convert the object tile properties to a string
    currentDataString = JSON.stringify( tile.properties );
    // currentDataString = "Tile at position " + ( (y * map.width) + (x+1) ) + " has an ID of " + tile.index + " -- x = " + x + " y = " + y + " -- "  + JSON.stringify( tile.properties ); 
    tile.properties.wibble = true;

}

function updateMarker() {

    marker.x = layer.getTileX(game.input.activePointer.worldX) * 32;
    marker.y = layer.getTileY(game.input.activePointer.worldY) * 32;

}

function update() {

    // console.log('sprite is? ' + sprite);
    
    // if (cursors.left.isDown)
    // {
    //     console.log('cursor left');
    //     sprite.body.velocity = -200;
    //     // game.physics.arcade.collide(sprite, layer);
    //     game.camera.x -= 4;
    // }
    // else if (cursors.right.isDown)
    // {
    //     console.log('cursor right');
    //     sprite.body.velocity = 200;
    //     // game.physics.arcade.collide(sprite, layer);
    //     game.camera.x += 4;
    // }

    // if (cursors.up.isDown)
    // {
    //     console.log('cursor up');
    //     sprite.body.velocity = -200;
    //     // game.physics.arcade.collide(sprite, layer);
    //     game.camera.y -= 4;
    // }
    // else if (cursors.down.isDown)
    // {
    //     console.log('cursor down');
    //     sprite.body.velocity = 200;
    //     // game.physics.arcade.collide(sprite, layer);
    //     game.camera.y += 4;
    // }

    // this code below allows the sprite to move according to cursor movement
    if(game.physics.arcade.distanceToPointer(sprite, game.input.activePointer) > 8) {
        game.physics.arcade.moveToPointer(sprite,300);
        console.log("sprite" + sprite);
        console.log("layer" + layer);
        game.physics.arcade.collide(sprite, layer);
    }
    else{
        sprite.body.velocity.set(0);
    }
}

function render() {

    if(currentDataString){
        game.debug.text('Tile properties: ' + currentDataString, 16, 550);
    } else {
        game.debug.text("Click on a tile to reveal the properties of the tile", 16, 550);
    }
}
