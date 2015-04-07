(function() {
  var cookies = {};
  var keyVals = document.cookie.split('; ');
  var cookie;
  var md;
  var modernBrowser;

  for(var i = 0; i < keyVals.length; i++) {
    cookie = keyVals[i].split('=');
    cookies[cookie[0]] = cookie[1];
  }

  md = new MobileDetect(window.navigator.userAgent);
  modernBrowser = md.match('chrome|firefox') || md.version('IE') >= 9;

  if (!modernBrowser && cookies['ignoreOldBrowser'] !== '1' && window.location.pathname !== '/simple-site.php') {
    window.location.pathname = '/simple-site.php';
  }
})();
