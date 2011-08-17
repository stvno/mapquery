/* Copyright (c) 2011 by MapQuery Contributors (see AUTHORS for
 * full list of contributors). Published under the MIT license.
 * See https://github.com/mapquery/mapquery/blob/master/LICENSE for the
 * full text of the license. */


(function($) {
$.template('mqLayerJsonManager',
    '<div class="mq-layerjsonmanager ui-widget-content  ">'+
    '</div>');
    
$.template('mqCommodityPopup',
    '<div class="ui-dialog-content ui-widget-content" >'+
     '{{each(i, foo) group}}'+
      '<div id="${id}-${i}"></div>'+
     '{{/each}}'+    
    '</div>');
    
$.template('mqLayerJsonManagerElement',
    '<div class="mq-layerjsonmanager-element ui-widget-content ui-corner-all" id="mq-layerjsonmanager-element-${id}">'+
    '<div class="mq-layerjsonmanager-element-header ui-dialog-titlebar ui-widget-header ui-corner-all ui-helper-clearfix">'+
    '<span class="mq-layerjsonmanager-label ui-dialog-title">${label}</span>'+
    '<a class="ui-dialog-titlebar-close ui-corner-all" href="#" role="button">'+
    '<span class="ui-icon ui-icon-closethick">close</span></a></div>'+
    '<div class="mq-layerjsonmanager-element-content">'+
        '<div class="mq-layerjsonmanager-element-visibility">'+
            '<input type="checkbox" class="mq-layerjsonmanager-element-vischeckbox" id="${id}-visibility" {{if visible}}checked="${visible}"{{/if}} />'+
            '<div class="mq-layerjsonmanager-element-slider-container">'+
        '<div class="mq-layerjsonmanager-element-slider"></div></div>'+
        '</div>'+
        '<div class="mq-layerjsonmanager-element-legend">'+
            '{{if imgUrl}}'+
                '<img src="${imgUrl}" style="opacity:${opacity}"/>'+
            '{{/if}}'+
            '{{if errMsg}}'+
                '${errMsg}'+
            '{{/if}}'+
        '</div>'+
    '</div>'+
    '</div>');

$.template('mqLayerJsonManagerCommodity',
    '<div class=" mq-layerjsonmanager-element mq-layerjsonmanager-commodity ui-widget-content ui-corner-all" id="mq-layerjsonmanager-element-${id}">'+
    '<div class="mq-layerjsonmanager-element-header mq-layerjsonmanager-commodity-header ui-dialog-titlebar ui-widget-header ui-corner-all ui-helper-clearfix">'+
    '<span class="mq-layerjsonmanager-label ui-dialog-title close">${label}</span>'+
    '<a class="ui-dialog-titlebar-close ui-corner-all" href="#" role="button">'+
    '<span class="ui-icon ui-icon-closethick">close</span></a></div>'+
    '<div class="mq-layerjsonmanager-commodity-content">'+
        '<div class="mq-layerjsonmanager-commodity-visibility">'+
            '<input type="checkbox" class="mq-layerjsonmanager-commodity-vischeckbox" id="${id}-visibility" {{if visible}}checked="${visible}"{{/if}} />'+
            '<div class="mq-layerjsonmanager-commodity-slider-container">'+
        '<div class="mq-layerjsonmanager-commodity-slider"></div></div>'+
        '</div>'+
        '<div class="mq-layerjsonmanager-commodity-legend"><ul class="mq-group-ul">'+
            '{{each(i, foo) group}}'+
                '<li class="mq-group mq-group-${foo.title} open"><span class="${i}">${foo.title}</span>'+
                    '<ul class="mq-commodity-ul">{{each(j, bar) foo.data }}'+
                    '<li class="mq-commodity mq-commodity-${bar.name} layer-on">${bar.name}</li>'+
                       '{{/each}}</ul>'+
                '</li>'+
            '{{/each}}'+
        '</ul></div>'+
    '</div>'+
    '</div>');


$.widget("mapQuery.mqLayerJsonManager", {
    options: {
        // The MapQuery instance
        map: undefined,

        // Title that will be displayed at the top of the popup
        title: "Layer Manager"
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

        var lmElement = $.tmpl('mqLayerJsonManager').appendTo(element);
        element.find('.ui-icon-closethick').button();

        lmElement.sortable({
            axis:'y',
            handle: '.mq-layerjsonmanager-element-header',
            update: function(event, ui) {
                var layerNodes = ui.item.siblings().andSelf();
                var num = layerNodes.length-1;
                layerNodes.each(function(i) {
                    var layer = $(this).data('layer');
                    var pos = num-i;
                    self._position(layer, pos);
                });
            }
        });

        //these layers are already added to the map as such won't trigger 
    //and event, we call the draw function directly
        $.each(map.layers().reverse(), function(){
           self._layerAdded(lmElement, this);
        });

        element.delegate('.mq-layerjsonmanager-element-vischeckbox',
            'change',function() {
            var checkbox = $(this);
            var element = checkbox.parents('.mq-layerjsonmanager-element');
            var layer = element.data('layer');
            var self = element.data('self');
            self._visible(layer,checkbox.attr('checked'));
         });

        element.delegate('.ui-icon-closethick', 'click', function() {
            var control = $(this).parents('.mq-layerjsonmanager-element');
            self._remove(control.data('layer'));
        });
        
        element.delegate('.mq-commodity', 'click', function() {
            var checkbox = $(this);
            var group = checkbox.parents('li.mq-group').find('span').attr('class');
            var name = checkbox.text();
            var element = checkbox.parents('.mq-layerjsonmanager-commodity');
            var layer = element.data('layer');
            self._commodityClicked(layer,group,name);
            return false;
        });
        
        element.delegate('.mq-layerjsonmanager-label', 'click', function() {
            var header = $(this);
            var element = header.parents('.mq-layerjsonmanager-commodity');
            var layer = element.data('layer');
            var popup = '#com-svg-'+layer.id;
            $(popup).dialog('open');
        });
        
        element.delegate('.mq-group', 'click', function(){
            $(this).toggleClass('open');
            var group = $(this).find('.mq-commodity-ul');
            group.toggle('blind');
        });
        //binding events
        map.bind("mqAddLayer",
            {widget:self,control:lmElement},
            self._onLayerAdd);

        map.bind("mqRemoveLayer",
            {widget:self,control:lmElement},
            self._onLayerRemove);

        map.bind("changelayer",
            {widget:self,map:map,control:lmElement},
            self._onLayerChange);

        map.bind("moveend",
            {widget:self,map:map,control:lmElement},
            self._onMoveEnd);
    },
    _destroy: function() {
        this.element.removeClass(' ui-widget ui-helper-clearfix ' +
                                 'ui-corner-all')
            .empty();
    },
    //functions that actually change things on the map
    //call these from within the widget to do stuff on the map
    //their actions will trigger events on the map and in return
    //will trigger the _layer* functions
    _add: function(map,layer) {
        map.layers(layer);
    },

    _remove: function(layer) {
        layer.remove();
    },

    _position: function(layer, pos) {
        layer.position(pos);
    },

    _visible: function(layer, vis) {
        layer.visible(vis);
    },

    _opacity: function(layer,opac) {
        layer.opacity(opac);
    },
    _commodityClicked: function(layer,group,name,pie) {
        var names=[];
        if(pie) names= this._pieClick(layer,group,name);
        else names= this._checkBoxes(layer,group,name);
        var url = layer.options.url.split('&');
        
        url = url[0]+"&group="+layer.options.data.group[group].title+"&name="+names;
        layer.options.url=url;
        layer.olLayer.protocol.options.url=url;
        //layer.olLayer.strategies[0].layer.protocol.url="/2011/geometry2.json";
        //layer.olLayer.strategies[0].refresh();
        layer.olLayer.refresh({force:true});
    },
    _checkBoxes: function(layer,group,name) {
        var id = "#mq-layerjsonmanager-element-"+layer.id;
        var element = $(id);
        var groupul = element.find('.mq-group');
        var names=[];
        $.each(groupul, function(index) {
            if(group==index) {
                var groups = $(this).find('.mq-commodity');
                $.each(groups, function() {
                    var text = $(this).text();
                    if(text==name) {
                        $(this).toggleClass('li-layer').toggleClass('layer-on');
                    }
                    if($(this).hasClass('layer-on')) {
                        names.push($(this).text());
                    }
                })
               
            }
            else {
                $(this).find('.mq-commodity').addClass('li-layer').removeClass('layer-on');
            }
            
        })
        return names;
    },
    _pieClick: function(layer,group,name) {
        var id = "#mq-layerjsonmanager-element-"+layer.id;
        var element = $(id);
        var groupul = element.find('.mq-group');
        var names=[];
        $.each(groupul, function(index) {
            if(group==index) {
                var groups = $(this).find('.mq-commodity');
                $.each(groups, function() {
                    var text = $(this).text();
                    if(text==name) {
                        $(this).removeClass('li-layer').addClass('layer-on');
                        names.push(text);
                    }
                    else {
                        $(this).addClass('li-layer').removeClass('layer-on');
                    }
                })
               
            }
            else {
                $(this).find('.mq-commodity').addClass('li-layer').removeClass('layer-on');
            }
            
        })
        return names;
    },
    //functions that change the widget
    _layerAdded: function(widget, layer) {
        var self = this;
        var error = layer.legend().msg;
        var url;
        switch(error){
            case '':
                url =layer.legend().url;
                if(url==''){error='No legend for this layer';}
                break;
            case 'E_ZOOMOUT':
                error = 'Please zoom out to see this layer';
                break;
            case 'E_ZOOMIN':
                error = 'Please zoom in to see this layer';
                break;
            case 'E_OUTSIDEBOX':
                error = 'This layer is outside the current view';
                break;
        }
        if(layer.isVector) {
            var group = layer.options.data.group;
            
            var layerElement = $.tmpl('mqLayerJsonManagerCommodity',{
                id: layer.id,
                label: layer.label,
                position: layer.position(),
                visible: layer.visible(),                
                opacity: layer.visible()?layer.opacity():0,
                group: group
                
            })
                // save layer layer in the DOM, so we can easily
                // hide/show/delete the layer with live events
                .data('layer', layer)
                .data('self',self)
                .prependTo(widget);
                self._createPopup(layer, layerElement);
        }
        else {
            var layerElement = $.tmpl('mqLayerJsonManagerElement',{
                id: layer.id,
                label: layer.label,
                position: layer.position(),
                visible: layer.visible(),
                imgUrl: url,
                opacity: layer.visible()?layer.opacity():0,
                errMsg: error
            })
                // save layer layer in the DOM, so we can easily
                // hide/show/delete the layer with live events
                .data('layer', layer)
                .data('self',self)
                .prependTo(widget);
            }

       $(".mq-layerjsonmanager-element-slider", layerElement).slider({
           max: 100,
           step: 1,
           value: layer.visible()?layer.opacity()*100:0,
           slide: function(event, ui) {
               var layer = layerElement.data('layer');
               var self =  layerElement.data('self');
               self._opacity(layer,ui.value/100);
           },
           //using the slide event to check for the checkbox often gives errors.
           change: function(event, ui) {
               var layer = layerElement.data('layer');
               var self =  layerElement.data('self');
               if(ui.value>=0.01) {
                   if(!layer.visible()){layer.visible(true);}
               }
               if(ui.value<0.01) {
                   if(layer.visible()){layer.visible(false);}
               }
           }
       });
       
       
    },
    _createPopup: function(layer, layerElement) {
         var html = $.tmpl('mqCommodityPopup',{
            id: layer.id,
            group: layer.options.data.group
        });

        var dialog = $('<div id="dia-'+layer.id+'"></div>')
        .html(html)
        .dialog({
            autoOpen: true,
            title: layer.options.data.name,
            close:function(event,ui){
                 layerElement.find('.mq-layerjsonmanager-label.close').removeClass('close').addClass('open');
            }
        });
        this._createPie(layer,this);

        layerElement.delegate('.mq-layerjsonmanager-label.close', 'click', function() {
            dialog.dialog('close');
            $(this).removeClass('close').addClass('open');

        });
        layerElement.delegate('.mq-layerjsonmanager-label.open', 'click', function() {
            dialog.dialog('open');
        $(this).removeClass('open').addClass('close');
        });
       
    },
    _createPie: function(layer,widget) {
        var data =layer.options.data;
        var id = layer.id;
        $.each(data.group, function(index, value) {
            var r = Raphael(id+"-"+index, 280, 140);
             r.g.txtattr.font = "12px 'Fontin Sans', Fontin-Sans, sans-serif";
            var rvalue =[];
            var rlabel = [];
            var rurl = [];
            $.each(data.group[index].data, function(i,v){
                rlabel[i] = v.name;
                rvalue[i] = v.percentage;
               // rurl[i] = '#'+widget.zoomTo(data.group[index].title,v.name); 
            })
            var pie = r.g.piechart(60,70,50, rvalue, {legend:rlabel});
            pie.click(function() {
                var part = this.sector.paper.canvas.parentNode.id;
                part = part.split('-');
                
               widget._commodityClicked(layer,part[1],this.label[1].attrs.text,true);
            });
            pie.hover(function () {
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
        });   
    },
    _layerRemoved: function(widget, id) {
        var control = $("#mq-layerjsonmanager-element-"+id);
        control.fadeOut(function() {
            $(this).remove();
        });
    },

    _layerPosition: function(widget, layer) {
        var layerNodes = widget.element.find('.mq-layerjsonmanager-element');
        var num = layerNodes.length-1;
        var tmpNodes = [];
        tmpNodes.length = layerNodes.length;
        layerNodes.each(function() {
            var layer = $(this).data('layer');
            var pos = num-layer.position();
            tmpNodes[pos]= this;
        });
        for (i=0;i<tmpNodes.length;i++) {
            layerNodes.parent().append(tmpNodes[i]);
        }
    },

    _layerVisible: function(widget, layer) {
        var layerElement =
        widget.element.find('#mq-layerjsonmanager-element-'+layer.id);
        var checkbox =
        layerElement.find('.mq-layerjsonmanager-element-vischeckbox');
        checkbox[0].checked = layer.visible();
        //update the opacity slider as well
        var slider = layerElement.find('.mq-layerjsonmanager-element-slider');
        var value = layer.visible()?layer.opacity()*100: 0;
        slider.slider('value',value);

        //update legend image
        layerElement.find('.mq-layerjsonmanager-element-legend img').css(
            {visibility:layer.visible()?true:'hidden'});
    },

    _layerOpacity: function(widget, layer) {
        var layerElement = widget.element.find(
            '#mq-layerjsonmanager-element-'+layer.id);
        var slider = layerElement.find(
            '.mq-layerjsonmanager-element-slider');
        slider.slider('value',layer.opacity()*100);
        //update legend image
        layerElement.find(
            '.mq-layerjsonmanager-element-legend img').css(
            {opacity:layer.opacity()});
    },

    _moveEnd: function (widget,lmElement,map) {
        //lmElement.empty();
        /*$.each(map.layers().reverse(), function(){
           widget._layerAdded(lmElement, this);
        });*/
    },

    //functions bind to the map events
    _onLayerAdd: function(evt, layer) {
        evt.data.widget._layerAdded(evt.data.control,layer);
    },

    _onLayerRemove: function(evt, id) {
        evt.data.widget._layerRemoved(evt.data.control,id);
    },

    _onLayerChange: function(evt, data) {
        var layer;
        //since we don't know which layer we get we've to loop through
        //the openlayers.layer.ids to find the correct one
        $.each(evt.data.map.layers(), function(){
           if(this.olLayer.id == data.layer.id) {layer=this;}
        });
        //(name, order, opacity, params, visibility or attribution)
         switch(data.property) {
            case 'opacity':
                evt.data.widget._layerOpacity(evt.data.widget,layer);
            break;
            case 'order':
                evt.data.widget._layerPosition(evt.data.widget,layer);
            break;
            case 'visibility':
                evt.data.widget._layerVisible(evt.data.widget,layer);
            break;
        }
    },
    _onMoveEnd: function(evt) {
        evt.data.widget._moveEnd(evt.data.widget,evt.data.control,evt.data.map);
    }
});
})(jQuery);
