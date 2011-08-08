/* Copyright (c) 2011 by MapQuery Contributors (see AUTHORS for
 * full list of contributors). Published under the MIT license.
 * See https://github.com/mapquery/mapquery/blob/master/LICENSE for the
 * full text of the license. */

(function($) {
$.template('mqCommodityView',
    '<div class="ui-dialog-content ui-widget-content">'+
    '<div id="c${id}"></div>'+
    '<div id="d${id}"></div>'+
    '<div id="u${id}"></div>'+
    '</div>');

$.widget("mapQuery.mqCommodityView", {
    options: {
        // The MapQuery instance
        map: undefined

        // The number of decimals for the coordinates
        // default: 2
  

    },
    _create: function() {
        var map;
        var self = this;
        var element = this.element;
        var mousepos;

        //get the mapquery object
        map = $(this.options.map).data('mapQuery');

        map.bind("mqAddCommodity",
            {widget:self,map:map},
            self._onCommodityAdd);
       
        this.element.addClass(' ui-widget ui-helper-clearfix ui-dialog ' +
                                 'ui-corner-all');
    },
    _destroy: function() {
        this.element.removeClass(' ui-widget ui-helper-clearfix ui-dialog ' +
                                 'ui-corner-all')
            .empty();
    },
    
    _commodityAdded: function(widget, commodity) {
        
        $.tmpl('mqCommodityView',{
        id: commodity.id
       
        }).dialog({ title: commodity.options.name});
        this._createPie(commodity.options,commodity.id);
        
    },
    
    _createPie: function(data,id) {
        if (data.countries) {            
            var rc = Raphael("c"+id, 280, 140);
            var rcvalue =[];
            var rclabel = [];
            for(i=0;i<data.countries.length;i++){
                rclabel[i] = data.countries[i].name;
                rcvalue[i] = parseFloat(data.countries[i].percentage);
            }
            var piec = rc.g.piechart(60,70,50, rcvalue, {legend:rclabel});
            piec.hover(function () {
                    this.sector.stop();
                    this.sector.scale(1.1, 1.1, this.cx, this.cy);
                    if (this.label) {
                        this.label[0].stop();
                        this.label[0].scale(1.5);
                        this.label[1].attr({"font-weight": 800});
                    }
                }, function () {
                    this.sector.animate({scale: [1, 1, this.cx, this.cy]}, 500, "bounce");
                    if (this.label) {
                        this.label[0].animate({scale: 1}, 500, "bounce");
                        this.label[1].attr({"font-weight": 400});
                    }
                });
        };
        if (data.deposits) {
            var rd = Raphael("d"+id, 280, 140);
            var rdvalue =[];
            var rdlabel = [];
            for(i=0;i<data.deposits.length;i++){
                rdlabel[i] = data.deposits[i].name;
                rdvalue[i] = parseFloat(data.deposits[i].percentage);
            }
            var pied = rd.g.piechart(60,70,50, rdvalue, {legend:rdlabel});
            pied.hover(function () {
                    this.sector.stop();
                    this.sector.scale(1.1, 1.1, this.cx, this.cy);
                    if (this.label) {
                        this.label[0].stop();
                        this.label[0].scale(1.5);
                        this.label[1].attr({"font-weight": 800});
                    }
                }, function () {
                    this.sector.animate({scale: [1, 1, this.cx, this.cy]}, 500, "bounce");
                    if (this.label) {
                        this.label[0].animate({scale: 1}, 500, "bounce");
                        this.label[1].attr({"font-weight": 400});
                    }
                });
        };
        if (data.classifications) {
            var ru = Raphael("u"+id, 280, 140);
            var ruvalue =[];
            var rulabel = [];
            for(i=0;i<data.classifications.length;i++){
                rulabel[i] = data.classifications[i].name;
                ruvalue[i] = parseFloat(data.classifications[i].percentage);
            }
            var pieu =ru.g.piechart(60,70,50, ruvalue, {legend:rulabel});
            pieu.hover(function () {
                    this.sector.stop();
                    this.sector.scale(1.1, 1.1, this.cx, this.cy);
                    if (this.label) {
                        this.label[0].stop();
                        this.label[0].scale(1.5);
                        this.label[1].attr({"font-weight": 800});
                    }
                }, function () {
                    this.sector.animate({scale: [1, 1, this.cx, this.cy]}, 500, "bounce");
                    if (this.label) {
                        this.label[0].animate({scale: 1}, 500, "bounce");
                        this.label[1].attr({"font-weight": 400});
                    }
                });
        };
        
    },
        
    _onCommodityAdd: function(evt, commodity) {
        evt.data.widget._commodityAdded(evt.data.widget,commodity);
    }
});
})(jQuery);
