/* Copyright (c) 2011 by MapQuery Contributors (see AUTHORS for
 * full list of contributors). Published under the MIT license.
 * See https://github.com/mapquery/mapquery/blob/master/LICENSE for the
 * full text of the license. */

(function($) {
$.template('mqJsonSearch',
    '<div class="mq-jsonsearch ui-widget ui-helper-clearfix ">'+
    '<form><input type="text" class="searchstring" size="${size}">'+
    '<input type="submit" class="searchbutton" value="${search}"></form>'+
    '<div class="results"></div>'+
    '</div>');

$.widget("mapQuery.mqJsonSearch", {
    options: {
        // The MapQuery instance
        map: undefined,
        
        // The URL returning the search results as JSON
        // TODO should url have search parameter ??
        url: 'http://localhost/2011/search.json?',
        // function to use when clicking on a result-item 
        onclick: undefined,
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
            search:self.options.search,
        }).appendTo(element);

        element.addClass('ui-dialog ui-widget ui-widget-content ' +
                              'ui-corner-all');
                              
        element.delegate('.searchbutton', 'click', function() {
            var searchterm = element.find('.searchstring').val();         
            self._search(searchterm);
        });
    },
    _destroy: function() {
        this.element.removeClass(' ui-widget ui-helper-clearfix ' +
                                 'ui-corner-all')
            .empty();
    },
    _search: function(searchterm) {
        //search button click, get json with search string from url
        //list the results
        var element = this.element;
        var url = this.options.url + searchterm;
        var id = {id:element[0].id};
        $.getJSON(url, id, function(data, element) {
            var elementid = this.data.split('=')[1];
            var commodities = [];
            var result;
            var text;
            if(data.results) {
                result = data.results;
                $.each(result, function(){
                    commodities.push('<li class="commodity">' + this.commodity + '</li>');
                });
                $('#'+elementid).find('.results').empty();
                text = $('<ul/>', {
                    'class': 'my-new-list',
                    html: commodities.join('')
                });
            }
            else {
                text = 'No results';
            }
            
           
            $('#'+elementid).find('.results').append(text);

        });
    },
    _parseResult: function(result) {
        
    }
    
});
})(jQuery);
