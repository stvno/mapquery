/*
 * Overviewmap unit tests
 */
(function($) {
module('mouseposition');

test("Mouseposition is shown", 1, function() {
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
    var mouseposition = $('#mouseposition').mqMousePosition({map:'#map1'});
    equals($('#mouseposition').find('#mq-mouseposition-x').length, 1, 'mouseposition contains a x-position field');
<<<<<<< HEAD
    
=======

>>>>>>> upstream/master
    mq.destroy();
    mouseposition.empty();
});

//TODO: add tests for moving the mouse

})(jQuery);
