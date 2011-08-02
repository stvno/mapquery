/*
 * Layermanager unit tests
 */
(function($) {
module('layermanager');

test("LayerManager is shown", 1, function() {
    var map = $('#map1').mapQuery({
        layers:[{
<<<<<<< HEAD
            type:'osm' 
=======
            type:'osm'
>>>>>>> upstream/master
        }]
    });
    var mq = map.data('mapQuery');
    var layermanager = $('#layermanager').mqLayerManager({map:'#map1'});
    equals($('#layermanager').find('.mq-layermanager').length, 1, 'layermanager contains mq-layermanager');
<<<<<<< HEAD
    
=======

>>>>>>> upstream/master
    mq.destroy();
    layermanager.empty();

});
//TODO: add tests for: opacity, visibility, layer-order, removing layers, adding layers

})(jQuery);
