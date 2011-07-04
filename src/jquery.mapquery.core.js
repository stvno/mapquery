/*
 * Copyright (C) 2011 by Anne Blankert, Steven Ottens, Volker Missche
 * 
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 * 
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 * 
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 */

/**
# MapQuery.Core
  
## Overview 

### `.mapQuery(options)`

**Description**: initialise MapQuery and associate it with the matched element 
 
`.mapQuery(options)` version added: 0.1    
**options**  an object of key-value pairs with options for the map.

returns: jQuery 

We can initialise MapQuery without any options, or for instance pass in a layers object. 
The mapQuery function returns a jQuery object, to access the mapQuery object retrieve
the 'mapQuery' data object.

> var map = $('#map').mapQuery();    
> var map = $('#map').mapQuery({layers:[{type:'osm'}]);     
>
> var mq = map.data('mapQuery');    



 */
(function ($) {
$.MapQuery = $.MapQuery || {};
/**

---

##MapQuery.Map


 */
$.MapQuery.Map = function(element, options) {
    var self = this;
    //If there are a maxExtent and a projection automagically set maxResolution if it is not set
    // TODO smo 20110614: put maxExtent and maxResolution setting in the proper option building routine
    if(options){
    if(!options.maxResolution&&options.maxExtent&&options.projection){
        options.maxResolution = (options.maxExtent[2]-options.maxExtent[0])/256;
    }};
    this.options = $.extend({}, new $.fn.mapQuery.defaults.map(), options);

    this.element = element;
    // TODO vmx 20110609: do proper options building
    // TODO SMO 20110616: make sure that all projection strings are uppercase
    // smo 20110620: you need the exact map options in the overviewmap widget as such we need to preserve them
    this.olMapOptions = $.extend({}, this.options);
    delete this.olMapOptions.layers;
    delete this.olMapOptions.maxExtent;    
    delete this.olMapOptions.zoomToMaxExtent;
    this.maxExtent = this.options.maxExtent;    //TODO SMO20110630 the maxExtent is in mapprojection, decide whether or not we need to change it to displayProjection
    this.olMapOptions.maxExtent = new OpenLayers.Bounds(this.maxExtent[0],this.maxExtent[1],this.maxExtent[2],this.maxExtent[3])
    
    
    OpenLayers.IMAGE_RELOAD_ATTEMPTS = 3; 
    OpenLayers.Util.onImageLoadErrorColor = "transparent"; 
    
    // create the OpenLayers Map
    this.olMap = new OpenLayers.Map(this.element[0], this.olMapOptions);
    
    //OpenLayers doesn't want to return a maxExtent when there is no baselayer set -eg on an empty map, so we create a fake baselayer
    this.olMap.addLayer(new OpenLayers.Layer('fake', {baseLayer: true}));    

    // Keep IDs of vector layer for select feature control
    this.vectorLayers = [];
    this.selectFeatureControl = null;
    // Counts up to create unique IDs
    this.idCounter = 0;

    element.data('mapQuery', this);
    this.layersList = {};

    // To bind and trigger jQuery events
    this.events = $({});
    // create triggers for all OpenLayers map events
    var events = {};
    $.each(this.olMap.EVENT_TYPES, function(i, evt) {
        events[evt] = function() {
            self.events.trigger(evt, arguments);
        };
    });
    this.olMap.events.on(events);

    // Add layers to the map
    if (this.options.layers!==undefined) {
        this.layers(this.options.layers);
    };
    
    // zoom to the maxExtent of the map
    if (this.options.zoomToMaxExtent) {        
        this.olMap.zoomToMaxExtent();
    };
};

$.MapQuery.Map.prototype = {
 /**
 
###*map*.`layers(options)`

**Description**: get/set the layers of the map

`.layers(options)` version added 0.1     
**options** an object of key-value pairs with options to create one or more layers
 
returns: [layers]

The `.layers()` method allows us to attach layers to a mapQuery object. We can also 
use it to retrieve all layers currently attached to the map

> var osm = map.layers({type:'osm'});    
> var layers = map.layers();
      
     */
    layers: function(options) {
        //var o = $.extend({}, options);
        var self = this;
        switch(arguments.length) {
        case 0:
            return this._allLayers();
        case 1:
            if (!$.isArray(options)) {
                return this._addLayer(options);
            }
            else {
                return $.map(options, function(layer) {
                    return self._addLayer(layer);
                });
            }
        default:
            throw('wrong argument number');
        };
    },
    // Returns all layers as an array, sorted by there order in the map. First
    // element in the array is the topmost layer
    _allLayers: function() {
        var layers = [];
        $.each(this.layersList, function(id, layer) {
            var item = [layer.position(), layer];
            layers.push(item);
        });
        var sorted = layers.sort( function compare(a, b) {
            return a[0] - b[0];
        });
        var result = $.map(sorted, function(item) {
            return item[1];
        });
        return result.reverse();
    },
    _addLayer: function(options) {
        var id = this._createId();
        var layer = new $.MapQuery.Layer(this, id, options);
        this.layersList[id] = layer;
        if (layer.isVector) {
            this.vectorLayers.push(id);
        }
        this._updateSelectFeatureControl(this.vectorLayers);
        this.events.trigger('mqAddLayer',layer);
        return layer;
    },
    // Creates a new unique ID for a layer
    _createId: function() {
        return 'mapquery' + this.idCounter++;
    },
    _removeLayer: function(id) {
        // remove id from vectorlayer if it is there list
        this.vectorLayers = $.grep(this.vectorLayers, function(elem) {
            return elem != id;
        });
        this._updateSelectFeatureControl(this.vectorLayers);
        this.events.trigger('mqRemoveLayer',id);
        delete this.layersList[id];        
        // XXX vmx: shouldn't the layer be destroyed() properly?
        return this;
    },
    //This WILL NOT work without a baseLayer or allOverlays == true
    // vmx 20110609 Still true?
/**
 ###*map*.`goto(options)`
 
**Description**: get/set the extent, zoom and position of the map

`.goto({position: [x:y], zoom: z<int>, box: [llx,lly,urx,ury]})` version added 0.1    
**position** the position as [x,y] in displayProjection (default EPSG:4326) to center the map at     
**zoom** the zoomlevel as integer to zoom the map to    
**box** an array with the lower left x, lower left y, upper right x, upper right y to zoom the map to, 
this will take precedent when conflicting with any of the above values     

returns {position: [x:y], zoom: z<int>, box: [llx,lly,urx,ury]}

The `.goto()` method allows us to move to map to a specific zoom level, specific position or a specific extent. 
We can also retrieve the current zoomlevel, position and extent from the map. 

> map.goto({zoom:4});    
> map.goto({position:[5,52]});    
> map.goto(box:[-180,-90,180,90]);

 */    
    goto: function (options) {
        var position;

        // Determine source projection
        var sourceProjection = null;
        if(options && options.projection) {
            sourceProjection = options.projection.CLASS_NAME === 'OpenLayers.Projection' ? options.projection : new OpenLayers.Projection(options.projection);
        } else {
            var displayProjection = this.olMap.displayProjection;
            if(!displayProjection) {
                // source == target
                sourceProjection = new OpenLayers.Projection('EPSG:4326');
            } else {
                sourceProjection = displayProjection.CLASS_NAME === 'OpenLayers.Projection' ? displayProjection : new OpenLayers.Projection(displayProjection);
            }
        }

        // Get the current position
        if (arguments.length===0) {
            position = this.olMap.getCenter();
            var zoom = this.olMap.getZoom();
            var box = this.olMap.getExtent();
            var mapProjection = this.olMap.getProjectionObject();
            

            if (!mapProjection.equals(sourceProjection)) {
                position.transform(mapProjection, sourceProjection);
            }
            box.transform(mapProjection,sourceProjection);
            box = box!==null ? box.toArray() : [];
            return {
                position: [position.lon, position.lat],
                zoom: this.olMap.getZoom(),
                box: box
            };
        }

        // Zoom to the extent of the box
        if (options.box!==undefined) {
            var mapProjection = this.olMap.getProjectionObject();
            var box = new OpenLayers.Bounds(options.box[0], options.box[1],options.box[2], options.box[3]);
            if (!mapProjection.equals(sourceProjection)) {
                box.transform(sourceProjection,mapProjection);
            };
            this.olMap.zoomToExtent(box);
              
        }
        // Only zoom is given
        else if (options.position===undefined) {
            this.olMap.zoomTo(options.zoom);
        }
        // Position is given, zoom maybe as well
        else {
            position = new OpenLayers.LonLat(options.position[0],
                                             options.position[1]);
            var mapProjection = this.olMap.getProjectionObject();
            if (!mapProjection.equals(sourceProjection)) {
                position.transform(sourceProjection, mapProjection);
            }
            // options.zoom might be undefined, so we are good to
            // pass it on
            this.olMap.setCenter(position, options.zoom);
        }
    },
    _updateSelectFeatureControl: function(layerIds) {
        var vectorLayers = [];
        var layersList = this.layersList;
        if (this.selectFeatureControl!==null) {
            this.selectFeatureControl.deactivate();
            this.selectFeatureControl.destroy();
        }
        $.each(layerIds, function() {
            vectorLayers.push(layersList[this].olLayer);
        });
        this.selectFeatureControl = new OpenLayers.Control.SelectFeature(
            vectorLayers);
        this.olMap.addControl(this.selectFeatureControl);
        this.selectFeatureControl.activate();
    },
    bind: function() {
        this.events.bind.apply(this.events, arguments);
    },
    one: function() {
        this.events.one.apply(this.events, arguments);
    },
    destroy: function() {
        this.olMap.destroy();
        this.element.removeData('mapQuery');
    }
};
/**

---

##MapQuery.Layer
 

 */
$.MapQuery.Layer = function(map, id, options) {
    var self = this;
    // apply default options that are not specific to a layer

    this.id = id;
    this.label = options.label || this.id;
    // a reference to the map object is needed as it stores e.g. the list
    // of all layers (and we need to keep track of it, if we delete a
    // layer)
    this.map = map;

    // true if this layer is a vector layer
    this.isVector = false;

    // to bind and trigger jQuery events
    this.events = $({});

    // create the actual layer based on the options
    // Returns layer and final options for the layer (for later re-use,
    // e.g. zoomToMaxExtent).
    var res = $.MapQuery.Layer.types[options.type.toLowerCase()].call(
        this, options);
    this.olLayer = res.layer;
    this.options = res.options;

    // create triggers for all OpenLayers layer events
    var events = {};
    $.each(this.olLayer.EVENT_TYPES, function(i, evt) {
        events[evt] = function() {
            self.events.trigger(evt, arguments);
            self.map.events.trigger(evt, arguments);
        };
    });
    this.olLayer.events.on(events);

    this.map.olMap.addLayer(this.olLayer);
};

$.extend($.MapQuery.Layer, {
/**

###types

 */    
    types: {
/**
#### bing
 
 **Description**: create a Bing-maps layer
  
`{type:bing,key:BINGKEY}` version added 0.1    
**key** the Bing Maps API key for your application. Get you own at http://bingmapsportal.com/     
**view** Bing-maps layer (road, hybrid, satellite) default road    
 
 */        
        bing: function(options) {
            var o = $.extend(true, {}, $.fn.mapQuery.defaults.layer.all,
                $.fn.mapQuery.defaults.layer.bing,
                options);
            var view = o.view;
            switch(view){
                case 'road':
                    view = 'Road'; break;
                case 'hybrid':
                    view = 'AerialWithLabels'; break;
                case 'satellite':
                    view = 'Aerial'; break;
            }
            return {
                layer: new OpenLayers.Layer.Bing({type:view,key:o.key}),
                options: o
            };
        },

/**
#### ecwp

**Description**: create an ecwp layer

`{type:ecwp,url:URL}` version added 0.1    
**url** the url to the ECWP data    
 
 */  
        ecwp: function(options) {
            var o = $.extend(true, {}, $.fn.mapQuery.defaults.layer.all,
                    $.fn.mapQuery.defaults.layer.raster,
                    options);
            return {
                layer: new OpenLayers.Layer.ECWP(o.label, o.url, o),
                options: o
            };
        },
/**

#### google

**Description**: create a Google-maps layer

`{type:google}` version added 0.1    
**view** Google-maps layer (road, hybrid, satellite) default road    
 
 */          
        google: function(options) {
            var o = $.extend(true, {}, $.fn.mapQuery.defaults.layer.all,
                    $.fn.mapQuery.defaults.layer.google,
                    options);
            var view = o.view;
            switch(view){
                case 'road':
                    view = google.maps.MapTypeId.ROADMAP; break;
                case 'terrain':
                    view = google.maps.MapTypeId.TERRAIN; break;
                case 'hybrid':
                    view = google.maps.MapTypeId.HYBRID; break;
                case 'satellite':
                    view = google.maps.MapTypeId.SATELLITE; break;
            }
            return {
                layer: new OpenLayers.Layer.GoogleNG({type:view}),
                options: o
            };
        },
/**

#### vector

**Description**: create a vector layer
 
`{type:vector}` version added 0.1    
 
 */          
        vector: function(options) {
            var o = $.extend(true, {}, $.fn.mapQuery.defaults.layer.all,
                    $.fn.mapQuery.defaults.layer.vector,
                    options);
            this.isVector = true;
            return {
                layer: new OpenLayers.Layer.Vector(o.label),
                options: o
            };
        },
/**

#### json

**Description**: create a JSON layer

`{type:json}` version added 0.1    
**strategies** The OpenLayers update strategy to be used (bbox, cluster, filter, fixed, paging, refresh, save) default fixed    
 
 */          
        json: function(options) {
            var o = $.extend(true, {}, $.fn.mapQuery.defaults.layer.all,
                    $.fn.mapQuery.defaults.layer.vector,
                    options);
            this.isVector = true;
            var strategies = [];
            for (var i in o.strategies) {
                switch(o.strategies[i].toLowerCase()) {
                case 'bbox':
                    strategies.push(new OpenLayers.Strategy.BBOX()); break;
                case 'cluster':
                    strategies.push(new OpenLayers.Strategy.Cluster()); break;
                case 'filter':
                    strategies.push(new OpenLayers.Strategy.Filter()); break;
                case 'fixed':
                    strategies.push(new OpenLayers.Strategy.Fixed()); break;
                case 'paging':
                    strategies.push(new OpenLayers.Strategy.Paging()); break;
                case 'refresh':
                    strategies.push(new OpenLayers.Strategy.Refresh()); break;
                case 'save':
                    strategies.push(new OpenLayers.Strategy.Save()); break;
                }
            }
            var params = {
                protocol: new OpenLayers.Protocol.HTTP({
                    url: o.url,
                    format: new OpenLayers.Format.GeoJSON()
                }),
                strategies: strategies
            };
            return {
                layer: new OpenLayers.Layer.Vector(o.label, params),
                options: o
            };
        },
/**

#### osm

**Description**: create an OpenStreetMap layer
 
`{type:osm}` version added 0.1    
 
 */         
        osm: function(options) {
            var o = $.extend(true, {}, $.fn.mapQuery.defaults.layer.all,
                $.fn.mapQuery.defaults.layer.osm,
                options);
            return {
                layer: new OpenLayers.Layer.OSM(options),
                options: o
            };
        },
/**

#### wms

**Description**: create a WMS layer
 
`{type:wms,layer:WMSLAYER,url:WMSURL}` version added 0.1    
**layer** the layer(s) of the WMS to be displayed      
**url** the url to the WMS service    
 
 */  
        wms: function(options) {
            var o = $.extend(true, {}, $.fn.mapQuery.defaults.layer.all,
                    $.fn.mapQuery.defaults.layer.raster,
                    options);
            var params = {
                layers: o.layers,
                transparent: o.transparent,
                format: o.format
            };
            //SMO20110611: TODO WMS requires a label, autogenerate one if not provided
            return {
                layer: new OpenLayers.Layer.WMS(o.label, o.url, params),
                options: o
            };
        },
/**

#### wmts

**Description**: create a WMTS layer

`{type:wmts,url:WMTSURL}` version added 0.1    
**url** the url to the WMTS service
 
 */          
        wmts: function(options) {
            var o = $.extend(true, {}, $.fn.mapQuery.defaults.layer.all,
                    $.fn.mapQuery.defaults.layer.wmts);
            //smo 20110614 the maxExtent is set here with OpenLayers.Bounds 
            if (options.sphericalMercator===true) {
                $.extend(true, o, {
                    maxExtent: new OpenLayers.Bounds(
                        -128 * 156543.0339, -128 * 156543.0339,
                        128 * 156543.0339, 128 * 156543.0339),
                    maxResolution: 156543.0339,
                    numZoomLevels: 19,
                    projection: 'EPSG:900913',
                    units: 'm'
                });
            }
            $.extend(true, o, options);
            // use by default all options that were passed in for the final
            // openlayers layer consrtuctor
            var params = $.extend(true, {}, o);

            // remove trailing slash
            if (params.url.charAt(params.url.length-1)==='/') {
                params.url = params.url.slice(0, params.url.length-1);
            }
            // if no options that influence the URL where set, extract them
            // from the given URL
            if (o.layer===undefined && o.matrixSet===undefined &&
                    o.style===undefined) {
                var url = $.MapQuery.util.parseUri(params.url);
                var urlParts = url.path.split('/');
                var wmtsPath = urlParts.slice(urlParts.length-3);
                params.url = url.protocol ? url.protocol + '://' : '';
                params.url += url.authority +
                    // remove WMTS version (1.0.0) as well
                    urlParts.slice(0, urlParts.length-4).join('/');
                params.layer = wmtsPath[0];
                params.style = wmtsPath[1];
                params.matrixSet = wmtsPath[2];
            }
            return {
                layer: new OpenLayers.Layer.WMTS(params),
                options: o
            };
        } 
    }
});

$.MapQuery.Layer.prototype = {
/**

###*layer*.`down(delta)`

**Description**: move the layer down in the layer stack of the map

`.down(delta)` version added 0.1    
**delta** the amount of layers the layer has to move down in the layer stack
 
returns layer (MapQuery.Layer)

The `.down(delta)` method is a shortcut method for `.position(pos)` which makes
it easier to move a layer down in the layerstack relative to its current position

> layer.down(3);

 */      
    down: function(delta) {
        delta = delta || 1;
        this.map.olMap.raiseLayer(this.olLayer, -delta);
        return this;
    },
    // NOTE vmx: this would be pretty cool, but it's not easily possible
    // you could use $.each($.geojq.layer())) instead, this is for pure
    // convenience.
    each: function () {},
    // will return the map object
/**

###*layer*.`remove()`

**Description**: remove the layer from the map

`.remove()` version added 0.1

returns layer.id (string)

The `.remove()` method allows us to remove a layer from the map. It returns an id to
make it allow for widgets to remove their references to the destroyed layer.

> var id = layer.remove();
 */      
    remove: function() {
        this.map.olMap.removeLayer(this.olLayer);
        // remove references to this layer that are stored in the
        // map object
        return this.map._removeLayer(this.id);
    },
/**

###*layer*.`position(position)`

**Description**: get/set the `position` of the layer in the layer stack of the map

`.position(position)` version added 0.1
**position** an integer setting the new position of the layer in the layer stack 

returns position (integer)

`.position())` method allows us to change the position of the layer in the layer stack. 
It will take into account the hidden baselayer that is used by OpenLayers.

> var pos =  layer.position();    
> layer.position(pos);

 */      
    position: function(pos) {
        if (pos===undefined) {
            return this.map.olMap.getLayerIndex(this.olLayer)-1;
        }
        else {
            return this.map.olMap.setLayerIndex(this.olLayer, pos+1);
        }
    },
/**

###*layer*.`up(delta)`

**Description**: move the layer up in the layer stack of the map

`.up(delta)` version added 0.1    
**delta** the amount of layers the layer has to move up in the layer stack
 
returns layer (MapQuery.Layer)

The `.up(delta)` method is a shortcut method for `.position(pos)` which makes
it easier to move a layer up in the layerstack relative to its current position

> layer.up(3);


 */      
    up: function(delta) {
        delta = delta || 1;
        this.map.olMap.raiseLayer(this.olLayer, delta);
        return this;
    },
/**

###*layer*.`visible(visible)`

**Description**: get/set the visibility of the layer

`.visible(visible)` version added 0.1
**visible** a boolean setting the visibility of the layer 

returns visible (boolean)

`.visible()` method allows us to change the visibility of the layer. 
Also we can get the current visibility of the layer.


> var vis =  layer.visible();    
> layer.visible(vis);

 */      
    visible: function(vis) {
        if (vis===undefined) {
            return this.olLayer.getVisibility();
        }
        else {
            this.olLayer.setVisibility(vis);
            return this;
        }
    },
    /**

###*layer*.`opacity(opactiy)`

**Description**: get/set the opacity of the layer

`.opacity(opacity)` version added 0.1
**opacity** an float [0-1] setting the opacity of the layer 

returns opacity (float)

`.opacity()` method allows us to change the opacity of the layer. 
Also we can get the current opacity of the layer.


> var opac =  layer.opacity();    
> layer.opacity(opac);
 */      
    opacity: function(opac) {
         if (opac===undefined) {
            // this.olLayer.opacity can be null if never set so return the visibility
            var value;
            this.olLayer.opacity ? value= this.olLayer.opacity : value = this.olLayer.getVisibility();
            return value;
        }
        else {
            this.olLayer.setOpacity(opac);
            return this;
        }
    },
    // every event gets the layer passed in
    bind: function() {
        this.events.bind.apply(this.events, arguments);
    },
    one: function() {
        this.events.one.apply(this.events, arguments);
    }
};

$.fn.mapQuery = function(options) {
    return this.each(function() {
        var instance = $.data(this, 'mapQuery');
        if (!instance) {
            $.data(this, 'mapQuery', new $.MapQuery.Map($(this), options));
        }
    });
};


/**

###mapquery.defaults


 */      
// default options for the map and layers
$.fn.mapQuery.defaults = {
    // The controls for the map are per instance, therefore it need to
    // be an function that can be initiated per instance
    map: function() {
        return {
            // Remove quirky moveTo behavior, probably not a good idea in the
            // long run            
            allOverlays: true,
            controls: [
                // Since OL2.11 the Navigation control includes touch navigation as well
                new OpenLayers.Control.Navigation({
                    documentDrag: true, 
                    dragPanOptions: {
                        interval: 1,
                        enableKinetic: true
                    }
                }),
                new OpenLayers.Control.ArgParser(),
                new OpenLayers.Control.Attribution()
            ],
            format: 'image/png',
            maxExtent: [-128 * 156543.0339, -128 * 156543.0339, 128 * 156543.0339, 128 * 156543.0339],
            maxResolution: 156543.0339,
            numZoomLevels: 19,
            projection: 'EPSG:900913',
            displayProjection: 'EPSG:4326',
            zoomToMaxExtent: true,            
            units: 'm'            
        };
    },
    layer: {
        all: {            
            isBaseLayer: false,
            displayOutsideMaxExtent: false  //in general it is kinda pointless to load tiles outside a maxextent
        },
        bing: {
            transitionEffect: 'resize',
            view: 'road',
            sphericalMercator: true
        },
        google: {
            transitionEffect: 'resize',
            view: 'road',
            sphericalMercator: true
        },
        osm: {            
            transitionEffect: 'resize',
            sphericalMercator: true
        },
        raster: {
            // options for raster layers
            transparent: true
        },
        vector: {
            // options for vector layers
            strategies: ['fixed']
        },
        wmts: {
            format: 'image/jpeg',
            requestEncoding: 'REST',
            sphericalMercator: false
        }
    }
};

// Some utility functions

$.MapQuery.util = {};
// http://blog.stevenlevithan.com/archives/parseuri (2010-12-18)
// parseUri 1.2.2
// (c) Steven Levithan <stevenlevithan.com>
// MIT License
$.MapQuery.util.parseUri = function (str) {
    var o = $.MapQuery.util.parseUri.options,
        m = o.parser[o.strictMode ? "strict" : "loose"].exec(str),
        uri = {},
        i = 14;

    while (i--) uri[o.key[i]] = m[i] || "";

    uri[o.q.name] = {};
    uri[o.key[12]].replace(o.q.parser, function ($0, $1, $2) {
        if ($1) uri[o.q.name][$1] = $2;
    });

    return uri;
};
$.MapQuery.util.parseUri.options = {
    strictMode: false,
    key: ["source", "protocol", "authority", "userInfo", "user",
            "password", "host", "port", "relative", "path", "directory",
            "file", "query", "anchor"],
    q: {
        name: "queryKey",
        parser: /(?:^|&)([^&=]*)=?([^&]*)/g
    },
    parser: {
        strict: /^(?:([^:\/?#]+):)?(?:\/\/((?:(([^:@]*)(?::([^:@]*))?)?@)?([^:\/?#]*)(?::(\d*))?))?((((?:[^?#\/]*\/)*)([^?#]*))(?:\?([^#]*))?(?:#(.*))?)/,
        loose:  /^(?:(?![^:@]+:[^:@\/]*@)([^:\/?#.]+):)?(?:\/\/)?((?:(([^:@]*)(?::([^:@]*))?)?@)?([^:\/?#]*)(?::(\d*))?)(((\/(?:[^?#](?![^?#\/]*\.[^?#\/.]+(?:[?#]|$)))*\/?)?([^?#\/]*))(?:\?([^#]*))?(?:#(.*))?)/
        }
};
})(jQuery);
