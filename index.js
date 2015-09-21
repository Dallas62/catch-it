
;(function () {
    'use strict';

    var exports = this;

    // Define private variables
    var extra, onErrorCallback;
 
    // Function to call
    function callErrorCallback(error) {

        // Check if there is a callback for the error
        if(typeof onErrorCallback === 'function') {
            onErrorCallback(error, extra);
        }
    }

    // Define the wrapper of a function
    function errorWrapper(func) {

        // Return the wrapped function
        return function() {
            var args = Array.prototype.slice.call(arguments);

            try
            {
                func.apply(null, args);
            }
            catch(error)
            {
                // Follow the error
                callErrorCallback(error);
            }
        }
    }

    // Extract an error from .onerror handler
    function onErrorExtractor(msg, url, line, col, error) {

        // Extract error
        var error = error || new Error(msg, url, line);    

        // Follow the error
        callErrorCallback(error);
    }

    // Replace function by wrapping it
    function replaceFunctionByWrap(context, functionName, handler) {
        var original    = context[functionName],
            replacement = handler(original);

        // Replace the original function
        context[functionName] = replacement;
    }

    // Replacement for time based function
    function timeBasedReplacement(original) {
         
        return function(func, time) {
            if (typeof func === 'function') {
                // wrap the function 
                func = errorWrapper(func);

                // Extract extra aguments
                var args = Array.prototype.slice.call(arguments, 2);
                
                // Return the modified function
                return original(function() {

                    // Apply argument
                    func.apply(this, args);
                }, time);
            } else {
                // Return the original function
                return original(func, time);
            }
        };
    }

    // Declare CatchIt
    function CatchIt(options) {

        // Store options
        extra = options;

        // Add a global listener to window
        if(typeof exports !== 'undefined') {
            exports.onerror = onErrorExtractor;
        }

        // Replace common function
        replaceFunctionByWrap(exports, 'setTimeout',  timeBasedReplacement);
        replaceFunctionByWrap(exports, 'setInterval', timeBasedReplacement);

        // Informations about CatchIt
        this.REPOSITORY = 'https://github.com/Dallas62/catch-it';
        this.COPYRIGHT  = 'Tacyniak Boris <boris.tacyniak@free.fr>';
        this.VERSION    = '0.0.0';
    }

    // Define the callback on catch error
    CatchIt.prototype.onError = function(callback) {

        onErrorCallback = callback;
    };

    // Wrap a function to catch the error easily
    CatchIt.prototype.wrap = function(func) {
        
        return errorWrapper(func);
    };

    // Expose the class either via AMD, CommonJS or the global object
    if (typeof define === 'function' && define.amd) {
        define(function () {
            return CatchIt;
        });
    }
    else if (typeof module === 'object' && module.exports){
        module.exports = CatchIt;
    }
    else {
        exports.CatchIt = CatchIt;
    }
}.call(this));
