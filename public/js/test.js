let game = new Phaser.Game(448, 496, Phaser.AUTO, 'phaser-example', {
    preload: preload,
    create: create
})

function preload() {
    // game.load.image('dot', 'assets/pacman/dot.png');
    game.load.tilemap('level_one', 'assets/tilemaps/maps/pacman-map.json', null, Phaser.Tilemap.TILED_JSON);
    game.load.image('pacman_tiles', 'assets/tilemaps/tiles/pacman-tiles.png');
}

let map;
let layer;
let cursors;

function create() {
    game.physics.startSystem(Phaser.Physics.ARCADE);
    map = game.add.tilemap('level_one');
    map.addTilesetImage('pacman-tiles', 'pacman_tiles'); // tied to json tileset's name
    layer = map.createLayer('tile_layer_one'); // tied to json layer's name
    // dots = add.physicsGroup();
    // map.createFromTiles(7, 14, 'dot', layer, null)
    // dots.setAll('x', 6, false, false, 1);
    // dots.setAll('y', 6, false, false, 1);
}
