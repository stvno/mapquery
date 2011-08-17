$(document).ready(function () {
    var map = $('#map').mapQuery(
    );
    
    var mq = map.data('mapQuery');
    mq.center({zoom:3,position:[5,52]})
    mq.layers([{type:'osm',
            label:'OpenStreetMap',
            legend:{url:'http://www.openstreetmap.org/images/osm_logo.png'}}]);
    
    
    
    // close & open panel handlers
    $("#open-west").click(function() {
        OpenPanel('west');
        myMap.olMap.updateSize();
    });
    $("#close-west").click(function() {
        ClosePanel('west');
        myMap.olMap.updateSize();
    });
    $("#open-east").click(function() {
        OpenPanel('east');
        myMap.olMap.updateSize();
    });
    $("#close-east").click(function() {
        ClosePanel('east');
        myMap.olMap.updateSize();
    });

    
    // map overview-toggle click handler
    $("#overview").mqOverviewMap({
        map: '#map' //pass in the map
        });        
    
    $('#layers').mqLayerJsonManager({map:'#map'});
    
    $('#mouseposition').mqMousePosition({
        map:'#map',
        x:'lon',
        y:'lat',
        precision:4
        });
        
    $('#zoomslider').mqZoomSlider({
        map:'#map'
        });
    $('#com-search').mqJsonSearch({
           map:'#map'
       });
    $('#com-view').mqCommodityView({
        map:'#map'
        });
        
    // Preload images
    $.each(["base-off.png", "base-on.png", "folder-on.png", "folder-off.png", "layer-on.png", "layer-off.png", "spinner.gif"], function () {
        var image = new Image();
        image.src = "images/" + this;
    });
    //commodities menu
    $(".group3.a").hover( function () {$(this).addClass("biga");}, function () {$(this).removeClass("biga");});
    $(".group3.b").hover( function () {$(this).addClass("bigb");}, function () {$(this).removeClass("bigb");});
    $(".commodity").hover( function () {$(this).addClass("big");}, function () {$(this).removeClass("big");});
    
    $("#nonenergy").click( function() { $(".a.commodity").toggle('blind'); return false;});
    $("#nonmetallic").click( function() { $(".aa.commodity").toggle('blind'); return false;});
    $("#construction").click( function() { $(".aaa.commodity").toggle('blind'); return false;});
    $("#ornamental").click( function() { $(".aab.commodity").toggle('blind'); return false;});
    $("#industrial").click( function() { $(".aac.commodity").toggle('blind'); return false;});

    $("#metallic").click( function() { $(".ab.commodity").toggle('blind'); return false;});
    $("#europe").click( function() { $(".aba.commodity").toggle('blind'); return false;});
    $("#noneurope").click( function() { $(".abb.commodity").toggle('blind'); return false;});

    $("#energy").click( function() { $(".b.commodity").toggle('blind'); return false;});
    $("#hydrocarbon").click( function() { $(".ba.commodity").toggle('blind'); return false;});
    $("#fossil").click( function() { $(".bb.commodity").toggle('blind'); return false;});
    $("#otherenergy").click( function() { $(".bc.commodity").toggle('blind'); return false;});

    //TODO: piechart menu
    $(".commodity").click(function() {
    getCommodity(this.innerHTML);
    return false;});
    //einde commodities menu
    
    getCommodity = function(value) {
    var jqxhr = $.getJSON("http://eurogeosource.geodan.nl/OneGeologyServlet/JSONRetreiver?jsoncallback=?",
    { 
        commodity: value
    },
    function(data) {
        var id= this.url.substring(this.url.indexOf("jsonp")+5,this.url.indexOf("&commodity"));

        var e = $('<div id="'+id+'" class="piecharts"></div>');
        
         /*e.find(".ui-icon-closethick").click(function() {
            $(this).parents(".piecharts").toggle("fast");            
        });*/
        e.append('<div class="comm-body"><div id="c'+id+'"></div><div id="d'+id+'"></div><div id="u'+id+'"></div></div>');
        
        /*e.append('');
        //var deposits = [];
        //var div = '<div class="ui-dialog ui-widget ui-widget-content ui-corner-all  ui-draggable ui-resizable" style="display: block; z-index: 1002; outline: 0px none; position: absolute; height: auto; width: 250px; top: 23px; left: 377px;"><div class="ui-dialog-titlebar ui-widget-header ui-corner-all ui-helper-clearfix"><span id="ui-dialog-title-mapqueryoverviewmap1" class="ui-dialog-title">' + data.commodity + '</span><a class="ui-dialog-titlebar-close ui-corner-all" href="#" role="button"><span class="ui-icon ui-icon-closethick">close</span></a></div><div class="comm-body">';
        <div class="comm-body">';
        div += '<input type="checkbox" name="all" value="all">Show all occurences<br/>';
        
        
        div +='<div id="countries"></div>';
        div +='<div id="deposits"></div>';
        div +='<div id="UNFC"></div>';

        
        
        div +='</div></div>';
        e = $(div);
        */
        
         $("#commoditylist").mqCommodityToc('addCommodity',$("#commoditylist"),data,id);
        $("body").append(e);
        $("#"+id).dialog({title: data.commodity});
        createPie(data,id);
    $('area').click(function() { 
var alt = $(this).attr('alt');
loadPT(true);
return false;
});
    });
    };
     loadPT = function(value) {
    if(!value) return false;
var ptdata = [{type:"Feature",geometry:{type:"Point",x:-846839.0810804723,y: 4888785.1431163475},attributes:{title:"480SnLi",description:"Main commodities: Sn, Li\nOther commodities:Sn, Cu, As, Li\nMineralogy: Cassiterite (Sn), Estanite (Sn), Calcopirite (Cu), Arsenopirite (As), Ambligonite (Li)\nDeposit type: Pegmatite"},style:{pointRadius:6,graphicName:"circle",fillColor:"#ff0000",fillOpacity:1,strokeWidth:3,strokeOpacity:1,strokeColor:"#000000",externalGraphic: null,strokeDashstyle:"solid"}},{type:"Feature",geometry:{type:"Point",x:-816741.7056781892,y: 4926955.544292995},attributes:{title:"778QzFlLi",description:"Main commodities: Quartz, Feld., Li\nOther commodities:Li\nMineralogy: Quartz, Feldspar (feld.), Lepidolite (Li)\nDeposit type: Pegmatite"},style:{pointRadius:6,graphicName:"circle",fillColor:"#ff0000",fillOpacity:1,strokeWidth:3,strokeOpacity:1,strokeColor:"#000000",externalGraphic: null,strokeDashstyle:"solid"}},{type:"Feature",geometry:{type:"Point",x:-819451.8479211848,y: 4925994.817505392},attributes:{title:"791FlLi",description:"Main commodities: Feld., Li\nOther commodities:Li\nMineralogy: Feldspar (feld.), Lepidolite (Li)\nDeposit type: Pegmatite"},style:{pointRadius:6,graphicName:"circle",fillColor:"#ff0000",fillOpacity:1,strokeWidth:3,strokeOpacity:1,strokeColor:"#000000",externalGraphic: null,strokeDashstyle:"solid"}},{type:"Feature",geometry:{type:"Point",x:-816418.7648753257,y: 4928640.870280138},attributes:{title:"806LiSn",description:"Main commodities: Li, Sn\nOther commodities:Be, Ta, Feld.\nMineralogy: Cassiterite (Sn), Lepidolite (Li), Beryllium (Be), Tantalite (Ta), Feldspar (feld.)\nDeposit type: Pegmatite"},style:{pointRadius:6,graphicName:"circle",fillColor:"#ff0000",fillOpacity:1,strokeWidth:3,strokeOpacity:1,strokeColor:"#000000",externalGraphic: null,strokeDashstyle:"solid"}},{type:"Feature",geometry:{type:"Point",x:-863033.3594948987,y: 4951898.673483456},attributes:{title:"808BeLiSn",description:"Main commodities: Be, Li, Sn\nOther commodities:Quartz, Ta, W, Feld.\nMineralogy: Beryllium (Be), Cassiterite (Sn), Lepidolite (Li), Quartz, Tantalite (Ta), Wolframite (W), Feldspar (feld.)\nDeposit type: Pegmatite"},style:{pointRadius:6,graphicName:"circle",fillColor:"#ff0000",fillOpacity:1,strokeWidth:3,strokeOpacity:1,strokeColor:"#000000",externalGraphic: null,strokeDashstyle:"solid"}},{type:"Feature",geometry:{type:"Point",x:-858639.70664483,y: 5101783.852354425},attributes:{title:"829Li",description:"Main commodities: Li\nOther commodities:Li\nMineralogy: Spodumene (Li), Ambligonite (Li), Montbrasite (Li), Eucriptite (Li), Petalite (Li)\nDeposit type: Pegmatite"},style:{pointRadius:6,graphicName:"circle",fillColor:"#ff0000",fillOpacity:1,strokeWidth:3,strokeOpacity:1,strokeColor:"#000000",externalGraphic: null,strokeDashstyle:"solid"}},{type:"Feature",geometry:{type:"Point",x:-859313.1031199817,y: 5100781.591159093},attributes:{title:"830Li",description:"Main commodities: Li\nOther commodities:\nMineralogy: Spodumene (Li)\nDeposit type: Pegmatite"},style:{pointRadius:6,graphicName:"circle",fillColor:"#ff0000",fillOpacity:1,strokeWidth:3,strokeOpacity:1,strokeColor:"#000000",externalGraphic: null,strokeDashstyle:"solid"}},{type:"Feature",geometry:{type:"Point",x:-852897.531396277,y: 5101914.734729657},attributes:{title:"831Li",description:"Main commodities: Li\nOther commodities:Li\nMineralogy: Spodumene (Li), Petalite (Li), Eucriptite (Li)\nDeposit type: Pegmatite"},style:{pointRadius:6,graphicName:"circle",fillColor:"#ff0000",fillOpacity:1,strokeWidth:3,strokeOpacity:1,strokeColor:"#000000",externalGraphic: null,strokeDashstyle:"solid"}},{type:"Feature",geometry:{type:"Point",x:-863045.3624922056,y: 5102247.044587334},attributes:{title:"832Li",description:"Main commodities: Li\nOther commodities:Li\nMineralogy: Spodumene (Li), Petalite (Li), Eucriptite (Li), Ambligonite (Li)\nDeposit type: Pegmatite"},style:{pointRadius:6,graphicName:"circle",fillColor:"#ff0000",fillOpacity:1,strokeWidth:3,strokeOpacity:1,strokeColor:"#000000",externalGraphic: null,strokeDashstyle:"solid"}},{type:"Feature",geometry:{type:"Point",x:-803138.4447312084,y: 4983583.182505222},attributes:{title:"1488LiSn",description:"Main commodities: Li, Sn\nOther commodities:Li, Sn, As, Cu\nMineralogy: Ambligonite (Li), Cassiterite (Sn), Lepidolite (Li), Estanite (Sn), Arsenopirite (As), Calcopirite (Cu)\nDeposit type: Pegmatite"},style:{pointRadius:6,graphicName:"circle",fillColor:"#ff0000",fillOpacity:1,strokeWidth:3,strokeOpacity:1,strokeColor:"#000000",externalGraphic: null,strokeDashstyle:"solid"}},{type:"Feature",geometry:{type:"Point",x:-815064.1063039236,y: 4934691.623560578},attributes:{title:"1614LiSn",description:"Main commodities: Li, Sn\nOther commodities:\nMineralogy: Cassiterite (Sn), Lepidolite (Li)\nDeposit type: Pegmatite"},style:{pointRadius:6,graphicName:"circle",fillColor:"#ff0000",fillOpacity:1,strokeWidth:3,strokeOpacity:1,strokeColor:"#000000",externalGraphic: null,strokeDashstyle:"solid"}},{type:"Feature",geometry:{type:"Point",x:-813780.1424527437,y: 4931648.750677317},attributes:{title:"1615QzFlLi",description:"Main commodities: Quartz, Feld., Li\nOther commodities:Sn, Ti\nMineralogy: Quartz, Lepidolite (Li), Feldspar (Feld.), Cassiterite (Sn), Ilmenite (Ti)\nDeposit type: Pegmatite"},style:{pointRadius:6,graphicName:"circle",fillColor:"#ff0000",fillOpacity:1,strokeWidth:3,strokeOpacity:1,strokeColor:"#000000",externalGraphic: null,strokeDashstyle:"solid"}}];
ptdata = eval(ptdata);
_loadVectorLayer(ptdata,true);
}

    
});
