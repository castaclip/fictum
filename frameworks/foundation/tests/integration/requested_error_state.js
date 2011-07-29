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

      describe('And I make an asynchronous request to that URL', function() {
          var request, response;
          beforeEach(function() {
            request = SC.Request.getUrl('/broken')
            request.set('isAsynchronous', true);
            response = request.send();
            waitsFor(function() {
                return response.get('status') !== -100;
            });
          });

          it('Then the response should be in an error state', function() {

          expect(response.get('body')).toEqual("You made response kitty cry!");
          expect(response.get('status')).toEqual(500);
          expect(response.get('isError')).toEqual(YES);
          expect(SC.ok(response)).toEqual(false);
          });
        });
      });

      describe('And I make an asynchronous request to that URL', function() {
          var request, response;
          beforeEach(function() {
            request = SC.Request.getUrl('/broken')
            request.set('isAsynchronous', false);
            response = request.send();
            waitsFor(function() {
                return response.get('status') !== -100;
            });
          });

          it('Then the response should be in an error state', function() {

          expect(response.get('body')).toEqual("You made response kitty cry!");
          expect(response.get('status')).toEqual(500);
          expect(response.get('isError')).toEqual(YES);
          expect(SC.ok(response)).toEqual(false);
          });
        });
      });
    });
  });
});
