/**
 * Created by kin on 1/7/14.
 */

var House = function( view ){
    this.ground = null;
    this.ceiling = null;
    this.walls = {
        east: null,
        west: null,
        north: null,
        south: null
    };

    this.groundLongth = 1000;
    this.groundWidth = 1000;
    this.wallHeight = 275;
    this.wallThick = 15;
    this.groundThick = 20;
    this.ceilingThick = 20;

    var pointLight = new THREE.PointLight( /*Math.random() * */ 0xffffff, 0.5, this.groundLongth);

    pointLight.position.x = 0;
    pointLight.position.y = this.wallHeight;
    pointLight.position.z = 0;

    mSignals.objectAdd.dispatch(pointLight);

    this.ground = new THREE.Mesh(new THREE.CubeGeometry(this.groundWidth,this.groundThick,this.groundLongth),
        new THREE.MeshPhongMaterial({ ambient: 0xaaaaaa, color: 0xdddddd, specular: 0x999900, shininess: 30, shading: THREE.FlatShading }));

    var tex = THREE.ImageUtils.loadTexture('img/88.jpg');
    tex.wrapS = THREE.RepeatWrapping;
    tex.wrapT = THREE.RepeatWrapping;
    tex.repeat.set( 4*this.groundLongth/this.wallHeight, 4*this.groundLongth/this.wallHeight );
    this.setObjectTexture(tex, this.ground);

    mSignals.objectAdd.dispatch(this.ground);

    this.ceiling = new THREE.Mesh(new THREE.CubeGeometry(this.groundWidth,this.ceilingThick,this.groundLongth),
        new THREE.MeshLambertMaterial( { ambient: 0xeeeeee, color: 0x000000, shading: THREE.FlatShading }));

    this.ceiling.position.y = this.ground.position.y + this.wallHeight + this.groundThick/2 + this.ceilingThick/2;

    //mSignals.objectAdd.dispatch(this.ceiling);

    var materialWOT = new THREE.MeshLambertMaterial({ ambient: 0xdddddd, color: 0xffffff, shading: THREE.FlatShading });

    this.walls.east = new THREE.Mesh(new THREE.CubeGeometry(this.groundWidth,this.wallHeight,this.wallThick),
        materialWOT);

    this.walls.east.position.y = this.wallHeight/2 + this.groundThick/2;
    this.walls.east.position.z = this.groundWidth/2 - this.wallThick/2;

    this.walls.west = new THREE.Mesh(new THREE.CubeGeometry(this.groundWidth,this.wallHeight,this.wallThick),
        materialWOT);

    this.walls.west.position.y = this.wallHeight/2 + this.groundThick/2;
    this.walls.west.position.z = - this.groundWidth/2 + this.wallThick/2;

    this.walls.north = new THREE.Mesh(new THREE.CubeGeometry(this.wallThick,this.wallHeight,this.groundLongth),
        materialWOT);

    this.walls.north.position.y = this.wallHeight/2 + this.groundThick/2;
    this.walls.north.position.x = this.groundLongth/2 - this.wallThick/2;

    this.walls.south = new THREE.Mesh(new THREE.CubeGeometry(this.wallThick,this.wallHeight,this.groundLongth),
        materialWOT);

    this.walls.south.position.y = this.wallHeight/2 + this.groundThick/2;
    this.walls.south.position.x = -this.groundLongth/2 + this.wallThick/2;

//    mSignals.objectAdd.dispatch(this.walls.east);
    mSignals.objectAdd.dispatch(this.walls.west);
    mSignals.objectAdd.dispatch(this.walls.north);
    mSignals.objectAdd.dispatch(this.walls.south);


}

House.prototype.groundWidth = null;
House.prototype.groundLongth = null
House.prototype.wallHeight = null;

House.prototype.wallThick = null;
House.prototype.groundThick = null;
House.prototype.ceilingThick = null;


House.prototype = {
    setWallStyle: function( texturePath ){
        var texture = THREE.ImageUtils.loadTexture( texturePath );
        texture.wrapS = THREE.RepeatWrapping;
        texture.wrapT = THREE.RepeatWrapping;
        texture.repeat.set( 4*this.groundLongth/this.wallHeight, 4 );

        this.setObjectTexture(texture, this.walls.east);
        this.setObjectTexture(texture, this.walls.west);
        this.setObjectTexture(texture, this.walls.north);
        this.setObjectTexture(texture, this.walls.south);
    },

    setObjectTexture: function( texture, object){
        var geometry = object.geometry;
        var material = object.material;

        var objectHasUvs = false;

        objectHasUvs = ( object instanceof THREE.Sprite ) ||
            ( geometry instanceof THREE.Geometry && geometry.faceVertexUvs[ 0 ].length > 0 ) ||
            ( geometry instanceof THREE.BufferGeometry && geometry.attributes.uv !== undefined) ;

        if ( material.map !== undefined ) {

            if ( objectHasUvs )  {

                if ( geometry !== undefined ) {

                    geometry.buffersNeedUpdate = true;
                    geometry.uvsNeedUpdate = true;

                }

                material.map = texture;
                material.needsUpdate = true;

            } else {

                console.log('err: object has no texture UV coordinate defined');

            }

        }
    }
}