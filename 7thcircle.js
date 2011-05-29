/*globals Vector2D: false, Rect: false */
if (! Object.create) {
    Object.create = function (o) {
        var F = function (){};
        F.prototype = o;
        return new F();
    };
}

var World,
    GameEntity,
    Bullet,
    Dude,
    Baddy,
    Bonus;
(function () {
World = {
    context: document.getElementById('Display'),
    screen_area: new Rect(new Vector2D(0, 0), 320, 460),
    entities: [],
    bullets: [],
    MAX_BULLETS: 600,
    bullet_sprites: [],
    free_bullet_sprites: [],
    
    getSprite: function () {
        var element;
        if (this.bullet_sprites.length < this.MAX_BULLETS) {
            element = document.createElement("img");
            element.src = "img/bullet.png";
            element.width = 8;
            element.height = 8;
            element.style.position = "absolute";
            element.style.top = "-999px";
            element.style.left = "-999px";
            this.bullet_sprites.push(element);
            this.context.appendChild(element);
            return element;
        } else if (this.free_bullet_sprites.length > 0) {
            return this.free_bullet_sprites.pop(); 
        } else {
            return null;
        }
    }
};

var remove = function (object, array) {
    array.splice(array.indexOf(object), 1);
};

GameEntity = function (world, position, bounding_box, drawing_box) {
    this.position = position || this.position;
    this.bounding_box = bounding_box || this.bounding_box;
    this.drawing_box = drawing_box || this.drawing_box;

    if (world) {
        this.world = world;
        this.world.entities.push( this );
    }
};
GameEntity.instances = [];
GameEntity.prototype = { 
    kill: function (world) {
        remove(this, world.entities);
    }, 

    update: function (world) {
        //
    }
};

Bullet = function (world, position) {
    if ((this.sprite = world.getSprite())) {
        GameEntity.call(this, world, position); 
        world.bullets.push(this);  
    } else {
        return null;
    }
};
Bullet.prototype = Object.create( GameEntity );
Bullet.prototype.kill = function (world) {
    // hide the element
    this.sprite.style.top = "-999px";
    this.sprite.style.left = "-999px";
    // queue it up for reuse
    world.free_bullet_sprites.push(this.sprite);

    remove(this, world.bullets);
    GameEntity.prototype.kill.call(this, world);
};
Bullet.prototype.update = function (world) {
    this.position = this.position.plus( this.velocity );

    if (! world.screen_area.containsPoint(this.position)) {
        this.kill(world);
    }
};
Bullet.prototype.drawing_box = new Rect(new Vector2D(-4, -4), 8, 8);
Bullet.prototype.draw = function () {
    var topLeft = this.position.plus( this.drawing_box.origin );   
    this.sprite.style.top = Math.floor(topLeft.y) + 'px';
    this.sprite.style.left = Math.floor(topLeft.x) + 'px';
};

Baddy = function () { };

Baddy.prototype = Object.create( GameEntity );

Dude = function () {

};

Dude.prototype = Object.create( GameEntity );

}.call(null));
