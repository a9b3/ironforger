'use strict';

angular.module('app')
    .factory('Task', [
        TaskFactory
    ]);

function TaskFactory() {

    function Task() {

    }

    return new Task();

}
