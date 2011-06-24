sc_require('debug/url_types/base');

Fictum.RegularExpressionUrl = Fictum.Url.extend({
  matches: function(url, method) {
    if (this.get('method')) {
      return (url.match(this.get('url')) !== null && this.get('method') == method)
    } else {
      return url.match(this.get('url')) !== null;
    }
  }
});
