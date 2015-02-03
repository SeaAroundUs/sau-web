'use strict';

describe('Controller: MainCtrl', function () {

  // load the controller's module
  beforeEach(module('sauWebApp'));

  var RootCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    RootCtrl = $controller('RootCtrl', {
      $scope: scope
    });
  }));

  it('should attach templates to scope', function () {
    expect(scope.templates.length).toBe(6);
  });
});
