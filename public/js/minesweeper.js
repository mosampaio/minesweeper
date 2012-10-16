var fnCreateCanvas = function() {
    var stage = new Kinetic.Stage({
        container: "canvas_container",
        width: 512,
        height: 512
    });

    var layer = new Kinetic.Layer();
    var lado = 32;
    var mapa = new Array(16);
    for (var i=0; i<16;i++) {
        mapa[i] = new Array(16);
        for (var j=0; j<16;j++) {
            var rect = new Kinetic.Rect({
                x: i*lado,
                y: j*lado,
                width: 31,
                height: 31,
                fill: "gray",
                stroke: "black",
                strokeWidth: 1,

                i: i,
                j: j,
                clicked: false,
                hasBomb: false,
                bombsAround: null
            });
            rect.on('click', function(evt) {
                ev_canvas(evt);
                if (!this.clicked) {
                    var i = Math.floor(evt._x/lado);
                    var j = Math.floor(evt._y/lado);
                    console.log('i:'+i+' j:'+j);
                    this.clicked = true;
                }
            });
            mapa[i][j] = rect;
            // add the shape to the layer
            layer.add(rect);
        }
    }
    // add the layer to the stage
    stage.add(layer);
}
function ev_canvas (ev) {
    if (ev.layerX || ev.layerX == 0) { // Firefox
        ev._x = ev.layerX;
        ev._y = ev.layerY;
    } else if (ev.offsetX || ev.offsetX == 0) { // Opera
        ev._x = ev.offsetX;
        ev._y = ev.offsetY;
    }
}