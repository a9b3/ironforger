;(function() {
'use strict';

angular.module('app.shared')
.factory('recipeName', [
    recipeNameFactory
])

function recipeNameFactory() {

    /**
     * Constructor
     */
    function recipeName() {

    }

    // return singleton
    return new recipeName();

}

}());
