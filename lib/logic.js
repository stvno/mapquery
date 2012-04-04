$(document).ready(function () {
	function getUrlVars()
	{
	    var vars = [], hash;
	    var hashes = window.location.href.slice(window.location.href.indexOf('?') + 1).split('&');
	    for(var i = 0; i < hashes.length; i++)
	    {
	        hash = hashes[i].split('=');
	        vars.push(hash[0]);
	        vars[hash[0]] = hash[1];
	    }
	    return vars;
	};
	function loadBundles() {
			var lang = getUrlVars()["lang"];
			jQuery.i18n.properties({
			    name:'Messages', 
			    path:'bundle/', 
			    mode:'both',
			    language:lang
			});
	};
	loadBundles();
    var map = $('#map').mapQuery(
    );
    
    var mq = map.data('mapQuery');
    mq.center({zoom:3,position:[5,52]})
    mq.layers([{type:'osm',
            label:'OpenStreetMap',
            legend:{url:'http://www.openstreetmap.org/assets/osm_logo.png'},
            attribution: 'CC-By-SA OpenStreetMap'}
            ]);
    
    
    
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
    $('#popup').mqPopup({
        map: '#map',
        title: "Commodity",
        contents: function(feature) {
            return '<p>name: ' + feature.data.name + '</p><p>type name: ' + feature.data.typeName + '</p>';
        }
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
      
    $('#geo-search').mqGeocoder({
        map:'#map'
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
     $('#languagePicker').languagePicker();   
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
    /*
    getCommodity = function(value) {
    var jqxhr = $.getJSON("http://eurogeosource.geodan.nl/OneGeologyServlet/JSONRetreiver?jsoncallback=?",
    { 
        commodity: value
    },
    function(data) {
        var id= this.url.substring(this.url.indexOf("jsonp")+5,this.url.indexOf("&commodity"));

        var e = $('<div id="'+id+'" class="piecharts"></div>');
      
        e.append('<div class="comm-body"><div id="c'+id+'"></div><div id="d'+id+'"></div><div id="u'+id+'"></div></div>');
        
        
        
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
*/

  
  //temp hack
  //AANPASSEN!!!!
  $('#onegeology').click(function() {
      $('#onegeology').toggleClass('closed').toggleClass('open').find('ul').toggle('blind');
  
  });
    $('#spba').click(function() {
      $('#spba').toggleClass('closed').toggleClass('open').find('ul').toggle('blind');
  
  });
  
  $('#onegeology').find('li.li-layer').click(function() {
      var id = $(this).find('span')[0].id;
      if(id == 'layer6') {
          $(this).toggleClass('layer-on').toggleClass('layer-off');
          var layer6;
          if($(this).hasClass('layer-on')) {
              layer6 = map.data('mapQuery').layers({label:'One Geology North', type:'tms',url: 'http://maps.eurogeosource.eu/mapproxy/tms/',layer:'north_EPSG900913'})
              $(this).data('layer',layer6)
          }
          else {
               $(this).data('layer').remove();
          }
      }
      else if(id == 'layer7') {
          $(this).toggleClass('layer-on').toggleClass('layer-off');
          var layer7;
          if($(this).hasClass('layer-on')) {
              layer7 = map.data('mapQuery').layers({label:'One Geology South', type:'tms',url: 'http://maps.eurogeosource.eu/mapproxy/tms/',layer:'south_EPSG900913'})
              $(this).data('layer',layer7)
          }
          else {
               $(this).data('layer').remove();
          }
          
      }
      else if(id == 'layer8') {
          $(this).toggleClass('layer-on').toggleClass('layer-off');
          var layer8;
          if($(this).hasClass('layer-on')) {
              layer8 = map.data('mapQuery').layers({label:'One Geology West', type:'tms',url: 'http://maps.eurogeosource.eu/mapproxy/tms/',layer:'west_EPSG900913'})
              $(this).data('layer',layer8)
          }
          else {
               $(this).data('layer').remove();
          }
          
      }
      else if(id == 'layer9') {
          $(this).toggleClass('layer-on').toggleClass('layer-off');          
          var layer9;
          if($(this).hasClass('layer-on')) {
              layer9 = map.data('mapQuery').layers({label:'One Geology Center', type:'tms',url: 'http://maps.eurogeosource.eu/mapproxy/tms/',layer:'center_EPSG900913'})
              $(this).data('layer',layer9)
          }
          else {
              $(this).data('layer').remove();
          }
          
      }
            return false;
  });
      
        $('#spba').find('li.li-layer').click(function() {
      var id = $(this).find('span')[0].id;
       if(id == 'layer10') { $(this).toggleClass('layer-on').toggleClass('layer-off');           var layer10; if($(this).hasClass('layer-on')) { layer10= map.data('mapQuery').layers({label: '1.2_bathymetry_topo',type:'tms',url: 'http://maps.eurogeosource.eu/mapproxy/tms/',layer:'dino_M12M0223_EPSG900913'}); $(this).data('layer',layer10) } else { $(this).data('layer').remove(); } } 
else if(id == 'layer11') { $(this).toggleClass('layer-on').toggleClass('layer-off');           var layer11; if($(this).hasClass('layer-on')) { layer11= map.data('mapQuery').layers({label: '1.3_qu_s',type:'tms',url: 'http://maps.eurogeosource.eu/mapproxy/tms/',layer:'dino_M12M0224_EPSG900913'}); $(this).data('layer',layer11) } else { $(this).data('layer').remove(); } } 
else if(id == 'layer12') { $(this).toggleClass('layer-on').toggleClass('layer-off');           var layer12; if($(this).hasClass('layer-on')) { layer12= map.data('mapQuery').layers({label: '1.4_gas_oil_pipelines',type:'tms',url: 'http://maps.eurogeosource.eu/mapproxy/tms/',layer:'dino_M12M0225_EPSG900913'}); $(this).data('layer',layer12) } else { $(this).data('layer').remove(); } } 
else if(id == 'layer13') { $(this).toggleClass('layer-on').toggleClass('layer-off');           var layer13; if($(this).hasClass('layer-on')) { layer13= map.data('mapQuery').layers({label: '1.6_seismic_boreholes',type:'tms',url: 'http://maps.eurogeosource.eu/mapproxy/tms/',layer:'dino_M12M0226_EPSG900913'}); $(this).data('layer',layer13) } else { $(this).data('layer').remove(); } } 
else if(id == 'layer14') { $(this).toggleClass('layer-on').toggleClass('layer-off');           var layer14; if($(this).hasClass('layer-on')) { layer14= map.data('mapQuery').layers({label: '10.11_ju_pres_day',type:'tms',url: 'http://maps.eurogeosource.eu/mapproxy/tms/',layer:'dino_M12M0227_EPSG900913'}); $(this).data('layer',layer14) } else { $(this).data('layer').remove(); } } 
else if(id == 'layer15') { $(this).toggleClass('layer-on').toggleClass('layer-off');           var layer15; if($(this).hasClass('layer-on')) { layer15= map.data('mapQuery').layers({label: '10.12_lju_Source_Rock',type:'tms',url: 'http://maps.eurogeosource.eu/mapproxy/tms/',layer:'dino_M12M0228_EPSG900913'}); $(this).data('layer',layer15) } else { $(this).data('layer').remove(); } } 
else if(id == 'layer16') { $(this).toggleClass('layer-on').toggleClass('layer-off');           var layer16; if($(this).hasClass('layer-on')) { layer16= map.data('mapQuery').layers({label: '10.13_uju_Source_Rock',type:'tms',url: 'http://maps.eurogeosource.eu/mapproxy/tms/',layer:'dino_M12M0229_EPSG900913'}); $(this).data('layer',layer16) } else { $(this).data('layer').remove(); } } 
else if(id == 'layer17') { $(this).toggleClass('layer-on').toggleClass('layer-off');           var layer17; if($(this).hasClass('layer-on')) { layer17= map.data('mapQuery').layers({label: '10.2_lju_d',type:'tms',url: 'http://maps.eurogeosource.eu/mapproxy/tms/',layer:'dino_M12M0230_EPSG900913'}); $(this).data('layer',layer17) } else { $(this).data('layer').remove(); } } 
else if(id == 'layer18') { $(this).toggleClass('layer-on').toggleClass('layer-off');           var layer18; if($(this).hasClass('layer-on')) { layer18= map.data('mapQuery').layers({label: '10.3_lju_t',type:'tms',url: 'http://maps.eurogeosource.eu/mapproxy/tms/',layer:'dino_M12M0231_EPSG900913'}); $(this).data('layer',layer18) } else { $(this).data('layer').remove(); } } 
else if(id == 'layer19') { $(this).toggleClass('layer-on').toggleClass('layer-off');           var layer19; if($(this).hasClass('layer-on')) { layer19= map.data('mapQuery').layers({label: '10.4_mju_d',type:'tms',url: 'http://maps.eurogeosource.eu/mapproxy/tms/',layer:'dino_M12M0232_EPSG900913'}); $(this).data('layer',layer19) } else { $(this).data('layer').remove(); } } 
else if(id == 'layer20') { $(this).toggleClass('layer-on').toggleClass('layer-off');           var layer20; if($(this).hasClass('layer-on')) { layer20= map.data('mapQuery').layers({label: '10.5_mju_t',type:'tms',url: 'http://maps.eurogeosource.eu/mapproxy/tms/',layer:'dino_M12M0233_EPSG900913'}); $(this).data('layer',layer20) } else { $(this).data('layer').remove(); } } 
else if(id == 'layer21') { $(this).toggleClass('layer-on').toggleClass('layer-off');           var layer21; if($(this).hasClass('layer-on')) { layer21= map.data('mapQuery').layers({label: '10.6_uju_d',type:'tms',url: 'http://maps.eurogeosource.eu/mapproxy/tms/',layer:'dino_M12M0234_EPSG900913'}); $(this).data('layer',layer21) } else { $(this).data('layer').remove(); } } 
else if(id == 'layer22') { $(this).toggleClass('layer-on').toggleClass('layer-off');           var layer22; if($(this).hasClass('layer-on')) { layer22= map.data('mapQuery').layers({label: '10.7_uju_t',type:'tms',url: 'http://maps.eurogeosource.eu/mapproxy/tms/',layer:'dino_M12M0235_EPSG900913'}); $(this).data('layer',layer22) } else { $(this).data('layer').remove(); } } 
else if(id == 'layer23') { $(this).toggleClass('layer-on').toggleClass('layer-off');           var layer23; if($(this).hasClass('layer-on')) { layer23= map.data('mapQuery').layers({label: '10-8 Early Bathonian',type:'tms',url: 'http://maps.eurogeosource.eu/mapproxy/tms/',layer:'dino_M12M0236_EPSG900913'}); $(this).data('layer',layer23) } else { $(this).data('layer').remove(); } } 
else if(id == 'layer24') { $(this).toggleClass('layer-on').toggleClass('layer-off');           var layer24; if($(this).hasClass('layer-on')) { layer24= map.data('mapQuery').layers({label: '10-8 Early Toarcian',type:'tms',url: 'http://maps.eurogeosource.eu/mapproxy/tms/',layer:'dino_M12M0237_EPSG900913'}); $(this).data('layer',layer24) } else { $(this).data('layer').remove(); } } 
else if(id == 'layer25') { $(this).toggleClass('layer-on').toggleClass('layer-off');           var layer25; if($(this).hasClass('layer-on')) { layer25= map.data('mapQuery').layers({label: '10-8 Hettangian',type:'tms',url: 'http://maps.eurogeosource.eu/mapproxy/tms/',layer:'dino_M12M0238_EPSG900913'}); $(this).data('layer',layer25) } else { $(this).data('layer').remove(); } } 
else if(id == 'layer26') { $(this).toggleClass('layer-on').toggleClass('layer-off');           var layer26; if($(this).hasClass('layer-on')) { layer26= map.data('mapQuery').layers({label: '10-8 Kimmeridgian',type:'tms',url: 'http://maps.eurogeosource.eu/mapproxy/tms/',layer:'dino_M12M0239_EPSG900913'}); $(this).data('layer',layer26) } else { $(this).data('layer').remove(); } } 
else if(id == 'layer27') { $(this).toggleClass('layer-on').toggleClass('layer-off');           var layer27; if($(this).hasClass('layer-on')) { layer27= map.data('mapQuery').layers({label: '10-8 Mid Callovian',type:'tms',url: 'http://maps.eurogeosource.eu/mapproxy/tms/',layer:'dino_M12M0240_EPSG900913'}); $(this).data('layer',layer27) } else { $(this).data('layer').remove(); } } 
else if(id == 'layer28') { $(this).toggleClass('layer-on').toggleClass('layer-off');           var layer28; if($(this).hasClass('layer-on')) { layer28= map.data('mapQuery').layers({label: '10-8 Mid Oxfordian',type:'tms',url: 'http://maps.eurogeosource.eu/mapproxy/tms/',layer:'dino_M12M0241_EPSG900913'}); $(this).data('layer',layer28) } else { $(this).data('layer').remove(); } } 
else if(id == 'layer29') { $(this).toggleClass('layer-on').toggleClass('layer-off');           var layer29; if($(this).hasClass('layer-on')) { layer29= map.data('mapQuery').layers({label: '11.2_lcr_d',type:'tms',url: 'http://maps.eurogeosource.eu/mapproxy/tms/',layer:'dino_M12M0242_EPSG900913'}); $(this).data('layer',layer29) } else { $(this).data('layer').remove(); } } 
else if(id == 'layer30') { $(this).toggleClass('layer-on').toggleClass('layer-off');           var layer30; if($(this).hasClass('layer-on')) { layer30= map.data('mapQuery').layers({label: '11.22_ck_pressure',type:'tms',url: 'http://maps.eurogeosource.eu/mapproxy/tms/',layer:'dino_M12M0243_EPSG900913'}); $(this).data('layer',layer30) } else { $(this).data('layer').remove(); } } 
else if(id == 'layer31') { $(this).toggleClass('layer-on').toggleClass('layer-off');           var layer31; if($(this).hasClass('layer-on')) { layer31= map.data('mapQuery').layers({label: '11.24_cr_pres_day',type:'tms',url: 'http://maps.eurogeosource.eu/mapproxy/tms/',layer:'dino_M12M0244_EPSG900913'}); $(this).data('layer',layer31) } else { $(this).data('layer').remove(); } } 
else if(id == 'layer32') { $(this).toggleClass('layer-on').toggleClass('layer-off');           var layer32; if($(this).hasClass('layer-on')) { layer32= map.data('mapQuery').layers({label: '11.3_ucr_d',type:'tms',url: 'http://maps.eurogeosource.eu/mapproxy/tms/',layer:'dino_M12M0245_EPSG900913'}); $(this).data('layer',layer32) } else { $(this).data('layer').remove(); } } 
else if(id == 'layer33') { $(this).toggleClass('layer-on').toggleClass('layer-off');           var layer33; if($(this).hasClass('layer-on')) { layer33= map.data('mapQuery').layers({label: '11.4_lcr_t',type:'tms',url: 'http://maps.eurogeosource.eu/mapproxy/tms/',layer:'dino_M12M0246_EPSG900913'}); $(this).data('layer',layer33) } else { $(this).data('layer').remove(); } } 
else if(id == 'layer34') { $(this).toggleClass('layer-on').toggleClass('layer-off');           var layer34; if($(this).hasClass('layer-on')) { layer34= map.data('mapQuery').layers({label: '11.5_lcr_s',type:'tms',url: 'http://maps.eurogeosource.eu/mapproxy/tms/',layer:'dino_M12M0247_EPSG900913'}); $(this).data('layer',layer34) } else { $(this).data('layer').remove(); } } 
else if(id == 'layer35') { $(this).toggleClass('layer-on').toggleClass('layer-off');           var layer35; if($(this).hasClass('layer-on')) { layer35= map.data('mapQuery').layers({label: '11.6_ucr_t',type:'tms',url: 'http://maps.eurogeosource.eu/mapproxy/tms/',layer:'dino_M12M0248_EPSG900913'}); $(this).data('layer',layer35) } else { $(this).data('layer').remove(); } } 
else if(id == 'layer36') { $(this).toggleClass('layer-on').toggleClass('layer-off');           var layer36; if($(this).hasClass('layer-on')) { layer36= map.data('mapQuery').layers({label: '11.7_ck_tert_s',type:'tms',url: 'http://maps.eurogeosource.eu/mapproxy/tms/',layer:'dino_M12M0249_EPSG900913'}); $(this).data('layer',layer36) } else { $(this).data('layer').remove(); } } 
else if(id == 'layer37') { $(this).toggleClass('layer-on').toggleClass('layer-off');           var layer37; if($(this).hasClass('layer-on')) { layer37= map.data('mapQuery').layers({label: '12.1_tert_d',type:'tms',url: 'http://maps.eurogeosource.eu/mapproxy/tms/',layer:'dino_M12M0250_EPSG900913'}); $(this).data('layer',layer37) } else { $(this).data('layer').remove(); } } 
else if(id == 'layer38') { $(this).toggleClass('layer-on').toggleClass('layer-off');           var layer38; if($(this).hasClass('layer-on')) { layer38= map.data('mapQuery').layers({label: '12.14_qu_d',type:'tms',url: 'http://maps.eurogeosource.eu/mapproxy/tms/',layer:'dino_M12M0251_EPSG900913'}); $(this).data('layer',layer38) } else { $(this).data('layer').remove(); } } 
else if(id == 'layer39') { $(this).toggleClass('layer-on').toggleClass('layer-off');           var layer39; if($(this).hasClass('layer-on')) { layer39= map.data('mapQuery').layers({label: '13.10_early_ca_east_midland',type:'tms',url: 'http://maps.eurogeosource.eu/mapproxy/tms/',layer:'dino_M12M0252_EPSG900913'}); $(this).data('layer',layer39) } else { $(this).data('layer').remove(); } } 
else if(id == 'layer40') { $(this).toggleClass('layer-on').toggleClass('layer-off');           var layer40; if($(this).hasClass('layer-on')) { layer40= map.data('mapQuery').layers({label: '13.14_early_ca_clevel_basin',type:'tms',url: 'http://maps.eurogeosource.eu/mapproxy/tms/',layer:'dino_M12M0253_EPSG900913'}); $(this).data('layer',layer40) } else { $(this).data('layer').remove(); } } 
else if(id == 'layer41') { $(this).toggleClass('layer-on').toggleClass('layer-off');           var layer41; if($(this).hasClass('layer-on')) { layer41= map.data('mapQuery').layers({label: '13.18_early_ca_pomerania',type:'tms',url: 'http://maps.eurogeosource.eu/mapproxy/tms/',layer:'dino_M12M0254_EPSG900913'}); $(this).data('layer',layer41) } else { $(this).data('layer').remove(); } } 
else if(id == 'layer42') { $(this).toggleClass('layer-on').toggleClass('layer-off');           var layer42; if($(this).hasClass('layer-on')) { layer42= map.data('mapQuery').layers({label: '13.1a_overview_paleoz_prov',type:'tms',url: 'http://maps.eurogeosource.eu/mapproxy/tms/',layer:'dino_M12M0255_EPSG900913'}); $(this).data('layer',layer42) } else { $(this).data('layer').remove(); } } 
else if(id == 'layer43') { $(this).toggleClass('layer-on').toggleClass('layer-off');           var layer43; if($(this).hasClass('layer-on')) { layer43= map.data('mapQuery').layers({label: '13.22_early_ca_foresudetic',type:'tms',url: 'http://maps.eurogeosource.eu/mapproxy/tms/',layer:'dino_M12M0256_EPSG900913'}); $(this).data('layer',layer43) } else { $(this).data('layer').remove(); } } 
else if(id == 'layer44') { $(this).toggleClass('layer-on').toggleClass('layer-off');           var layer44; if($(this).hasClass('layer-on')) { layer44= map.data('mapQuery').layers({label: '13.26_early_ca_lublin',type:'tms',url: 'http://maps.eurogeosource.eu/mapproxy/tms/',layer:'dino_M12M0257_EPSG900913'}); $(this).data('layer',layer44) } else { $(this).data('layer').remove(); } } 
else if(id == 'layer45') { $(this).toggleClass('layer-on').toggleClass('layer-off');           var layer45; if($(this).hasClass('layer-on')) { layer45= map.data('mapQuery').layers({label: '13.30_westph_dutch_german',type:'tms',url: 'http://maps.eurogeosource.eu/mapproxy/tms/',layer:'dino_M12M0258_EPSG900913'}); $(this).data('layer',layer45) } else { $(this).data('layer').remove(); } } 
else if(id == 'layer46') { $(this).toggleClass('layer-on').toggleClass('layer-off');           var layer46; if($(this).hasClass('layer-on')) { layer46= map.data('mapQuery').layers({label: '13.33_ze_pomerania',type:'tms',url: 'http://maps.eurogeosource.eu/mapproxy/tms/',layer:'dino_M12M0259_EPSG900913'}); $(this).data('layer',layer46) } else { $(this).data('layer').remove(); } } 
else if(id == 'layer47') { $(this).toggleClass('layer-on').toggleClass('layer-off');           var layer47; if($(this).hasClass('layer-on')) { layer47= map.data('mapQuery').layers({label: '13.36_ze_foresudetic',type:'tms',url: 'http://maps.eurogeosource.eu/mapproxy/tms/',layer:'dino_M12M0260_EPSG900913'}); $(this).data('layer',layer47) } else { $(this).data('layer').remove(); } } 
else if(id == 'layer48') { $(this).toggleClass('layer-on').toggleClass('layer-off');           var layer48; if($(this).hasClass('layer-on')) { layer48= map.data('mapQuery').layers({label: '13.4_pre_dev_baltic',type:'tms',url: 'http://maps.eurogeosource.eu/mapproxy/tms/',layer:'dino_M12M0261_EPSG900913'}); $(this).data('layer',layer48) } else { $(this).data('layer').remove(); } } 
else if(id == 'layer49') { $(this).toggleClass('layer-on').toggleClass('layer-off');           var layer49; if($(this).hasClass('layer-on')) { layer49= map.data('mapQuery').layers({label: '13.40_ju_weald',type:'tms',url: 'http://maps.eurogeosource.eu/mapproxy/tms/',layer:'dino_M12M0262_EPSG900913'}); $(this).data('layer',layer49) } else { $(this).data('layer').remove(); } } 
else if(id == 'layer50') { $(this).toggleClass('layer-on').toggleClass('layer-off');           var layer50; if($(this).hasClass('layer-on')) { layer50= map.data('mapQuery').layers({label: '13.44_ju_central_graben',type:'tms',url: 'http://maps.eurogeosource.eu/mapproxy/tms/',layer:'dino_M12M0263_EPSG900913'}); $(this).data('layer',layer50) } else { $(this).data('layer').remove(); } } 
else if(id == 'layer51') { $(this).toggleClass('layer-on').toggleClass('layer-off');           var layer51; if($(this).hasClass('layer-on')) { layer51= map.data('mapQuery').layers({label: '13.50_ju_B14basin_WNbasin',type:'tms',url: 'http://maps.eurogeosource.eu/mapproxy/tms/',layer:'dino_M12M0267_EPSG900913'}); $(this).data('layer',layer51) } else { $(this).data('layer').remove(); } } 
else if(id == 'layer52') { $(this).toggleClass('layer-on').toggleClass('layer-off');           var layer52; if($(this).hasClass('layer-on')) { layer52= map.data('mapQuery').layers({label: '13.54_ju_Low_Sax_basin',type:'tms',url: 'http://maps.eurogeosource.eu/mapproxy/tms/',layer:'dino_M12M0264_EPSG900913'}); $(this).data('layer',layer52) } else { $(this).data('layer').remove(); } } 
else if(id == 'layer53') { $(this).toggleClass('layer-on').toggleClass('layer-off');           var layer53; if($(this).hasClass('layer-on')) { layer53= map.data('mapQuery').layers({label: '13.58_ju_Tail_Endgraben',type:'tms',url: 'http://maps.eurogeosource.eu/mapproxy/tms/',layer:'dino_M12M0265_EPSG900913'}); $(this).data('layer',layer53) } else { $(this).data('layer').remove(); } } 
else if(id == 'layer54') { $(this).toggleClass('layer-on').toggleClass('layer-off');           var layer54; if($(this).hasClass('layer-on')) { layer54= map.data('mapQuery').layers({label: '13.7_early_ca_nweurope',type:'tms',url: 'http://maps.eurogeosource.eu/mapproxy/tms/',layer:'dino_M12M0266_EPSG900913'}); $(this).data('layer',layer54) } else { $(this).data('layer').remove(); } } 
else if(id == 'layer55') { $(this).toggleClass('layer-on').toggleClass('layer-off');           var layer55; if($(this).hasClass('layer-on')) { layer55= map.data('mapQuery').layers({label: '2.19_gravity_bouguer',type:'tms',url: 'http://maps.eurogeosource.eu/mapproxy/tms/',layer:'dino_M12M0268_EPSG900913'}); $(this).data('layer',layer55) } else { $(this).data('layer').remove(); } } 
else if(id == 'layer56') { $(this).toggleClass('layer-on').toggleClass('layer-off');           var layer56; if($(this).hasClass('layer-on')) { layer56= map.data('mapQuery').layers({label: '2.2_moho_disc_d',type:'tms',url: 'http://maps.eurogeosource.eu/mapproxy/tms/',layer:'dino_M12M0269_EPSG900913'}); $(this).data('layer',layer56) } else { $(this).data('layer').remove(); } } 
else if(id == 'layer57') { $(this).toggleClass('layer-on').toggleClass('layer-off');           var layer57; if($(this).hasClass('layer-on')) { layer57= map.data('mapQuery').layers({label: '2.20_gravity_free_air',type:'tms',url: 'http://maps.eurogeosource.eu/mapproxy/tms/',layer:'dino_M12M0290_EPSG900913'}); $(this).data('layer',layer57) } else { $(this).data('layer').remove(); } } 
else if(id == 'layer58') { $(this).toggleClass('layer-on').toggleClass('layer-off');           var layer58; if($(this).hasClass('layer-on')) { layer58= map.data('mapQuery').layers({label: '2.21_gravity_res1',type:'tms',url: 'http://maps.eurogeosource.eu/mapproxy/tms/',layer:'dino_M12M0291_EPSG900913'}); $(this).data('layer',layer58) } else { $(this).data('layer').remove(); } } 
else if(id == 'layer59') { $(this).toggleClass('layer-on').toggleClass('layer-off');           var layer59; if($(this).hasClass('layer-on')) { layer59= map.data('mapQuery').layers({label: '2.22_gravity_res2',type:'tms',url: 'http://maps.eurogeosource.eu/mapproxy/tms/',layer:'dino_M12M0292_EPSG900913'}); $(this).data('layer',layer59) } else { $(this).data('layer').remove(); } } 
else if(id == 'layer60') { $(this).toggleClass('layer-on').toggleClass('layer-off');           var layer60; if($(this).hasClass('layer-on')) { layer60= map.data('mapQuery').layers({label: '2.23_magn_field',type:'tms',url: 'http://maps.eurogeosource.eu/mapproxy/tms/',layer:'dino_M12M0270_EPSG900913'}); $(this).data('layer',layer60) } else { $(this).data('layer').remove(); } } 
else if(id == 'layer61') { $(this).toggleClass('layer-on').toggleClass('layer-off');           var layer61; if($(this).hasClass('layer-on')) { layer61= map.data('mapQuery').layers({label: '2.24_magn_field_reduced',type:'tms',url: 'http://maps.eurogeosource.eu/mapproxy/tms/',layer:'dino_M12M0271_EPSG900913'}); $(this).data('layer',layer61) } else { $(this).data('layer').remove(); } } 
else if(id == 'layer62') { $(this).toggleClass('layer-on').toggleClass('layer-off');           var layer62; if($(this).hasClass('layer-on')) { layer62= map.data('mapQuery').layers({label: '2.25_magn_field_pseudo',type:'tms',url: 'http://maps.eurogeosource.eu/mapproxy/tms/',layer:'dino_M12M0293_EPSG900913'}); $(this).data('layer',layer62) } else { $(this).data('layer').remove(); } } 
else if(id == 'layer63') { $(this).toggleClass('layer-on').toggleClass('layer-off');           var layer63; if($(this).hasClass('layer-on')) { layer63= map.data('mapQuery').layers({label: '2.26_geoth_heatflow',type:'tms',url: 'http://maps.eurogeosource.eu/mapproxy/tms/',layer:'dino_M12M0272_EPSG900913'}); $(this).data('layer',layer63) } else { $(this).data('layer').remove(); } } 
else if(id == 'layer64') { $(this).toggleClass('layer-on').toggleClass('layer-off');           var layer64; if($(this).hasClass('layer-on')) { layer64= map.data('mapQuery').layers({label: '2.27_geoth_temp_level_1000m',type:'tms',url: 'http://maps.eurogeosource.eu/mapproxy/tms/',layer:'dino_M12M0273_EPSG900913'}); $(this).data('layer',layer64) } else { $(this).data('layer').remove(); } } 
else if(id == 'layer65') { $(this).toggleClass('layer-on').toggleClass('layer-off');           var layer65; if($(this).hasClass('layer-on')) { layer65= map.data('mapQuery').layers({label: '2.28_geoth_temp_level_2000m',type:'tms',url: 'http://maps.eurogeosource.eu/mapproxy/tms/',layer:'dino_M12M0274_EPSG900913'}); $(this).data('layer',layer65) } else { $(this).data('layer').remove(); } } 
else if(id == 'layer66') { $(this).toggleClass('layer-on').toggleClass('layer-off');           var layer66; if($(this).hasClass('layer-on')) { layer66= map.data('mapQuery').layers({label: '2.29_geoth_temp_level_3000m',type:'tms',url: 'http://maps.eurogeosource.eu/mapproxy/tms/',layer:'dino_M12M0275_EPSG900913'}); $(this).data('layer',layer66) } else { $(this).data('layer').remove(); } } 
else if(id == 'layer67') { $(this).toggleClass('layer-on').toggleClass('layer-off');           var layer67; if($(this).hasClass('layer-on')) { layer67= map.data('mapQuery').layers({label: '3.11_ze_tect',type:'tms',url: 'http://maps.eurogeosource.eu/mapproxy/tms/',layer:'dino_M12M0276_EPSG900913'}); $(this).data('layer',layer67) } else { $(this).data('layer').remove(); } } 
else if(id == 'layer68') { $(this).toggleClass('layer-on').toggleClass('layer-off');           var layer68; if($(this).hasClass('layer-on')) { layer68= map.data('mapQuery').layers({label: '3.13a_ltr_tect',type:'tms',url: 'http://maps.eurogeosource.eu/mapproxy/tms/',layer:'dino_M12M0277_EPSG900913'}); $(this).data('layer',layer68) } else { $(this).data('layer').remove(); } } 
else if(id == 'layer69') { $(this).toggleClass('layer-on').toggleClass('layer-off');           var layer69; if($(this).hasClass('layer-on')) { layer69= map.data('mapQuery').layers({label: '3.13b_mtr_tect',type:'tms',url: 'http://maps.eurogeosource.eu/mapproxy/tms/',layer:'dino_M12M0278_EPSG900913'}); $(this).data('layer',layer69) } else { $(this).data('layer').remove(); } } 
else if(id == 'layer70') { $(this).toggleClass('layer-on').toggleClass('layer-off');           var layer70; if($(this).hasClass('layer-on')) { layer70= map.data('mapQuery').layers({label: '3.15_utr_tect',type:'tms',url: 'http://maps.eurogeosource.eu/mapproxy/tms/',layer:'dino_M12M0279_EPSG900913'}); $(this).data('layer',layer70) } else { $(this).data('layer').remove(); } } 
else if(id == 'layer71') { $(this).toggleClass('layer-on').toggleClass('layer-off');           var layer71; if($(this).hasClass('layer-on')) { layer71= map.data('mapQuery').layers({label: '3.17_lju_tect',type:'tms',url: 'http://maps.eurogeosource.eu/mapproxy/tms/',layer:'dino_M12M0280_EPSG900913'}); $(this).data('layer',layer71) } else { $(this).data('layer').remove(); } } 
else if(id == 'layer72') { $(this).toggleClass('layer-on').toggleClass('layer-off');           var layer72; if($(this).hasClass('layer-on')) { layer72= map.data('mapQuery').layers({label: '3.19a_uju_lcr_kim_tect',type:'tms',url: 'http://maps.eurogeosource.eu/mapproxy/tms/',layer:'dino_M12M0281_EPSG900913'}); $(this).data('layer',layer72) } else { $(this).data('layer').remove(); } } 
else if(id == 'layer73') { $(this).toggleClass('layer-on').toggleClass('layer-off');           var layer73; if($(this).hasClass('layer-on')) { layer73= map.data('mapQuery').layers({label: '3.19b_uju_lcr_haut_tect',type:'tms',url: 'http://maps.eurogeosource.eu/mapproxy/tms/',layer:'dino_M12M0282_EPSG900913'}); $(this).data('layer',layer73) } else { $(this).data('layer').remove(); } } 
else if(id == 'layer74') { $(this).toggleClass('layer-on').toggleClass('layer-off');           var layer74; if($(this).hasClass('layer-on')) { layer74= map.data('mapQuery').layers({label: '3.21_ucr_tect',type:'tms',url: 'http://maps.eurogeosource.eu/mapproxy/tms/',layer:'dino_M12M0283_EPSG900913'}); $(this).data('layer',layer74) } else { $(this).data('layer').remove(); } } 
else if(id == 'layer75') { $(this).toggleClass('layer-on').toggleClass('layer-off');           var layer75; if($(this).hasClass('layer-on')) { layer75= map.data('mapQuery').layers({label: '3.25_cen_palaeo_tect',type:'tms',url: 'http://maps.eurogeosource.eu/mapproxy/tms/',layer:'dino_M12M0284_EPSG900913'}); $(this).data('layer',layer75) } else { $(this).data('layer').remove(); } } 
else if(id == 'layer76') { $(this).toggleClass('layer-on').toggleClass('layer-off');           var layer76; if($(this).hasClass('layer-on')) { layer76= map.data('mapQuery').layers({label: '3.26_cen_mio_tect',type:'tms',url: 'http://maps.eurogeosource.eu/mapproxy/tms/',layer:'dino_M12M0285_EPSG900913'}); $(this).data('layer',layer76) } else { $(this).data('layer').remove(); } } 
else if(id == 'layer77') { $(this).toggleClass('layer-on').toggleClass('layer-off');           var layer77; if($(this).hasClass('layer-on')) { layer77= map.data('mapQuery').layers({label: '3.3_laurussia',type:'tms',url: 'http://maps.eurogeosource.eu/mapproxy/tms/',layer:'dino_M12M0286_EPSG900913'}); $(this).data('layer',layer77) } else { $(this).data('layer').remove(); } } 
else if(id == 'layer78') { $(this).toggleClass('layer-on').toggleClass('layer-off');           var layer78; if($(this).hasClass('layer-on')) { layer78= map.data('mapQuery').layers({label: '3.30_salt_tect',type:'tms',url: 'http://maps.eurogeosource.eu/mapproxy/tms/',layer:'dino_M12M0287_EPSG900913'}); $(this).data('layer',layer78) } else { $(this).data('layer').remove(); } } 
else if(id == 'layer79') { $(this).toggleClass('layer-on').toggleClass('layer-off');           var layer79; if($(this).hasClass('layer-on')) { layer79= map.data('mapQuery').layers({label: '3.31_regional_seismic',type:'tms',url: 'http://maps.eurogeosource.eu/mapproxy/tms/',layer:'dino_M12M0288_EPSG900913'}); $(this).data('layer',layer79) } else { $(this).data('layer').remove(); } } 
else if(id == 'layer80') { $(this).toggleClass('layer-on').toggleClass('layer-off');           var layer80; if($(this).hasClass('layer-on')) { layer80= map.data('mapQuery').layers({label: '3.5_pangea',type:'tms',url: 'http://maps.eurogeosource.eu/mapproxy/tms/',layer:'dino_M12M0289_EPSG900913'}); $(this).data('layer',layer80) } else { $(this).data('layer').remove(); } } 
else if(id == 'layer81') { $(this).toggleClass('layer-on').toggleClass('layer-off');           var layer81; if($(this).hasClass('layer-on')) { layer81= map.data('mapQuery').layers({label: '4.18_cambrian_s',type:'tms',url: 'http://maps.eurogeosource.eu/mapproxy/tms/',layer:'dino_M12M0294_EPSG900913'}); $(this).data('layer',layer81) } else { $(this).data('layer').remove(); } } 
else if(id == 'layer82') { $(this).toggleClass('layer-on').toggleClass('layer-off');           var layer82; if($(this).hasClass('layer-on')) { layer82= map.data('mapQuery').layers({label: '4.2_boreholes_outcrop_pre_devonian',type:'tms',url: 'http://maps.eurogeosource.eu/mapproxy/tms/',layer:'dino_M12M0295_EPSG900913'}); $(this).data('layer',layer82) } else { $(this).data('layer').remove(); } } 
else if(id == 'layer83') { $(this).toggleClass('layer-on').toggleClass('layer-off');           var layer83; if($(this).hasClass('layer-on')) { layer83= map.data('mapQuery').layers({label: '4.3_pre_devonian_d',type:'tms',url: 'http://maps.eurogeosource.eu/mapproxy/tms/',layer:'dino_M12M0296_EPSG900913'}); $(this).data('layer',layer83) } else { $(this).data('layer').remove(); } } 
else if(id == 'layer84') { $(this).toggleClass('layer-on').toggleClass('layer-off');           var layer84; if($(this).hasClass('layer-on')) { layer84= map.data('mapQuery').layers({label: '5.2_devonian_rocks',type:'tms',url: 'http://maps.eurogeosource.eu/mapproxy/tms/',layer:'dino_M12M0297_EPSG900913'}); $(this).data('layer',layer84) } else { $(this).data('layer').remove(); } } 
else if(id == 'layer85') { $(this).toggleClass('layer-on').toggleClass('layer-off');           var layer85; if($(this).hasClass('layer-on')) { layer85= map.data('mapQuery').layers({label: '6.18_namur_blackshale_s',type:'tms',url: 'http://maps.eurogeosource.eu/mapproxy/tms/',layer:'dino_M12M0298_EPSG900913'}); $(this).data('layer',layer85) } else { $(this).data('layer').remove(); } } 
else if(id == 'layer86') { $(this).toggleClass('layer-on').toggleClass('layer-off');           var layer86; if($(this).hasClass('layer-on')) { layer86= map.data('mapQuery').layers({label: '6.19_ca_maturity',type:'tms',url: 'http://maps.eurogeosource.eu/mapproxy/tms/',layer:'dino_M12M0299_EPSG900913'}); $(this).data('layer',layer86) } else { $(this).data('layer').remove(); } } 
else if(id == 'layer87') { $(this).toggleClass('layer-on').toggleClass('layer-off');           var layer87; if($(this).hasClass('layer-on')) { layer87= map.data('mapQuery').layers({label: '6.2_ca_tect',type:'tms',url: 'http://maps.eurogeosource.eu/mapproxy/tms/',layer:'dino_M12M0300_EPSG900913'}); $(this).data('layer',layer87) } else { $(this).data('layer').remove(); } } 
else if(id == 'layer88') { $(this).toggleClass('layer-on').toggleClass('layer-off');           var layer88; if($(this).hasClass('layer-on')) { layer88= map.data('mapQuery').layers({label: '6.4_perm_s',type:'tms',url: 'http://maps.eurogeosource.eu/mapproxy/tms/',layer:'dino_M12M0301_EPSG900913'}); $(this).data('layer',layer88) } else { $(this).data('layer').remove(); } } 
else if(id == 'layer89') { $(this).toggleClass('layer-on').toggleClass('layer-off');           var layer89; if($(this).hasClass('layer-on')) { layer89= map.data('mapQuery').layers({label: '6.20_ca_res',type:'tms',url: 'http://maps.eurogeosource.eu/mapproxy/tms/',layer:'dino_M12M0302_EPSG900913'}); $(this).data('layer',layer89) } else { $(this).data('layer').remove(); } } 
else if(id == 'layer90') { $(this).toggleClass('layer-on').toggleClass('layer-off');           var layer90; if($(this).hasClass('layer-on')) { layer90= map.data('mapQuery').layers({label: '7.2_ro_d',type:'tms',url: 'http://maps.eurogeosource.eu/mapproxy/tms/',layer:'dino_M12M0303_EPSG900913'}); $(this).data('layer',layer90) } else { $(this).data('layer').remove(); } } 
else if(id == 'layer91') { $(this).toggleClass('layer-on').toggleClass('layer-off');           var layer91; if($(this).hasClass('layer-on')) { layer91= map.data('mapQuery').layers({label: '7.20_lsl_Res_Fac',type:'tms',url: 'http://maps.eurogeosource.eu/mapproxy/tms/',layer:'dino_M12M0304_EPSG900913'}); $(this).data('layer',layer91) } else { $(this).data('layer').remove(); } } 
else if(id == 'layer92') { $(this).toggleClass('layer-on').toggleClass('layer-off');           var layer92; if($(this).hasClass('layer-on')) { layer92= map.data('mapQuery').layers({label: '7.21_usl_Res_Fac',type:'tms',url: 'http://maps.eurogeosource.eu/mapproxy/tms/',layer:'dino_M12M0305_EPSG900913'}); $(this).data('layer',layer92) } else { $(this).data('layer').remove(); } } 
else if(id == 'layer93') { $(this).toggleClass('layer-on').toggleClass('layer-off');           var layer93; if($(this).hasClass('layer-on')) { layer93= map.data('mapQuery').layers({label: '7.3_ro_t',type:'tms',url: 'http://maps.eurogeosource.eu/mapproxy/tms/',layer:'dino_M12M0306_EPSG900913'}); $(this).data('layer',layer93) } else { $(this).data('layer').remove(); } } 
else if(id == 'layer94') { $(this).toggleClass('layer-on').toggleClass('layer-off');           var layer94; if($(this).hasClass('layer-on')) { layer94= map.data('mapQuery').layers({label: '8.18a_lze_stassfurt_Res_Fac',type:'tms',url: 'http://maps.eurogeosource.eu/mapproxy/tms/',layer:'dino_M12M0307_EPSG900913'}); $(this).data('layer',layer94) } else { $(this).data('layer').remove(); } } 
else if(id == 'layer95') { $(this).toggleClass('layer-on').toggleClass('layer-off');           var layer95; if($(this).hasClass('layer-on')) { layer95= map.data('mapQuery').layers({label: '8.2_ze_d',type:'tms',url: 'http://maps.eurogeosource.eu/mapproxy/tms/',layer:'dino_M12M0308_EPSG900913'}); $(this).data('layer',layer95) } else { $(this).data('layer').remove(); } } 
else if(id == 'layer96') { $(this).toggleClass('layer-on').toggleClass('layer-off');           var layer96; if($(this).hasClass('layer-on')) { layer96= map.data('mapQuery').layers({label: '8.3_ze_t',type:'tms',url: 'http://maps.eurogeosource.eu/mapproxy/tms/',layer:'dino_M12M0309_EPSG900913'}); $(this).data('layer',layer96) } else { $(this).data('layer').remove(); } } 
else if(id == 'layer97') { $(this).toggleClass('layer-on').toggleClass('layer-off');           var layer97; if($(this).hasClass('layer-on')) { layer97= map.data('mapQuery').layers({label: '9.11_ltr_pres_day',type:'tms',url: 'http://maps.eurogeosource.eu/mapproxy/tms/',layer:'dino_M12M0310_EPSG900913'}); $(this).data('layer',layer97) } else { $(this).data('layer').remove(); } } 
else if(id == 'layer98') { $(this).toggleClass('layer-on').toggleClass('layer-off');           var layer98; if($(this).hasClass('layer-on')) { layer98= map.data('mapQuery').layers({label: '9.2_ltr_d',type:'tms',url: 'http://maps.eurogeosource.eu/mapproxy/tms/',layer:'dino_M12M0311_EPSG900913'}); $(this).data('layer',layer98) } else { $(this).data('layer').remove(); } } 
else if(id == 'layer99') { $(this).toggleClass('layer-on').toggleClass('layer-off');           var layer99; if($(this).hasClass('layer-on')) { layer99= map.data('mapQuery').layers({label: '9.3_ltr_t',type:'tms',url: 'http://maps.eurogeosource.eu/mapproxy/tms/',layer:'dino_M12M0312_EPSG900913'}); $(this).data('layer',layer99) } else { $(this).data('layer').remove(); } } 
else if(id == 'layer100') { $(this).toggleClass('layer-on').toggleClass('layer-off');           var layer100; if($(this).hasClass('layer-on')) { layer100= map.data('mapQuery').layers({label: '9.4_mtr_d',type:'tms',url: 'http://maps.eurogeosource.eu/mapproxy/tms/',layer:'dino_M12M0313_EPSG900913'}); $(this).data('layer',layer100) } else { $(this).data('layer').remove(); } } 
else if(id == 'layer101') { $(this).toggleClass('layer-on').toggleClass('layer-off');           var layer101; if($(this).hasClass('layer-on')) { layer101= map.data('mapQuery').layers({label: '9.5_mtr_t',type:'tms',url: 'http://maps.eurogeosource.eu/mapproxy/tms/',layer:'dino_M12M0314_EPSG900913'}); $(this).data('layer',layer101) } else { $(this).data('layer').remove(); } } 
else if(id == 'layer102') { $(this).toggleClass('layer-on').toggleClass('layer-off');           var layer102; if($(this).hasClass('layer-on')) { layer102= map.data('mapQuery').layers({label: '9.6_utr_d',type:'tms',url: 'http://maps.eurogeosource.eu/mapproxy/tms/',layer:'dino_M12M0315_EPSG900913'}); $(this).data('layer',layer102) } else { $(this).data('layer').remove(); } } 
else if(id == 'layer103') { $(this).toggleClass('layer-on').toggleClass('layer-off');           var layer103; if($(this).hasClass('layer-on')) { layer103= map.data('mapQuery').layers({label: '9.7_utr_t',type:'tms',url: 'http://maps.eurogeosource.eu/mapproxy/tms/',layer:'dino_M12M0316_EPSG900913'}); $(this).data('layer',layer103) } else { $(this).data('layer').remove(); } } 

      return false;
  });
  
  


});
