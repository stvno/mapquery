/* Copyright (c) 2011 by MapQuery Contributors (see AUTHORS for
 * full list of contributors). Published under the MIT license.
 * See https://github.com/mapquery/mapquery/blob/master/LICENSE for the
 * full text of the license. */


(function($) {
$.template('mqCommodityManager',
    '<div class="mq-commoditymanager ui-widget-content  ">'+
    '</div>');

$.template('mqCommodityManagerElement',
    '<div class="mq-commoditymanager-element ui-widget-content ui-corner-all" id="mq-commoditymanager-element-${id}">'+
    '<div class="mq-commoditymanager-element-header ui-dialog-titlebar ui-widget-header ui-corner-all ui-helper-clearfix">'+
    '<span class="mq-commoditymanager-label ui-dialog-title">${label}</span>'+
    '<a class="ui-dialog-titlebar-close ui-corner-all" href="#" role="button">'+
    '<span class="ui-icon ui-icon-closethick">close</span></a></div>'+
    '<div class="mq-commoditymanager-element-content">'+
        '<div class="mq-commoditymanager-element-visibility">'+
            '<input type="checkbox" class="mq-commoditymanager-element-vischeckbox" id="${id}-visibility" {{if visible}}checked="${visible}"{{/if}} />'+
            '<div class="mq-commoditymanager-element-slider-container">'+
        '<div class="mq-commoditymanager-element-slider"></div></div>'+
        '</div>'+
        '<div class="mq-commoditymanager-element-legend">'+
            '{{if imgUrl}}'+
                '<img src="${imgUrl}" style="opacity:${opacity}"/>'+
            '{{/if}}'+
            '{{if errMsg}}'+
                '${errMsg}'+
            '{{/if}}'+
        '</div>'+
    '</div>'+
    '</div>');

$.widget("mapQuery.mqCommodityManager", {
    options: {
        // The MapQuery instance
        map: undefined,

        // Title that will be displayed at the top of the popup
        title: "Commodity Manager"
    },
    _create: function() {
        var map;
        var zoom;
        var numzoomlevels;
        var self = this;
        var element = this.element;

        //get the mapquery object
        map = $(this.options.map).data('mapQuery');

        this.element.addClass('ui-widget  ui-helper-clearfix ' +
                              'ui-corner-all');

        var lmElement = $.tmpl('mqCommodityManager').appendTo(element);
        element.find('.ui-icon-closethick').button();

        lmElement.sortable({
            axis:'y',
            handle: '.mq-commoditymanager-element-header',
            update: function(event, ui) {
                var commodityNodes = ui.item.siblings().andSelf();
                var num = commodityNodes.length-1;
                commodityNodes.each(function(i) {
                    var commodity = $(this).data('commodity');
                    var pos = num-i;
                    self._position(commodity, pos);
                });
            }
        });
        
        //these commodities are already added to the map as such won't trigger 
    //and event, we call the draw function directly
        $.each(map.commodities().reverse(), function(){
           self._commodityAdded(lmElement, this);
        });

        element.delegate('.mq-commoditymanager-element-vischeckbox',
            'change',function() {
            var checkbox = $(this);
            var element = checkbox.parents('.mq-commoditymanager-element');
            var commodity = element.data('commodity');
            var self = element.data('self');
            self._visible(commodity,checkbox.attr('checked'));
         });

        element.delegate('.ui-icon-closethick', 'click', function() {
            var control = $(this).parents('.mq-commoditymanager-element');
            self._remove(control.data('commodity'));
        });

        //binding events
        map.bind("mqAddCommodity",
            {widget:self,control:lmElement},
            self._onCommodityAdd);

        map.bind("mqRemoveCommodity",
            {widget:self,control:lmElement},
            self._onCommodityRemove);

    },
    _destroy: function() {
        this.element.removeClass(' ui-widget ui-helper-clearfix ' +
                                 'ui-corner-all')
            .empty();
    },
    //functions that actually change things on the map
    //call these from within the widget to do stuff on the map
    //their actions will trigger events on the map and in return
    //will trigger the _commodity* functions
    _add: function(map,commodity) {
        map.commodities(commodity);
    },

    _remove: function(commodity) {
        commodity.remove();
    },

    _position: function(commodity, pos) {
        commodity.position(pos);
    },

    _visible: function(commodity, vis) {
        commodity.visible(vis);
    },

    _opacity: function(commodity,opac) {
        commodity.opacity(opac);
    },

    //functions that change the widget
    _commodityAdded: function(widget, commodity) {
    /*    var self = this;
        var error = commodity.legend().msg;
        var url;
        switch(error){
            case '':
                url =commodity.legend().url;
                if(url==''){error='No legend for this commodity';}
                break;
            case 'E_ZOOMOUT':
                error = 'Please zoom out to see this commodity';
                break;
            case 'E_ZOOMIN':
                error = 'Please zoom in to see this commodity';
                break;
            case 'E_OUTSIDEBOX':
                error = 'This commodity is outside the current view';
                break;
        }

        var commodityElement = $.tmpl('mqommodityManagerElement',{
            id: commodity.id,
            label: commodity.label,
            position: commodity.position(),
            visible: commodity.visible(),
            imgUrl: url,
            opacity: commodity.visible()?commodity.opacity():0,
            errMsg: error
        })
            // save commodity commodity in the DOM, so we can easily
            // hide/show/delete the commodity with live events
            .data('commodity', commodity)
            .data('self',self)
            .prependTo(widget);

       $(".mq-commoditymanager-element-slider", commodityElement).slider({
           max: 100,
           step: 1,
           value: commodity.visible()?commodity.opacity()*100:0,
           slide: function(event, ui) {
               var commodity = commodityElement.data('commodity');
               var self =  commodityElement.data('self');
               self._opacity(commodity,ui.value/100);
           },
           //using the slide event to check for the checkbox often gives errors.
           change: function(event, ui) {
               var commodity = commodityElement.data('commodity');
               var self =  commodityElement.data('self');
               if(ui.value>=0.01) {
                   if(!commodity.visible()){commodity.visible(true);}
               }
               if(ui.value<0.01) {
                   if(commodity.visible()){commodity.visible(false);}
               }
           }
       });*/
    },

    _commodityRemoved: function(widget, id) {
        var control = $("#mq-commoditymanager-element-"+id);
        control.fadeOut(function() {
            $(this).remove();
        });
    },

    _commodityPosition: function(widget, commodity) {
       /* var commodityNodes = widget.element.find('.mq-commoditymanager-element');
        var num = commodityNodes.length-1;
        var tmpNodes = [];
        tmpNodes.length = commodityNodes.length;
        commodityNodes.each(function() {
            var commodity = $(this).data('commodity');
            var pos = num-commodity.position();
            tmpNodes[pos]= this;
        });
        for (i=0;i<tmpNodes.length;i++) {
            commodityNodes.parent().append(tmpNodes[i]);
        }*/
    },

    _commodityVisible: function(widget, commodity) {
     /*   var commodityElement =
        widget.element.find('#mq-commoditymanager-element-'+commodity.id);
        var checkbox =
        commodityElement.find('.mq-commoditymanager-element-vischeckbox');
        checkbox[0].checked = commodity.visible();
        //update the opacity slider as well
        var slider = commodityElement.find('.mq-commoditymanager-element-slider');
        var value = commodity.visible()?commodity.opacity()*100: 0;
        slider.slider('value',value);

        //update legend image
        commodityElement.find('.mq-commoditymanager-element-legend img').css(
            {visibility:commodity.visible()?true:'hidden'});*/
    },

    _commodityOpacity: function(widget, commodity) {
       /* var commodityElement = widget.element.find(
            '#mq-commoditymanager-element-'+commodity.id);
        var slider = commodityElement.find(
            '.mq-commoditymanager-element-slider');
        slider.slider('value',commodity.opacity()*100);
        //update legend image
        commodityElement.find(
            '.mq-commoditymanager-element-legend img').css(
            {opacity:commodity.opacity()});*/
    },



    //functions bind to the map events
    _onCommodityAdd: function(evt, commodity) {
        evt.data.widget._commodityAdded(evt.data.control,commodity);
    },

    _onCommodityRemove: function(evt, id) {
        evt.data.widget._commodityRemoved(evt.data.control,id);
    },

    
});
})(jQuery);
