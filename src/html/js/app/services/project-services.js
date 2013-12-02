/*global angular, console, obj2query*/




var projectServices = angular.module('projectServices', []);



projectServices.factory('ProjectList', ['$http',
        function($http) {
            return {
                getList: function(filter) {
                    var service = {
                        _filter: filter,
                        projects: {},
                        _updatePeriod: 100000,
                        _updateTimeout: null,
                        _runUpdate: function() {
                            console.log('run update');


                            window.clearTimeout(this._updateTimeout);

                            $http.get('/api/projects', {
                                    params: {
                                        action: 'list',
                                        filter: this._filter
                                    }
                                }).then(function(result) {
                                    service._answerReceived(result.data.projects);
                                });
                        },
                        _answerReceived: function(list) {
                            console.log('answer received');
                            if (!angular.equals(this.projects, list)) {
                                this.projects = list;
                                this._updatePeriod = 100000;
                                console.log('new data');
                            } else {
                                this._updatePeriod += 1000;
                                console.log('same old data');
                            }


                            window.clearTimeout(this._updateTimeout);
                            this._updateTimeout = window.setTimeout(function() {
                                    service._runUpdate();
                                }, this._updatePeriod);

                            console.log('set timeout ' + this._updatePeriod);
                        },
                        update: function() {
                            this._updatePeriod = 100000;
                            this._runUpdate();
                        },
                        destroy: function() {
                            window.clearTimeout(this._updateTimeout);
                        }
                    };

                    service.update();

                    return service;
                }
            };
        }
    ]);


projectServices.factory('ProjectCreate', ['$http',
        function($http) {
            return {
                create: function(projectList) {

                    var service = {
                        _projectList: projectList,
                        working: false,
                        submit: function(id, title, description, isPublic) {
                            service.working = true;

                            var data = {
                                'action': id ? 'update' : 'create',
                                'id': id,
                                'title': title,
                                'description': description,
                                'is_public': isPublic
                            };


                            return $http({
                                    'url': '/api/projects',
                                    'method': 'POST',
                                    'data': obj2query(data),
                                    'headers': {
                                        "Content-Type": "application/x-www-form-urlencoded"
                                    }
                                }).then(function(result) {
                                    service._projectList.update();
                                    console.log(result.data);
                                    service.working = false;
                                    return result.data;
                                });
                        },
                        destroy: function() {
                            this._projectList = null;
                        }
                    };

                    return service;
                }
            };
        }
    ]);