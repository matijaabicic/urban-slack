function qs(search_for) {
  var query = window.location.search.substring(1);
  var parms = query.split('&');
  for (var i=0; i<parms.length; i++) {
      var pos = parms[i].indexOf('=');
      if (pos > 0  && search_for == parms[i].substring(0,pos)) {
        return parms[i].substring(pos+1);
      }
    }
  return "";
}
