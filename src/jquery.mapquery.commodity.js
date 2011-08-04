/* Copyright (c) 2011 by MapQuery Contributors (see AUTHORS for
 * full list of contributors). Published under the MIT license.
 * See https://github.com/mapquery/mapquery/blob/master/LICENSE for the
 * full text of the license. */


(function($, MQ) {

$.extend(MQ.Map.prototype, {

    //get/set the commodities object
    commodities: function(options) {
        //get the legend object
        var self = this;
        switch(arguments.length) {
        case 0:
            return this._allCommodities();
        case 1:
            if (!$.isArray(options)) {
                return this._addCommodity(options);
            }
            else {
                return $.map(options, function(commodity) {
                    return self._addCommodity(commodity);
                });
            }
            break;
        default:
            throw('wrong argument number');
        }
    },
    //Check if the layer has a maximum box set and if the current box
    //is outside these settings, set the legend.msg accordingly
    _allCommodities: function() {
        var commodities = [];
        $.each(this.commodityList, function(id, commodity) {
            var item = [commodity.position(), commodity];
            commoditys.push(item);
        });
        var sorted = commodity.sort( function compare(a, b) {
            return a[0] - b[0];
        });
        var result = $.map(sorted, function(item) {
            return item[1];
        });
        return result.reverse();
    },
    //Check if the layer has a minimum or maximum zoom set and if the
    //current zoom is outside these settings, set the legend.msg accordingly
    _addCommodity: function(options) {
        if(!this.commoditysList) {this.commoditysList =[]}
        var id = this._createcId();
        var commodity = new $.MapQuery.Commodity(this, id, options);
        this.commoditysList[id] = commodity;
        this.events.trigger('mqAddCommodity',commodity);
        return commodity;
    },
    _createcId: function() {
        if(!this.idcCounter) { this.idcCounter = 0}
        return 'commodity' + this.idcCounter++;
    },
    _removeCommodity: function(id) {
        this.events.trigger('mqRemoveCommodity',id);
        delete this.commoditysList[id];
        return this;
    }
});
$.MapQuery.Commodity = function(map, id, options) {
    var self = this;
    // apply default options that are not specific to a layer

    this.id = id;
        // a reference to the map object is needed as it stores e.g. the list
    // of all layers (and we need to keep track of it, if we delete a
    // layer)
    this.map = map;
    this.options = options;
};
})(jQuery, $.MapQuery);
