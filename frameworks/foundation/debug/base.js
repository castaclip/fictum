Fictum = {
  setup: function() {
    this.server = Fictum.Server.create(); 
    if(this.originalSendFunction === undefined)
      this.startInterceptingRequests();
  },

  teardown: function() {
    if(this.originalSendFunction !== undefined)
      this.stopInterceptingRequests();
    this.server.destroy();
    this.server = undefined;
  },

  isARegisteredUrl: function(url, method) {
    this._ensureServerIsSetup();
    return this.server.isARegisteredUrl(url, method);
  },

  registerUrl: function(url, response, options) {
    this._ensureServerIsSetup();
    this.server.registerUrl(url, response, options);
  },

  responseFor: function(url, options) {
    this._ensureServerIsSetup();
    return this.server.responseFor(url, options);
  },

  addResourceType: function(type, defaultAttributes) {
    this._ensureServerIsSetup();
    this.server.addResourceType(type, defaultAttributes);
  },

  addResource: function(type, attributes) {
    this._ensureServerIsSetup();
    return this.server.addResource(type, attributes);
  },

  startInterceptingRequests: function() {
    if(Fictum.originalSendFunction != undefined)
      throw new Error('ERROR: Already intercepting requests');
    Fictum.originalSendFunction = SC.Request.prototype.send;

    SC.Request.reopen({
      send: function(original, context) {
        this.set("body", context);

        if(Fictum.isARegisteredUrl(this.get('address'), this.get("type"))) {
          var response = Fictum.responseFor(this.get('address'), {json: this.get('isJSON'), request: this});
          response.set('request', this);
          async = this.get("isAsynchronous");
          if (async) {
            setTimeout(function() {
              if (!response.get('status')) {
                response.set('status', 200);
              }

              if ((response.get('status') < 200) || (response.get('status') >= 300)) {
                  try {
                      msg = this.statusText || '';
                  } catch(e2) {
                      msg = '';
                  }

                  error = SC.$error(msg || "HTTP Request failed", "Request", response.get('status')) ;
                  error.set("errorValue", this) ;
                  response.set('isError', YES);
                  response.set('errorObject', error);
              }

              response.notify();
            }, 1);
          } else {
            if (!response.get('status')) {
              response.set('status', 200);
              response.set('isError', YES);
            }
            response.notify();
          } 
          return response;
        } else {
          return original(context);
        }
      }.enhance()
    });
  },

  stopInterceptingRequests: function() {
    if(Fictum.originalSendFunction === undefined)
      throw new Error('ERROR: Not currently intercepting requests');
    SC.Request.reopen({
      send: Fictum.originalSendFunction
    });
    Fictum.originalSendFunction = undefined;
  },

  _ensureServerIsSetup: function() {
    if(this.server === undefined)
      throw new Error('ERROR: Server has not yet been setup');
  }
};
