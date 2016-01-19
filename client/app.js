angular.module('gaussHyrax', ['ui.router', 'gaussHyrax.login','gaussHyrax.family'])

.config(function($stateProvider, $urlRouterProvider) {


  $stateProvider
    .state('dashboard', {
      url : '/dashboard',
      templateUrl : '/dashboard/dashboard.html'
    })

    .state('login', {
      url : '/login',
      templateUrl : '/login/login.html',
      controller : 'loginController'
    })

    .state('family', {
      url : '/family',
      templateUrl : '/familyView/family.html',
      controller : 'loginController'
    })


    //
    //
    // .state('tasks', {
    //   url : '/tasks',
    //   templateUrl : 'tasksView/tasks.html',
    //   controller : 'tasksController'
    // })
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
