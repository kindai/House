/**
 * Created by kin on 1/7/14.
 */

var Menu = function(ele){
    this.menus = {
        "Wall Style":"wall-style",
        "Ground Style Brick":"ground-style-phong",
        "Ground Style Wood":"ground-style-lambert"
    }

    jQuery.each(this.menus, function(key, val){
        var header = document.createElement('h3');
        header.innerHTML = key;
        var content = document.createElement('div')
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

$(".wall-paper").click(function(){
    house.setWallStyle($(this).attr('src'));
})