describe('Scenario: Requesting with a non 200 status code', function() {
  describe('Given I have setup Fictum', function() {
    beforeEach(function() {
      Fictum.setup();
    });

    afterEach(function() {
      Fictum.teardown();
    });

    describe('And a URL that I want to stub', function() {
      var url;
      beforeEach(function() {
        url = '/broken';
      });

      describe('When I register that URL with a non 200 status code', function() {
      beforeEach(function() {
          Fictum.registerUrl(url, "You made response kitty cry!", { status: 500 } );
      });

      describe('And I make a request to a url asking for JSON that matches the registered URL regular expression', function() {
          var request, response;
          beforeEach(function() {
          request = SC.Request.getUrl('/broken')
          response = request.send();
          waitsFor(function() {
              return response.get('status') !== -100;
          });
          });

          it('Then I should receive the registered response in JSON', function() {

          expect(response.get('body')).toEqual("You made response kitty cry!");
          expect(response.get('status')).toEqual(500);
          expect(response.get('isError')).toEqual(true);
          expect(SC.ok(response)).toEqual(false);
          });
        });
      });
    });
  });
});
