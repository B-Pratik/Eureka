/**
 * Created by Pratik on 6/28/2016.
 */

import '../assets/index.scss';	//style sheet
import 'babel-polyfill';		//pollyfill for latest features

import appController from './controller/app-controller';
import notifyService from './service/notify';

angular.module('Eureka', ['angular-loading-bar'/*, 'ngAnimate'*/])
	.controller('appController', appController)
	.service('Notifier', notifyService);