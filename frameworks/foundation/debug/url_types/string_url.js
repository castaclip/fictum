sc_require('debug/url_types/base');

Fictum.StringUrl = Fictum.Url.extend({
  matches: function(url, method) {
    if (this.get('method')) {
      return (this.get('url') == url && this.get('method') == method)
    } else {
      return this.get('url') == url;
    }
  }
});
