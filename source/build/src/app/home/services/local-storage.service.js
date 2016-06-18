/**
 * local storage service
 */

var app = angular.module("local-storage.service", []);
app.factory('localStorageService', function() {
    var localStorageService = {
        /**
         * set local storage
         * @param apiKey
         * @param apiUrl
         * @returns boolean
         */
        modifyStorage: function(apiKey, apiUrl) {
        localStorage.setItem('apiKey', apiKey);
        localStorage.setItem('apiUrl', apiUrl);
        return true;
        },
        getApiKey: function() {
            return localStorage.getItem('apiKey') ? localStorage.getItem('apiKey') : '';
        },
        getApiUrl: function() {
            return localStorage.getItem('apiUrl') ? localStorage.getItem('apiUrl') : '';
        },
        removeApiKey: function() {
            localStorage.removeItem('apiKey');
            return true;
        },
        hasToken: function() {
            return localStorage.getItem('apiKey') ? true : false;
        }
    };
    return localStorageService;
});