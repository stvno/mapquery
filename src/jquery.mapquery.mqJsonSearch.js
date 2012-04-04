/* Copyright (c) 2011 by MapQuery Contributors (see AUTHORS for
 * full list of contributors). Published under the MIT license.
 * See https://github.com/mapquery/mapquery/blob/master/LICENSE for the
 * full text of the license. */

(function($) {
$.template('mqJsonSearch',
    '<div class="mq-jsonsearch ui-widget ui-helper-clearfix ">'+
    '<form><input type="text" class="searchstring" size="${size}">'+
    '<input type="submit" class="searchbutton" value="${search}"></form>'+
    '<div class="result"></div>'+
    '</div>');

$.widget("mapQuery.mqJsonSearch", {
    options: {
        // The MapQuery instance
        map: undefined,
        
        // The URL returning the search result as JSON
        // TODO should url have search parameter ??
        url: 'http://mularroya15.cps.unizar.es:8080/DataProcessingService/services?Service=WPS&Request=Execute&Version=1.0.0&RawDataOutput=Output&Identifier=SearchResource&DataInputs=language=',
        // the size of the search field
        size: 20,
        // the value of the search button
        search: 'Search'

    },
    _create: function() {
        var map;
        var self = this;
        var element = this.element;
        
        //get the mapquery object
        map = $(this.options.map).data('mapQuery');

        $.tmpl('mqJsonSearch',{
            size:self.options.size,
            search:$.i18n.prop('btn_search')
        }).appendTo(element);

        element.addClass(' ui-widget ui-widget-content ' +
                              'ui-corner-all');
                              
        element.delegate('.searchbutton', 'click', function() {
            var searchterm = element.find('.searchstring').val();         
            self._search(searchterm);
            return false;
        });
        element.delegate('.commodity', 'click', function() {
            var comm = $(this).html();
            self._getCommodity(comm);
        });
    },
    _destroy: function() {
        this.element.removeClass(' ui-widget ui-helper-clearfix ' +
                                 'ui-corner-all')
            .empty();
    },
    _search: function(searchterm) {
        //search button click, get json with search string from url
        //list the result
        var element = this.element;
        var url = this.options.url + $.i18n.prop('txt_language') + ';search='+ searchterm+';id=1;jsoncallback=?';
        var id = {id:element[0].id};
        $.getJSON(url, id, function(data, element) {
            var elementid = this.data.split('=')[1];
            var commodities = [];
            var result;
            var text;
            if(data.results) {
                result = data.results;
                $.each(result, function(){
                    commodities.push('<li class="commodity">' + this.code + '</li>');
                });
                $('#'+elementid).find('.result').empty();
                text = $('<ul/>', {
                    'class': 'my-new-list',
                    html: commodities.join('')
                });
                if(data.results.length==0)
                text= $.i18n.prop('txt_noresult');
            }
            else {
                text = 'No result';
            }
            
           
            $('#'+elementid).find('.result').append(text);

        });
    },
    _getCommodity: function(value) {
       // var jqxhr = $.getJSON("http://eurogeosource.geodan.nl/OneGeologyServlet/JSONRetreiver?jsoncallback=?",
       var url = 'http://mularroya15.cps.unizar.es:8080/DataProcessingService/services?Service=WPS&Request=Execute&Version=1.0.0&RawDataOutput=Output&Identifier=GetInfoForResource&DataInputs=language='+$.i18n.prop('txt_language')+';resource='+value+';jsoncallback=?';
       var id = {resource:value};
       $.getJSON(url,  function(data,element) {           
            $('#map').data('mapQuery').commodities(data.results);
       });
    }
    
});
})(jQuery);
