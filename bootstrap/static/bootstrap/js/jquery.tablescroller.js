(function($, undefined) {
  // Get the scrollbar width...
  var div = document.createElement('div');
  document.body.appendChild(div);
  $(div).css({
    width: '100px',
    height: '100px',
    overflow: 'scroll',
    position: 'absolute',
    top: '-999px'
  });
  var Y_SCROLLBAR_WIDTH = div.offsetWidth - div.clientWidth;
  var X_SCROLLBAR_WIDTH = div.offsetHeight - div.clientHeight;
  document.body.removeChild(div);
  
  var resizeHandler = function resizeHandler(table, height) {
    return function(evt){
      var widths;
      var $table = $(table);
      var $thead = $table.find('thead');
      var $tbody = $table.find('tbody');
      var $tfoot = $table.find('tfoot');
      
      var body_will_scroll;
      
      var $cells = $table.find('td, th');
      
      if (!height) {
        height = "250px";
      }
      
      // Before we can get the sizes, we need to reset the display method to
      // the standard types: this means the browser will automatically
      // calculate the widths for us.
      $thead.css({display: 'table-header-group'});
      $tbody.css({display: 'table-row-group'});
      $tfoot.css({display: 'table-footer-group'});
      
      body_will_scroll = $tbody.height() > parseInt(height, 10);
      
      // Now we can get the widths.
      widths = $.map($cells, function(x){ return $(x).width();});
    
      // Now change the display type for all three table parts to block.
      $thead.css({display: 'block', 'border-bottom-width': '1px', 'border-bottom-style': 'solid'});
      // TODO: Figure out how to not have the double border.
      $tbody.css({display: 'block', 'overflow-x':'hidden', 'overflow-y': 'auto', 'max-height': height});
      $tfoot.css({display: 'block'});
      
      $.each($cells, function(i, el){ 
        $(el).width(widths[i]);
      });
      
      // If $tbody will show scrollbars, and the scrollbars have width,
      // then we need to reduce the width of the last column by that value.
      if (Y_SCROLLBAR_WIDTH && body_will_scroll) {
      $.each($tbody.find('tr'), function(i, row) {
          var $cell = $(row).find('th,td').last()
          $cell.width($cell.width() - Y_SCROLLBAR_WIDTH);
        });
      }
    };
  };

  var tablescroller = function(height) {
    return this.each(function() {
      var handler = resizeHandler(this, height);
      $(window).on('resize', handler);
      handler();
    });
  };
  
  $.fn.tablescroller = tablescroller;
  
})(jQuery);