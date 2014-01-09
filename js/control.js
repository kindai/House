/**
 * Created by kin on 1/6/14.
 */

function addWall(w, h, t, c){
    var geometry = new THREE.CubeGeometry(w,h,t);
    var material = new THREE.MeshBasicMaterial( { color: c } );
    var cube = new THREE.Mesh( geometry, material );
    scene.add( cube );
    objects.push(cube);
    render();
}