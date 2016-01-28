
// assets/javascripts/angular/controllers/users_controllers.js
var myApp = angular.module('RailsAngularDemoApp', ['ngRoute', 'ngResource']);

//Factory
myApp.factory('Users', ['$resource',function($resource){
    return $resource('/users.json', {},{
        query: { method: 'GET', isArray: true },
        create: { method: 'POST' }
    })
}]);

myApp.factory('User', ['$resource', function($resource){
    return $resource('/users/:id.json', {}, {
        show: { method: 'GET' },
        update: { method: 'PUT', params: {id: '@id'} },
        delete: { method: 'DELETE', params: {id: '@id'} }
    });
}]);

// controllers

//index action
myApp.controller("UserListCtr", ['$scope', '$resource', 'Users', 'User', '$location', function($scope, $resource, Users, User, $location) {
    $scope.users = Users.query(); //it's getting user collection
}]);


//create action
myApp.controller("UserAddCtr", ['$scope', '$resource', 'Users', '$location', function($scope, $resource, Users, $location) {
    $scope.save = function () {
        if ($scope.userForm.$valid){
            Users.create({user: $scope.user}, function(){
                $location.path('/');
            }, function(error){
                console.log(error)
            });
        }
    }
}]);


//update action
myApp.controller("UserUpdateCtr", ['$scope', '$resource', 'User', '$location', '$routeParams', function($scope, $resource, User, $location, $routeParams) {
    $scope.user = User.get({id: $routeParams.id})
    $scope.update = function(){
        if ($scope.userForm.$valid){
            User.update($scope.user,function(){
                $location.path('/');
            }, function(error) {
                console.log(error)
            });
        }
    };
}]);

//delete action
myApp.controller("UserListCtr", ['$scope', '$http', '$resource', 'Users', 'User', '$location', function($scope, $http, $resource, Users, User, $location) {

    $scope.users = Users.query();

    $scope.deleteUser = function (userId) {
        if (confirm("Are you sure you want to delete this user?")){
            User.delete({ id: userId }, function(){
                $scope.users = Users.query();   // after delete user get users collection.
                $location.path('/');
            });
        }
    };
}]);





//Routes
myApp.config([
    '$routeProvider', '$locationProvider', function($routeProvider, $locationProvider) {
        $routeProvider.when('/users',{
            templateUrl: '/templates/users/index.html',
            controller: 'UserListCtr'
        });
        $routeProvider.when('/users/new', {
            templateUrl: '/templates/users/new.html',
            controller: 'UserAddCtr'
        });
        $routeProvider.when('/users/:id/edit', {
            templateUrl: '/templates/users/edit.html',
            controller: "UserUpdateCtr"
        });
        $routeProvider.otherwise({
            redirectTo: '/users'
        });
    }
]);

