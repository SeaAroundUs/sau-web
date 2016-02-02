'use strict';

angular.module('sauWebApp')
  .factory('Keychain', function($document) {
    function Keychain (sequence, callback) {
      /**************
      * PRIVATE VARS
      **************/
      var thiss = this;
      var _enabled = true;
      var _currIndex = 0;

      /**************
      * PUBLIC VARS
      **************/

      /********************
      * PRIVALEGED METHODS
      ********************/
      this.sequence = function (val) {
        if (angular.isUndefined(val)) {
          return sequence;
        }
        sequence = val;
      };

      this.callback = function (val) {
        if (angular.isUndefined(val)) {
          return callback;
        }
        callback = val;
      };

      this.enabled = function (val) {
        if (angular.isUndefined(val)) {
          return _enabled;
        }
        _enabled = val;
      };

      this.destruct = function () {
        $document.off('keypress', handleKeypress);
      };

      /********************
      * PRIVATE METHODS
      ********************/
      function handleKeypress (event) {
        if (!thiss.enabled()) {
          return;
        }

        if (event.which === sequence.charCodeAt(_currIndex)) {
          _currIndex++;

          if (_currIndex === sequence.length) {
            callback();
            _currIndex = 0;
          }
        } else {
          _currIndex = 0;
        }
      }

      /********************
      * CONSTRUCTOR
      ********************/
      (function construct() {
        $document.on('keypress', handleKeypress);
      }());
    }

    return Keychain;
  });
