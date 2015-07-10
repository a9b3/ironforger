;(function() {
'use strict';

angular.module('')
.directive('recipeName', [
    function() {
        return {
            restrict: 'E',
            templateUrl: 'scripts/recipeName/recipeName.tpl.html',
            link: linkFunc
        }
    }
])

function linkFunc(scope, elem, attrs) {

}

}());
