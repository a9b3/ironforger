'use strict';

angular.module('components')
    .controller('HomeCtrl', [
        '$scope',
        HomeCtrl
    ]);

function HomeCtrl($scope) {
    $scope.todos = [
        {
            title: 'hi',
            done: true
        },
        {
            title: 'two',
            done: false
        },
        {
            title: 'three',
            done: false
        }
    ]
}
