let game = new Phaser.Game(800, 600, Phaser.WEBGL, 'phaser-example', { preload: preload, create: create, update: update, render: render });

function preload() {

    game.load.tilemap('level3', 'assets/tilemaps/maps/cybernoid.json', null, Phaser.Tilemap.TILED_JSON);
    game.load.spritesheet('tiles', 'assets/tilemaps/tiles/cybernoid.png', 16, 16);
    game.load.image('phaser', 'assets/sprites/phaser-ship.png');
    game.load.image('chunk', 'assets/sprites/chunk.png');

}

let map;
let texture;
let stamp;
let tx = 0;
let ty = 0;
let cursors;
let sprite;
let emitter;

function create() {

    map = game.add.tilemap('level3');
    map.setCollisionByExclusion([7, 32, 35, 36, 47]);

    // setBounds(0, 0) --> demarcates the start of the map loaded
    game.world.setBounds(0, 0, map.widthInPixels, map.heightInPixels);

    stamp = game.add.sprite(0, 0, 'tiles', 3);

    texture = game.add.renderTexture(game.width, game.height);

    let rtMap = game.add.sprite(0, 0, texture);
    rtMap.fixedToCamera = true;

    cursors = game.input.keyboard.createCursorKeys();

    emitter = game.add.emitter(0, 0, 200);

    emitter.makeParticles('chunk');
    emitter.minRotation = 0;
    emitter.maxRotation = 0;
    emitter.gravity = 150;
    emitter.bounce.setTo(0.5, 0.5);

    sprite = game.add.sprite(300, 90, 'phaser');
    sprite.anchor.set(0.5);

    game.physics.enable(sprite);

    sprite.body.tilePadding.set(32, 32);

    game.camera.follow(sprite, Phaser.Camera.FOLLOW_LOCKON, 0.1, 0.1);

    renderMap();

}

function renderMap() {

    let cx = game.math.snapToFloor(game.camera.x, 16) / 16;
    let cy = game.math.snapToFloor(game.camera.y, 16) / 16;

    // console.log(game.camera.x, '=', cx, game.camera.y, '=', cy);

    let tile = null;
    //  800/16 = 50
    //  600/16 = 37.5
    let w = cx + 50;
    let h = cy + 38;
    let dx = 0;
    let dy = 0;
    let cls = true;

    for (let y = cy; y < h; y++)
    {
        for (let x = cx; x < w; x++)
        {
            tile = map.getTile(x, y);

            if (tile)
            {
                stamp.frame = tile.index - 1;
                texture.renderXY(stamp, dx, dy, cls);
                cls = false;
            }

            dx += 16;
        }
        
        dx = 0;
        dy += 16;
    }

    tx = game.camera.x;
    ty = game.camera.y;

}

function particleBurst() {

    emitter.x = sprite.x;
    emitter.y = sprite.y;
    emitter.start(true, 2000, null, 1);

}

function update() {

    if (game.camera.x !== tx || game.camera.y !== ty)
    {
        renderMap();
    }

    // game.physics.arcade.collide(sprite, layer);
    // game.physics.arcade.collide(emitter, layer);

    sprite.body.velocity.x = 0;
    sprite.body.velocity.y = 0;

    if (cursors.up.isDown)
    {
        sprite.body.velocity.y = -200;
        particleBurst();
    }
    else if (cursors.down.isDown)
    {
        sprite.body.velocity.y = 200;
        particleBurst();
    }

    if (cursors.left.isDown)
    {
        sprite.body.velocity.x = -200;
        sprite.scale.x = -1;
        particleBurst();
    }
    else if (cursors.right.isDown)
    {
        sprite.body.velocity.x = 200;
        sprite.scale.x = 1;
        particleBurst();
    }

}

function render() {

    // game.debug.text(game.camera.x, 32, 32);
    // game.debug.text(game.camera.y, 32, 64);

}