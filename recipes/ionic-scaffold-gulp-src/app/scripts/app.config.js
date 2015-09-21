'use strict';

angular.module('app')
    .config([
        '$stateProvider',
        '$urlRouterProvider',
        AppConfig
    ]);

function AppConfig($stateProvider, $urlRouterProvider) {
    // initialize parse backend
    Parse.initialize("Xfd8rgVFhSv3wEZrs5DDHhuT2N6fuIECW0AU7wHX", "ispmM90gMkKY09v95cZvfTuKXPVea5qGuVNwqMeQ");

    // default route
    $urlRouterProvider.otherwise('/');

    $stateProvider.state('home', {
        url: '/home',
        views: {
            home: {
                templateUrl: 'views/home.html',
                controller: 'HomeCtrl'
            }
        }
    });

    $stateProvider.state('home.detail', {
        url: '/:todo',
        templateUrl: 'views/todo.html',
        controller: 'TodoCtrl'
    });

    $stateProvider.state('help', {
        url: '/help',
        views: {
            help: {
                templateUrl: 'views/help.html'
            }
        }
    });
}
