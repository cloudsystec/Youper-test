angular.module('app.routes', [])

  .config(function ($stateProvider, $urlRouterProvider) {

    $stateProvider
      .state('home', {
        url: '/home',
        templateUrl: 'templates/home.html',
        controller: 'homeCtrl'
      })
      .state('notifications', {
        url: '/notifications',
        templateUrl: 'templates/notifications.html',
        controller: 'notificationsCtrl'
      })

    $urlRouterProvider.otherwise('/home');
  });