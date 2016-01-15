var app = angular.module('gaussHyrax', ['ui.router', 'gaussHyrax.login']);

app.config(function($stateProvider, $urlRouterProvider) {

  $urlRouterProvider.otherwise('login');

  $stateProvider
    .state('login', {
      url : '/',
      templateUrl : 'login.html',
      controller : 'loginController'
    })

    .state('dashboard', {
      url : '/dashboard',
      templateUrl : 'index.html'
    })

    .state('tasks', {
      url : '/tasks',
      templateUrl : 'tasksView/tasks.html',
      controller : 'tasksController'
    })

    .state('summary', {
      url : '/summary',
      templateUrl : 'summaryView/summary.html',
      controller : 'summaryControlller'
    })
    
    .state('notes', {
      url : '/notes',
      templateUrl : 'notesView/notes.html',
      controller : 'notesControlller'
    })

    .state('action', {
      url : '/action',
      templateUrl : 'actionView/action.html',
      controller : 'actionControlller'
    })
    


})