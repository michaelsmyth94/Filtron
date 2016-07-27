/**
 * Filtron v1.0.0
 */
(function($) {
  /**
   * Create the Filtron plugin.
   */
  $.fn.filtron = function(settings) {
    /**
     * Set up some plugin-wide variables for later use.
     */
    var _, defaults;

    /**
     * Assign the current jQuery objects and the
     * plugins default settings.
     */
    _ = $(this);
    defaults = {
      debug: false,
      filterType: "OR",
      filterContainerClass: '.filter-container',
      filterItemClass: '.filter-item',
      filterTriggerClass: '.trigger-filter'
    };

    /**
     * Extend the default settings with the
     * user-passed settings.
     */
    $.extend(defaults, settings);

    /**
     * Find all of the filterable items within
     * the current Filtron instance.
     */
    _.filterableItems = $(_).find(defaults.filterItemClass);

    /**
     * Parse all the items and return the
     * items that match the queries.
     */
    _.getItems = function(queries, type) {
      /**
       * Setup the array of filtered items
       * to be returned.
       */
      var filteredItems = [];

      /**
       * Ensure that data for the function
       * is passed through.
       */
      queries = queries || ['*'];
      type = type || 'OR';
      type = type.toUpperCase();

      /**
       * Make sure that a valid filter type is present.
       */
      if (type !== 'OR' && type !== 'AND') {
        if (defaults.debug) {
          console.info('[Filtron]: "' + type + '" is not a valid filter type. Please use either "OR" or "AND". Defaulting to "' + defaults.filterType  + '".');
        }
        type = defaults.filterType;
      } else {
        if (defaults.debug) {
          console.info('[Filtron]: Filtering via "' + type + '" method.');
        }
      }

      /**
       * Make sure the user is passing through
       * an array. If not, convert the user
       * input to an array.
       */
      if (!$.isArray(queries)) {
        if (defaults.debug) {
          console.info('[Filtron]: "' + queries + '" is not an array. Please pass in an array of selectors to filter. Defaulting to ["' + queries + '"].');
        }
        queries = [queries];
      } else {
        if (defaults.debug) {
          console.info('[Filtron]: Filtering ["' + queries.join(', ') + '"].');
        }
      }

      /**
       * Loop through all items in the Filtron
       * instance and push the ones that match to
       * the array we created earlier.
       */
      _.filterableItems.each(function() {
        var __, addToArray, i, l;
        __ = $(this);

        if (type === 'OR') {
          addToArray = false;
          for (i = 0, l = queries.length; i < l; i++) {
            if (__.is(queries[i])) {
              addToArray = true;
            }
          }
        } else if (type === 'AND') {
          addToArray = true;
          for (i = 0, l = queries.length; i < l; i++) {
            if (!__.is(queries[i])) {
              addToArray = false;
            }
          }
        }

        if (addToArray) {
          filteredItems.push(__);
        }
      });

      /**
       * Return the jQuery collection of
       * filtered items.
       */
      return $(filteredItems);
    };

    /**
     * Process a collection of items.
     */
    _.process = function(items) {
      /**
       * Reset the classes on all filterable items
       * in the Filtron instance.
       */
      _.filterableItems.removeClass('filtered out');

      /**
       * Map through the items and add the
       * filtered class.
       */
      $(items).map(function() {
        $(this).addClass('filtered');
      });

      /**
       * Hide the items that haven't
       * passed the filter query.
       */
      _.hide(_.filterableItems.not($('.filtered')));
    };

    /**
     * Hide a collection of items.
     */
    _.hide = function(items) {
      $(items).addClass('out');
    };

    /**
     * Filter the items in this Filtron
     * instance, using an array of selectors
     * and a type to filter, either "OR" or "AND".
     */
    _.filter = function(queries, type) {
      _.process(_.getItems(queries, type));
    };

    /**
     * Bind a click event to the default filter
     * trigger class. This will trigger the
     * filter via clicking on a seelctor.
     */
    $(_).on('click', defaults.filterTriggerClass, function(event) {
      /**
       * Prevent the default click event.
       */
      event.preventDefault();

      /**
       * Set up some variables for later use.
       */
      var __, filters, filterContainer, activeFilters;

      /**
       * Assign which variables we can at this moment.
       */
      __ = $(this);
      filters = [];
      filterContainer = __.parents(defaults.filterContainerClass);

      /**
       * Check which behaviour is required, and
       * add/remove the active class where necessary.
       */
      if (filterContainer.data('select-multiple')) {
        __.toggleClass('active');
      } else {
        if (__.hasClass('active')) {
          filterContainer.find('.active').removeClass('active');
        } else {
          filterContainer.find('.active').removeClass('active');
          __.addClass('active');
        }
      }

      /**
       * Get all active filters inside of this
       * Filtron instance. We are getting all
       * so that multiple filters can be chained together
       * in the same instance.
       */
      activeFilters = $(_).find(defaults.filterTriggerClass + '.active');

      /**
       * Check if we have any active filters
       * in the current instance.
       */
      if (activeFilters.length) {
        /**
         * Loop through each active filter and
         * store the filter reference.
         */
        activeFilters.each(function() {
          filters.push($(this).data('filter'));
        });

        /**
         * Run our filter query.
         */
        _.filter(filters);
      } else {
        /**
         * Show all items if no active filters exist.
         */
        _.filter(['*']);
      }
    });

    /**
     * Return our Filtron instance.
     */
    return _;
  };
}(jQuery));