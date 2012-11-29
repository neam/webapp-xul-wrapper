require.config({
  shim: {
  },

  paths: {
    jquery: 'vendor/jquery.min'
  }
});
 
require(['app'], function(app) {
  $('#currentUrl').attr('href', window.location.href);
  $('#currentUrl').html(window.location.href)
});