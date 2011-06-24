sc_require('debug/url_stub');

Fictum.UrlStubCollection = SC.Object.extend({

  init: function() {
    this.set('urls', []);
  },

  hasUrl: function(url, method) {
    return this._findUrlStubByUrl(url, method) !== null; 
  },

  addUrl: function(url, stubValue, options) {
    this.get('urls').push(Fictum.UrlStub.create({url: url, response: stubValue, options: options}));
  },

  responseFor: function(url, resourceStore, options) {
    var urlStub = this._findUrlStubByUrl(url, options.request.get('type'));
    return urlStub === null ? undefined : urlStub.getResponse(resourceStore, options);
  },

  empty: function() {
    this.set('urls', []);
  },

  _findUrlStubByUrl: function(url, method) {
    return this.get('urls').find(function(stub) { return stub.matchesUrl(url, method) })
  },
});
