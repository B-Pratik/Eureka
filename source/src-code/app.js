/**
 * Created by Pratik on 6/28/2016.
 */

import '../assets/main.scss';

import defaultRoute from './route/routes';

angular.module('WhoWhatWhere', ['ui.router', 'angular-loading-bar'])
    .config(defaultRoute);