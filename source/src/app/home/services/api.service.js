/**
 * api service
 */

var app = angular.module("api.service", []);
app.factory('apiService', function(localStorageService, $http) {
    var apiService = {
        authorize: function() {
            var base64 = btoa(localStorageService.getApiKey() + ":password");
            $http.defaults.headers.common['Authorization'] = 'Basic ' + base64;
        },
        getProjects: function() {
            return $http.get(localStorageService.getApiUrl()+'/projects.json').then(function(response) {
                return response.data.projects;
            });
        },
        getUser: function() {
            return $http.get(localStorageService.getApiUrl()+'/me.json').then(function(response) {
                return response.data.person.id;
            });
        },
        getTasks: function(projectId) {
            return $http.get(localStorageService.getApiUrl()+'/projects/'+projectId.id+'/tasks.json').then(function(response) {
                return response;
            });
        },
        postTask: function(k, data) {
            return $http.post(localStorageService.getApiUrl()+'/tasks/'+k.toString()+'/time_entries.json', data).then(function(success) {
              return success;
            });


        }
    };
    return apiService;
});