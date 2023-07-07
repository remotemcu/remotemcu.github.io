;(function($) {

  if(typeof(jQuery) == 'undefined') {
    console.warn('fuzzyComplete plugin requires jQuery');
    return;
  }

  if(typeof(Fuse) == 'undefined') {
    console.warn('fuzzyComplete plugin requires Fuse.js');
    return;
  }

  $.fn.fuzzyComplete = function(jsonData, options) {

    return this.each(function() {

      // Default options: search all keys, display and output the first one
      if(typeof options === 'undefined') {
        options = {
          display: Object.keys(jsonData[0])[0],
          key: Object.keys(jsonData[0])[0],
          resultsLimit: 4,
          allowFreeInput: false,
          fuseOptions:
            {
              keys: Object.keys(jsonData[0])
            }
        };
      }

      var f = new Fuse(jsonData, options.fuseOptions);
      var searchBox = $(this);
      var resultsBox = $('<div>').addClass('fuzzyResults');
      searchBox.after(resultsBox);
      var selectBox = $('<select>').hide();

      if (options.allowFreeInput !== true) {
        selectBox.attr('name', searchBox.attr('name'));
        searchBox.removeAttr('name');
      }
      searchBox.after(selectBox);

      var pos = searchBox.position();
      pos.left += parseInt(searchBox.css('marginLeft'), 10);
      pos.top += parseInt(searchBox.css('marginTop'), 10);
      resultsBox.css({
        'left': pos.left,
        'top': pos.top + searchBox.outerHeight(),
        'width': searchBox.outerWidth()
      });

      function selectCurrent() {
        if(resultsBox.children('.selected').length) {
          selectBox.val(resultsBox.children('.selected').first().data('id'));
          searchBox.val(resultsBox.children('.selected').first().data('displayValue'));
  
          selectBox.data('extraData', resultsBox.children('.selected').first().data('extraData'));
          searchBox.data('extraData', resultsBox.children('.selected').first().data('extraData'));
        }
      }

      searchBox.keydown(function(e) {
        switch(e.which) {
          case 13: // Enter
            e.preventDefault();
            resultsBox.hide();
            selectCurrent();
            return;
          case 9: // Tab
            resultsBox.hide();
            selectCurrent();
            return;
        }
      });

      searchBox.keyup(function(e) {
        switch(e.which) {
          case 38:  // up arrow
            var selitem = resultsBox.find('.selected').first();

            if(selitem.length) {
              selitem.removeClass('selected');
              if(selitem.prev().length)
                selitem.prev().addClass('selected');
              else
                resultsBox.children().last().addClass('selected');
            } else {
              resultsBox.children().last().addClass('selected');
            }
            selectCurrent();
            return;
          case 40: // down arrow
            var selitem = resultsBox.find('.selected').first();

            if(selitem.length) {
              selitem.removeClass('selected');
              if(selitem.next().length)
                selitem.next().addClass('selected');
              else
                resultsBox.children().first().addClass('selected');
            } else {
              resultsBox.children().first().addClass('selected');
            }
            selectCurrent();
            return;
          case 13: // Enter
            return;
        }

        var results = f.search($(this).val());

        resultsBox.empty();

        if(results.length === 0) {
          selectBox.val(null);
        }
/*
        var resultsRowFirst = $('<div>').addClass('__autoitem').addClass('customitem')
        .on('mousedown', function(e) {
          e.preventDefault(); // This prevents the element from being hidden by .blur before it's clicked
        })
        .click(function() {
          resultsBox.find('.selected').removeClass('selected');
          $(this).addClass('selected');
          selectCurrent();
          resultsBox.hide();
          window.checkArch();
        });

        resultsRowFirst.text($("#archPicker").val());
        resultsRowFirst.data('displayValue', $("#archPicker").val());
        resultsRowFirst.data('extraData', $("#archPicker").val());

        resultsBox.append(resultsRowFirst);

*/
        results.forEach(function(result, i) {
          if(i >= options.resultsLimit)
            return;

          if(i === 0)
            selectBox.val(result[options.key]);

          var resultsRow = $('<div>').addClass('__autoitem')
                             .on('mousedown', function(e) {
                               e.preventDefault(); // This prevents the element from being hidden by .blur before it's clicked
                             })
                             .click(function() {
                              $('#requestoffer').addClass('displaynone');
                               resultsBox.find('.selected').removeClass('selected');
                               $(this).addClass('selected');
                               selectCurrent();
                               resultsBox.hide();
                             });

          if (typeof options.key === 'function') {
            resultsRow.data('id',options.key(result,i));
          } else {
            resultsRow.data('id',result[options.key]);
          }
          if (typeof options.display === 'function') {
            resultsRow.html( options.display(result, i) );
          } else {
            resultsRow.text(result[options.display]);
          }
          if (typeof options.displayValue === 'function') {
            resultsRow.data('displayValue', options.displayValue(result, i));
          } else if (typeof options.displayValue === 'string') {
            resultsRow.data('displayValue', result[options.displayValue]);
          } else {
            resultsRow.data('displayValue', resultsRow.text());
          }
          if (typeof options.extraData === 'function') {
            resultsRow.data('extraData', options.extraData(result, i));
          } else if (typeof options.extraData === 'string') {
            resultsRow.data('extraData', result[options.extraData]);
          }

          resultsBox.append(resultsRow);
        });

        if(resultsBox.children().length) {
          resultsBox.show();
        //  resultsBox.children().first().next().addClass('selected');
        } else {
          resultsBox.hide();
        }
      });

      searchBox.blur(function() {
        resultsBox.hide();
      });

      searchBox.focus(function() {
        if(resultsBox.children().length) {
          resultsBox.show();
        }
      });

      selectBox.append($('<option>', {
        value: '',
        text: '(None Selected)'
      }));

      jsonData.forEach(function(entry, i) {
        var value;
        var text;
        if (typeof options.key === 'function') {
          value = options.key(entry,i);
        } else {
          value = entry[options.key];
        }
        if (typeof options.display === 'function') {
          text = options.display(entry, i);
        } else {
          text = entry[options.display];
        }
        selectBox.append($('<option>', {
          value: value,
          text: text
        }));

      });

      if(searchBox.val()) {
        searchBox.keyup();
        searchBox.blur();
      }

    });

  };

}(jQuery));
