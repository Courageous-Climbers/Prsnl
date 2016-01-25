angular.module('gaussHyrax', ['ngAnimate', 'ui.router',
'gaussHyrax.login',
'gaussHyrax.family',
'gaussHyrax.newFamilyMember',
'gaussHyrax.action',
'gaussHyrax.notes',
'gaussHyrax.summary',
'gaussHyrax.nav'
])

.config(function($stateProvider, $urlRouterProvider) {


  $stateProvider
    .state('dashboard', {
      url : '/dashboard',
      templateUrl : '/dashboard/dashboard.html',
      controller: 'navCtrl'
    })

    .state('login', {
      url : '/login',
      templateUrl : '/login/login.html',
      controller : 'loginController'
    })


    //
    // .state('summary', {
    //   url : '/summary',
    //   templateUrl : 'summaryView/summary.html',
    //   controller : 'summaryControlller'
    // })
    //
    // .state('notes', {
    //   url : '/notes',
    //   templateUrl : 'notesView/notes.html',
    //   controller : 'notesControlller'
    // })
    //
    // .state('action', {
    //   url : '/action',
    //   templateUrl : 'actionView/action.html',
    //   controller : 'actionControlller'
    // })

    $urlRouterProvider.otherwise('/login');


});
