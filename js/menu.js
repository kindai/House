/**
 * Created by kin on 1/7/14.
 */

var Menu = function(ele, editor){

    this.loader = new Loader(editor);
    this.editor = editor;

    this.menus = {
        "Wall Style":"wall-style",
        "Ground Style Brick":"ground-style-phong",
        "Ground Style Wood":"ground-style-lambert",
        "Save/Load":"save-load"
    }

    jQuery.each(this.menus, function(key, val){
        var header = document.createElement('h3');
        header.innerHTML = key;
        var content = document.createElement('div');
        ele.append(header, content);
    })

    $( ele ).accordion({
        activate: function( event, ui ) {
            if(ui.newHeader)
                $('#'+menu.menus[ui.newHeader.text()]).show();
            if(ui.oldHeader)
                $('#'+menu.menus[ui.oldHeader.text()]).hide();
        }
    });
}

Menu.prototype = {
    exportScene : function ( ) {

        var exporter = new THREE.SceneExporter();

        var output = JSON.stringify( exporter.parse( this.editor.scene ), null, '\t' );
        output = output.replace( /[\n\t]+([\d\.e\-\[\]]+)/g, '$1' );

        var blob = new Blob( [ output ], { type: 'text/plain' } );
        var objectURL = URL.createObjectURL( blob );

        window.open( objectURL, '_blank' );
        window.focus();

    },

    load : function( file ){
        this.loader.loadFile( file );
    }

}

$(".wall-paper").click(function(){
    house.setWallStyle($(this).attr('src'));
})