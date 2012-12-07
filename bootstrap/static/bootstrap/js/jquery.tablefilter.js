/* 

Filter types:
  
  'search'
  

*/
(function($, undefined) {
  var tablefilter = function(settings) {
    return this.each(function() {
      var $table = $(this);
      var $rows = $table.find('tbody tr');
      var filters = $table.data('filters');
      
      // If we don't have an attached 'filters' block, then
      // we will need to create it, and add it to the page.
      if (!filters) {
        $table.data('filters', []);
        filters = $table.data('filters');
        // Create a function that will apply all filters.
        filters.applyFilters = function applyFilters() {
          $rows.show();
          $rows.each(function(i, row) {
            $.each(filters, function(j, func) {
              if (!func(row)) {
                $(row).hide();
              }
            });
          });
        }
        
        filters.elements = $('<div class="table-filters"></div>').insertBefore($table);
      }
      
      // Simplest type of filter: a global search: will filter
      // only on visible data (uses .innerText)
      if (settings === 'search') {
        var searchTerm = "";
        var $element = $('<input type="search" class="search-query">');
        filters.elements.append($element);
        $element.keyup(function() {
          searchTerm = new RegExp($element.val(), 'i');
          filters.applyFilters();
        });
        filters.push(function(row) {
          return !!row.innerText.match(searchTerm)
        });
      }
      
      // Search-based filter, which is only on a single column.
      if (settings.type == 'search') {
        var searchTerm = "";
        // TODO: Allow for a column name instead.
        var column = parseInt(settings.column, 10);
        
        var $headRows = $table.find('thead tr');
        var $element = $('<label>' + $($headRows[$headRows.length - 1]).find('th')[column].innerText + ' <input type="search" class="search-query"></label>');
        filters.elements.append($element);
        $element = $element.find('input');
        $element.keyup(function() {
          searchTerm = new RegExp($element.val(), 'i');
          filters.applyFilters();
        });
        filters.push(function(row) {
          return !!$(row).find('td')[column].innerText.match(searchTerm);
        });
      }
      
      
      // Select-based filter, on a single column.
      // Options will be values from that column: with <br> allowing us to have multiple values per row.
      // TODO: Allow for ul/li for multiple values.
      // Should we push the column up the stack so that the function takes a value+testValue?
      
      if (settings.type == 'select') {
        var searchTerm = "";
        var column = parseInt(settings.column, 10);
        
        var choices = settings.choices;
        
        if (!choices) {
          choices = {};
          $rows.each(function(i, row) {
            $.each(row.innerText.split('\t')[column].split('\n'), function(j, val) {
              choices[val] = val;
            });
          });
        };
        
        if (_.isArray(choices)) {
          // Turn it into a sorted list of {key:key, value:value}
          choices = _.map(choices, function(value, key) {
            return {key:key, value:value}
          }).sort();
        }
        
        var $element = "<select>";
        
        if (!settings.testFunction) {
          $element = $element + "<option value='___ANY___'>Any</option>";
        }
        $.each(choices, function(key, value) {
          $element = $element + "<option value='" + value + "'>" + key + "</option>"
        });
        if (!settings.testFunction) {
          $element = $element + "<option value=''>None</option>";
        }
        $element = $($element + "</select>");
        filters.elements.append($element);
        
        $element.change(function() {
          searchTerm = $element.val();
          filters.applyFilters();
        });
        
        // How to handle a function passed in?
        if (settings.testFunction) {
          filters.push(function(row){
            if (isNaN(column)) {
              return settings.testFunction(searchTerm, row);              
            } else {
              return settings.testFunction(searchTerm, $(row).find('td')[column].innerText);
            }
          });
        } else {
          filters.push(function(row) {
            if (searchTerm == '___ANY___') {
              return true;
            }
            var values = $(row).find('td')[column].innerText.split('\n');
            return values.indexOf(searchTerm) > -1;
          });
        }
      }
    });
        
  };
  
  $.fn.tablefilter = tablefilter;
  
})(jQuery);