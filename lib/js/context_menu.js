menu.append(
  new MenuItem({
    label: 'add chapter separetor',
    click: function() {
      $('#js-chapter-separate-btn').trigger('click');
    }
  })
);

menu.append(
  new MenuItem({
    label: 'add section separetor',
    click: function() {
      $('#js-section-separate-btn').trigger('click');
    }
  })
);

menu.append(new MenuItem({
  label: 'fragment',
  submenu: [
    {
      label: 'simple',
      click: function() {
        $('#js-fragment-btn').trigger('click');
      }
    },
    {
      label: 'grow',
      click: function() {
        $('#js-fragment-grow-btn').trigger('click');
      }
    },
    {
      label: 'shrink',
      click: function() {
        $('#js-fragment-shrink-btn').trigger('click');
      }
    },
    {
      label: 'fade-up',
      click: function() {
        $('#js-fragment-fade-up-btn').trigger('click');
      }
    },
    {
      label: 'fade-down',
      click: function() {
        $('#js-fragment-fade-down-btn').trigger('click');
      }
    },
    {
      label: 'fade-left',
      click: function() {
        $('#js-fragment-fade-left-btn').trigger('click');
      }
    },
    {
      label: 'fade-right',
      click: function() {
        $('#js-fragment-fade-right-btn').trigger('click');
      }
    },
    {
      label: 'fade-current-visible',
      click: function() {
        $('#js-fragment-current-visible-btn').trigger('click');
      }
    },
    {
      label: 'highlight-current-blue',
      click: function() {
        $('#js-fragment-highlight-current-blue-btn').trigger('click');
      }
    },
    {
      label: 'highlight-red',
      click: function() {
        $('#js-fragment-highlight-red-btn').trigger('click');
      }
    }
  ]
}));

menu.append(
  new MenuItem({
    label: 'preference',
    click: function() {
      open_preference_dialog();
    }
  })
);

