/*

TODO: Handle row data if the colspans are not 1.

This might mean we actually collect the widths for every cell.

*/

(function($, undefined) {
  var resizeHandler = function resizeHandler(table, height) {
    return function(evt){
      var widths;
      var $table = $(table);
      var $thead = $table.find('thead');
    
      var $headerCells = $thead.find('tr').last().find('td, th');
    
      var $tbody = $table.find('tbody');
      var $firstDataRow = $tbody.find('tr').first().find('td, th');
    
      var $tfoot = $table.find('tfoot');
      var $footerCells = $thead.find('tr').first().find('td, td');
      
      if (!height) {
        height = "250px";
      }
      
      // Before we can get the sizes, we need to reset the display method to
      // the standard types: this means the browser will automatically
      // calculate the widths for us.
      $thead.css({display: 'table-header-group'});
      $tbody.css({display: 'table-row-group'});
      $tfoot.css({display: 'table-footer-group'});
      
      // Now we can get the widths.
      widths = $.map($headerCells, function(x){ return $(x).width();});
    
      // Now change the display type for all three table parts to block.
      $thead.css({display: 'block'});
      $tbody.css({display: 'block', overflow: 'auto', height: height});
      $tfoot.css({display: 'block'});
      
      // Now apply the widths to the cells.
      $.each(widths, function(i, width) {
        $($headerCells[i]).width(width);
        $($firstDataRow[i]).width(width);
        $($footerCells[i]).width(width);
      });
    }
  };

  var tablescroller = function() {
    return this.each(function() {
      var handler = resizeHandler(this);
      $(window).on('resize', handler);
      handler();
    });
  }
  
  $.fn.tablescroller = tablescroller;
  
})(jQuery);
