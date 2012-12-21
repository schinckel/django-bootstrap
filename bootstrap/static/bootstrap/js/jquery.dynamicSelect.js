/*

Dynamic multiple-select widget. a-la django's admin. But for bootstrap.

turns:

  <select multiple=multiple name="name" id="id">...</select>

into:

  <div class="selector">
    <div style="display: none;">
      <select multiple=multiple name="name" id="id">...</select>
    </div>
    <div class="selector-available">
      <p class="label label-info selector-header">Available choices</p>
      <p class="selector-filter">
        <label>
          <i class="icon-search"></i>
          <input type="search">
        </label>
      </p>
      <select multiple="multiple" class="filtered" size="10">
        <option>One</option>
        <option>Two</option>
      </select>
      <a href="#" class="selector-choose-all">
        <i class="icon-circle-arrow-right"></i>
        Choose all
      </a>
    </div>
    <ul class="selector-chooser">
      <li><a href="#" class="selector-add"><i class="icon-circle-arrow-right"></i></a></li>
      <li><a href="#" class="selector-remove"><i class="icon-circle-arrow-left"></i></a></li>
    </ul>
    <div class="selector-chosen">
      <p class="label selector-header">Chosen items</p>
      <p class="selector-info">
        Select choice(s) and click <i class="icon-circle-arrow-right"></i>
      </p>
      <select class="filtered" multiple size=10></select>
      <p class="selector-clear-all">
        <a href="#">
          <i class="icon-remove-sign"></i>
          Clear all
        </a>              
      </p>
    </div>
  </div>


*/

(function($, undefined) {
  var createSelector = function(element) {
    var $element = $(element);
    var $widget = $('<div class="selector"><div class="selector-available"><p class="label label-info selector-header">Available choices</p><p class="selector-filter"><label><i class="icon-search"></i><input type="search"></label></p><select multiple="multiple" class="filtered" size="10"></select><a href="#" class="selector-choose-all"><i class="icon-circle-arrow-right"></i>Choose all</a></div><ul class="selector-chooser"><li><a href="#" class="selector-add"><i class="icon-circle-arrow-right"></i></a></li><li><a href="#" class="selector-remove"><i class="icon-circle-arrow-left"></i></a></li></ul><div class="selector-chosen"><p class="label selector-header">Chosen items</p><p class="selector-info">Select choice(s) and click <i class="icon-circle-arrow-right"></i></p><select class="filtered" multiple size=10></select><p class="selector-clear-all"><a href="#"><i class="icon-remove-sign"></i>Clear all</a></p></div></div>');
    $widget.insertBefore($element);
    $element.appendTo($widget).hide();
    
    var allOptions = $element.find('option');
    var $available = $widget.find('.selector-available select');
    var $selected = $widget.find('.selector-chosen select');
    var $searchField = $widget.find('.selector-available input[type="search"]');
    
    $element.find(':not(:selected)').clone().appendTo($available);
    $element.find(':selected').clone().appendTo($selected).attr('selected', false);
    
    // Ensure the objects shown in the available list are _only_ those that
    // a) meet any search requirements.
    // b) are not already 'selected'.
    var filterAvailable = function() {
      var searchValue = $searchField.val();
      var selectedValue = $element.val() || [];
      
      $available.find('option').detach();
      allOptions.clone().appendTo($available).filter(function() {
        return selectedValue.indexOf(this.value) > -1 || !$(this).text().match(searchValue);
      }).detach();
    };
    
    // Set the value of the original element, as this is what would be sent
    // back to the server when a form is submitted.
    var setOriginalElementSelection = function() {
      $element.val($selected.find('option').map(function(){ return this.value; }));
      filterAvailable();
    };
    
    // Handlers for the various events. Should be pretty self-evident.
    
    var addSelection = function(evt) {
      evt.preventDefault();
      // Adds the selection from $available to the $selected.
      $available.find(':selected').appendTo($selected);
      setOriginalElementSelection();
    };
    
    var removeSelection = function(evt) {
      evt.preventDefault();
      // Remove the selected items from the selected column.
      $selected.find(':selected').appendTo($available);
      setOriginalElementSelection();
    };
    
    var addAll = function(evt) {
      evt.preventDefault();
      $available.find('option').appendTo($selected);
      setOriginalElementSelection();
    };
    
    var removeAll = function(evt) {
      evt.preventDefault();
      $selected.find('option').appendTo($available);
      setOriginalElementSelection();
    };
    
    // Listen for events.
    $widget.find('input[type="search"]').keyup(filterAvailable);
    $widget.find('.selector-choose-all').click(addAll);
    $widget.find('.selector-clear-all').click(removeAll);
    $widget.find('.selector-add').click(addSelection);
    $available.dblclick(addSelection);
    $widget.find('.selector-remove').click(removeSelection);
    $selected.dblclick(removeSelection);
  };
  
  var dynamicSelect = function(settings) {
    return this.each(function() {
      createSelector(this);
    });
  };
  
  $.fn.dynamicSelect = dynamicSelect;

  // iPad/iPhone already have a decent multiple select widget.
  if (navigator.platform.match(/^iP/)) {
    $.fn.dynamicSelect = function() {};
  }
})(jQuery);