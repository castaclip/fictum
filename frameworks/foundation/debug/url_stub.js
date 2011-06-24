sc_require('debug/response_types/dynamic_response');
sc_require('debug/response_types/static_response');
sc_require('debug/url_types/string_url');
sc_require('debug/url_types/regular_expression_url');

Fictum.UrlStub = SC.Object.extend({
  init: function(attributes) {
    sc_super();

    this._setupUrl();
    this._setupResponse();
  },
  
  method: function() {
    return this.get('options').method;
  }.property('options').cacheable(),
  
  status: function() {
    return this.get('options').status;
  }.property('options').cacheable(),

  matchesUrl: function(url, method) {
    return this.get('url').matches(url, method);
  },

  getResponse: function(store, options) {
    var response = this.get('response').value(store, options.request);
    if(options && options.json) response = jQuery.parseJSON(response);
    return SC.Response.create({body: response, status: this.get('status')});
  },

  _setupUrl: function() {
    var url = this.get('url');
    var method = this.get('method');
    
    if(SC.typeOf(url) == 'string') 
      this.set('url', Fictum.StringUrl.create({url: url, method: method}));
    else
      this.set('url', Fictum.RegularExpressionUrl.create({url: url, method: method}));
  },

  _setupResponse: function() {
    var response = this.get('response');
    if(SC.typeOf(response) == 'function')
      this.set('response', Fictum.DynamicResponse.create({response: response}));
    else
      this.set('response', Fictum.StaticResponse.create({response: response}));
  }
});

