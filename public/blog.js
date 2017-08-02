angular.module('blog', ['ngRoute'])
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

    .controller('MainController', ['authService', '$http', '$location',
        function (authService, $http, $location) {
            var main = this;

            this.isAuthenticated = function () {
                return (authService.getToken() !== null &&
                    authService.getToken() !== undefined);
            };

            this.logout = function () {
                authService.removeToken();
                $location.path('/');
            };

            $http.get('http://localhost:8090/posts').then(function (response) {
                main.posts = response.data;
            })
        }])

    .controller('RegistrationController', ['$http', '$location',
        function ($http, $location) {
            this.register = function (user) {
                $http.post('http://localhost:8090/register',
                    {username: user.username, password: user.password})
                    .then(function () {
                        $location.path('/login');
                    }, function (error) {
                        console.error(error)
                    })
            }
        }])

    .controller('LoginController', ['$http', '$location', 'authService',
        function ($http, $location, authService) {

            this.login = function (user) {
                $http.post('http://localhost:8090/login',
                    {username: user.username, password: user.password})
                    .then(function (response) {
                        authService.setToken(response.headers()['authorization']);

                        $location.path('/account');
                    }, function (error) {
                        console.error(error)
                    })
            };
        }])

    .controller('AccountController', ['$http', 'authService', 'userService',
        function ($http, authService, userService) {
            var account = this;

            $http.defaults.headers.common['Authorization'] = authService.getToken();

            $http.get('http://localhost:8090/profile')
                .then(function (response) {
                    userService.setId(response.data.id);
                    account.userId = response.data.id;
                })
        }])

    .controller('PostsController', ['$http', 'authService', 'userService',
        function ($http, authService, userService) {
            var postList = this;
            var userId = userService.getId();

            $http.defaults.headers.common['Authorization'] = authService.getToken();

            $http.get('http://localhost:8090/users/' + userId + /posts/)
                .then(function (response) {
                    postList.posts = response.data;
                });

            postList.createPost = function () {
                $http.post('http://localhost:8090/users/' + userId + /posts/, postList.newPost)
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

                $http.delete('http://localhost:8090/posts/' + post.id).then(function () {
                    postList.posts.splice(postIndex, 1);
                })
            };

        }]);
