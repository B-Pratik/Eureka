/**
 * Created by Pratik on 8/5/2016.
 */

import homeControl from '../modules/home/controller';
import homeView from '../modules/home/view.html';

import resultControl from '../modules/result/controller';
import resultView from '../modules/result/view.html';

export default function ($stateProvider, $urlRouterProvider) {
    'ngInject';

    $urlRouterProvider.otherwise('/home');

    $stateProvider
        .state('home', {
            url: '/home',
            templateUrl: homeView,
            controller: homeControl,
        })
        .state('results', {
            url: '/business',
            templateUrl: resultView,
            controller: resultControl,
        });

}