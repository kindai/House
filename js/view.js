/**
 * Created by kin on 1/6/14.
 */
//
//var mSignals={
//    objectSelected: new signals.Signal(),
//    objectChange: new signals.Signal(),
//    objectAdd: new signals.Signal(),
//
//    rerender: new signals.Signal()
//}

var View = function(){
    var me = this;
    var camera, renderer, projector, sceneHelpers;
    var selectedBox, selected, transformControl, controls;
    var ray;
    var objects = [];
    this.mSignals={
        objectSelected: new signals.Signal(),
        objectChange: new signals.Signal(),
        objectAdd: new signals.Signal(),

        rerender: new signals.Signal()
    }

    this.scene = new THREE.Scene();
    sceneHelpers = new THREE.Scene();

    var ambientLight = new THREE.AmbientLight(0xffffff);

    this.scene.add( ambientLight );

//    sceneHelpers.add(new THREE.PointLightHelper(directionalLight, 10));

    camera = new THREE.OrthographicCamera(-$('.middle').width()/2-200, $('.middle').width()/2+200,
        $('.middle').height()/2+300, -$('.middle').height()/2-100,
        - 10000, 10000);
    camera.position.set( 1, 1, 1 );

    renderer = new THREE.WebGLRenderer();
    renderer.setSize($('.middle').width(), $('.middle').height());
    renderer.autoClear = false;
    renderer.autoUpdateScene = false;
    renderer.setClearColor(0xaaaaaa);

    projector = new THREE.Projector();

    ray = new THREE.Raycaster();

    var onMouseDownPosition = new THREE.Vector2();
    var onMouseUpPosition = new THREE.Vector2();

    $('body .middle').append(renderer.domElement);

    selectedBox = new THREE.BoxHelper;
    selectedBox.material.depthTest = false;
    selectedBox.material.transparent = true;
    selectedBox.visible = false;
    sceneHelpers.add(selectedBox)

//    var grid = new THREE.GridHelper( 1000, 100 );
//    grid.setColors( 0x444444, 0x888888 );
//    sceneHelpers.add( grid );

    transformControl = new THREE.TransformControls(camera, renderer.domElement);
    transformControl.addEventListener( 'change', function () {

        controls.enabled = true;

        if ( transformControl.axis !== undefined ) {

            controls.enabled = false;

        }
        if ( selected !== null ) {

            this.mSignals.objectSelected.dispatch( selected );

        }

    } );

    controls = new THREE.EditorControls( camera, renderer.domElement );
    controls.center = camera.target;
    controls.addEventListener( 'change', function () {

        transformControl.update();

    } );

    sceneHelpers.add(transformControl);

    render();

    var getIntersects = function ( event, object ) {

        var rect = renderer.domElement.getBoundingClientRect();
        x = ( event.clientX - rect.left ) / rect.width;
        y = ( event.clientY - rect.top ) / rect.height;
        var vector = new THREE.Vector3( ( x ) * 2 - 1, - ( y ) * 2 + 1, 0.5 );

        projector.unprojectVector( vector, camera );

        ray.set( camera.position, vector.sub( camera.position ).normalize() );

        if ( object instanceof Array ) {

            return ray.intersectObjects( object );

        }

        return ray.intersectObject( object );

    };

    var onMouseDown = function ( event ) {

        event.preventDefault();

        var rect = renderer.domElement.getBoundingClientRect();
        x = (event.clientX - rect.left) / rect.width;
        y = (event.clientY - rect.top) / rect.height;
        onMouseDownPosition.set( x, y );

        document.addEventListener( 'mouseup', onMouseUp, false );

    };

    var onMouseUp = function ( event ) {

        var rect = renderer.domElement.getBoundingClientRect();
        x = (event.clientX - rect.left) / rect.width;
        y = (event.clientY - rect.top) / rect.height;
        onMouseUpPosition.set( x, y );

        if ( onMouseDownPosition.distanceTo( onMouseUpPosition ) == 0 ) {

            var intersects = getIntersects( event, objects );

            if ( intersects.length > 0 ) {

                var object = intersects[ 0 ].object;

                if ( object.userData.object !== undefined ) {

                    // helper

                    select(object.userData.object);

                } else {

                    select(object);

                }

            }

            render();
        }

        document.removeEventListener( 'mouseup', onMouseUp );

    };

    renderer.domElement.addEventListener( 'mousedown', onMouseDown, false );

    function render() {
        requestAnimationFrame(render);
        camera.lookAt( me.scene.position );
        renderer.clear();
        renderer.render(me.scene, camera);
        renderer.render(sceneHelpers, camera);

    }

    function select( object ){
        me.selected = object;
        me.mSignals.objectChange.dispatch( object );
    }

    this.mSignals.objectChange.add( function( object ){

        selectedBox.visible = false;
        transformControl.detach();

        if ( object !== null ) {

            if ( object.geometry !== undefined ) {

                selectedBox.update( object );
                selectedBox.visible = true;

            }

            if ( object instanceof THREE.PerspectiveCamera === false ) {

                transformControl.attach( object );

            }

        }

        render();

    })

    this.mSignals.objectAdd.add( function( object ){
        me.scene.add(object);
        objects.push(object);
    })

    this.mSignals.rerender.add(function(){
        render();
    })

}

View.prototype = {
    setScene: function ( scene ) {

        this.scene.name = scene.name;
        this.scene.userData = JSON.parse( JSON.stringify( scene.userData ) );

        while ( scene.children.length > 0 ) {

            this.mSignals.objectAdd.dispatch( scene.children[ 0 ] );

        }

        this.mSignals.rerender.dispatch();

    },

    addObject: function ( object ) {

        this.mSignals.objectAdd.dispatch(object);
        this.mSignals.rerender.dispatch();

    }
}

function onWindowResize() {

    camera.aspect = $('canvas').width()/$('canvas').height();
    camera.updateProjectionMatrix();

    renderer.setSize( $('canvas').width(), $('canvas').height() );

}

$('window').resize(onWindowResize);