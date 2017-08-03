angular.module('blog', ['ngRoute'])

    .constant('config', {
        apiEndpoint: 'http://localhost:8090'
    })

    .config(['$routeProvider', '$locationProvider',
        function ($routeProvider, $locationProvider) {
            $routeProvider
                .when('/register', {
                    templateUrl: 'register.html',
                    controller: 'RegistrationController',
                    controllerAs: 'registrationCtrl'
                })
                .when('/login', {
                    templateUrl: 'login.html',
                    controller: 'LoginController',
                    controllerAs: 'loginCtrl'
                })
                .when('/account', {
                    templateUrl: 'accountInfo.html',
                    controller: 'AccountController',
                    controllerAs: 'accountCtrl'
                })
                .when('/posts', {
                    templateUrl: 'posts.html',
                    controller: 'PostsController',
                    controllerAs: 'postList'
                });

            $locationProvider.html5Mode(true);
        }])

    .service('authService', [function () {
        return {
            getToken: function () {
                return localStorage.getItem('token');
            },

            setToken: function (token) {
                localStorage.setItem('token', token);
            },

            removeToken: function () {
                localStorage.removeItem('token');
            }
        }
    }])

    .service('userService', [function () {
        return {
            getId: function () {
                return localStorage.getItem('userId')
            },

            setId: function (Id) {
                return localStorage.setItem('userId', Id)
            }
        }
    }])

    .controller('MainController', ['config', 'authService', '$scope', '$http', '$location',
        function (config, authService, $scope, $http, $location) {

            var main = this;

            this.isAuthenticated = function () {
                return (authService.getToken() !== null &&
                    authService.getToken() !== undefined);
            };

            this.logout = function () {
                authService.removeToken();
                $location.path('/');
            };

            $http.get(config.apiEndpoint + '/posts').then(function (response) {
                main.posts = response.data;
            })
        }])

    .controller('RegistrationController', ['config', '$http', '$location',
        function (config, $http, $location) {

            this.register = function (user) {
                $http.post(config.apiEndpoint + '/register',
                    {username: user.username, password: user.password})
                    .then(function () {
                        $location.path('/login');
                    }, function () {
                        // console.error(error)
                    })
            }
        }])

    .controller('LoginController', ['config', '$http', '$location', 'authService', 'userService',
        function (config, $http, $location, authService, userService) {

            this.login = function (user) {
                $http.post(config.apiEndpoint + '/login',
                    {username: user.username, password: user.password})
                    .then(function (response) {
                        authService.setToken(response.headers()['authorization']);

                        $http.defaults.headers.common['Authorization'] = authService.getToken();

                        $http.get(config.apiEndpoint + '/profile')
                            .then(function (response) {
                                userService.setId(response.data.id);

                                $location.path('/posts');
                            });
                    }, function () {
                        // console.error(error)
                    })
            };
        }])

    .controller('AccountController', ['config', '$http', 'authService', 'userService',
        function (config, $http, authService, userService) {

            var account = this;

            account.userId = userService.getId();
        }])

    .controller('PostsController', ['config', '$http', 'authService', 'userService',
        function (config, $http, authService, userService) {

            var postList = this;
            var userId = userService.getId();

            $http.defaults.headers.common['Authorization'] = authService.getToken();

            $http.get(config.apiEndpoint + '/users/' + userId + /posts/)
                .then(function (response) {
                    postList.posts = response.data;
                });

            postList.createPost = function () {
                $http.post(config.apiEndpoint + '/users/' + userId + /posts/, postList.newPost)
                    .then(function (response) {
                        postList.newPost = {};
                        postList.postForm.$setPristine();

                        $http.get(response.headers()['location']).then(function (response) {
                            postList.posts.push(response.data);
                        });
                    })
            };

            postList.deletePost = function (post) {
                var postIndex = postList.posts.indexOf(post);

                $http.delete(config.apiEndpoint + '/posts/' + post.id).then(function () {
                    postList.posts.splice(postIndex, 1);
                })
            };

        }]);
