angular.module( 'ngBoilerplate.home', [
    'ui.router',
    'plusOne',
    'angular-growl'
])
.config(function config( $stateProvider ) {
  $stateProvider.state( 'home', {
    url: '/home',
    views: {
      "main": {
        controller: 'HomeCtrl',
        templateUrl: 'home/home.tpl.html'
      }
    },
    data:{ pageTitle: 'Home' }
  });
})
.controller( 'HomeCtrl', function HomeController( $scope, $http, moment, growl, localStorageService, apiService, timeSubmitService) {

    /**
     * Manage authentication
     */
    $scope.apiKey = localStorageService.getApiKey();
    if(localStorageService.hasToken()) {
        $scope.hasToken = localStorageService.hasToken();
        initialize();
    }
    //end manage authentication
    /**
     *  initialization function
     */
    function initialize() {
        if(localStorageService.hasToken()) {
           apiService.authorize();

            apiService.getProjects().then(function(results) {
                $scope.projects = results;
            });
            apiService.getUser().then(function(results) {
                $scope.me = results;
            });

            //get all tasks for the project selected
            $scope.getTasks = function(projectId) {
                apiService.getTasks(projectId).then(function(response) {
                    $scope.tasks = response.data['todo-items'];
                    _.each($scope.tasks, function(task) {
                        task.facadeId = task.id.toString();
                    });
                    $scope.tasks = _.sortBy($scope.tasks, 'todo-list-name');
                });
            };

            if($scope.timeFrame) {
                loadTime($scope.timeFrame);
            }
            else {
                loadTime('CURRENT');
            }
        }
        else {
            $scope.hasToken = false;
        }
    }
    function loadTime(timeFrame) {
        var startOfWeek = moment();
        $scope.timeFrame = timeFrame;
        if(timeFrame == 'CURRENT') {
           startOfWeek = moment().startOf('isoweek');
        }
        else if(timeFrame == 'LAST_WEEK') {
            startOfWeek = moment().subtract(1, 'weeks').startOf('isoWeek');
        }
        $scope.monObj = {date:startOfWeek};
        var tuesday = moment(startOfWeek).add(1, 'days');
        $scope.tueObj = {date:tuesday};
        var wednsday = moment(startOfWeek).add(2, 'days');
        $scope.wedObj = {date:wednsday};
        var thursday = moment(startOfWeek).add(3, 'days');
        $scope.thurObj = {date:thursday};
        var friday = moment(startOfWeek).add(4, 'days');
        $scope.friObj = {date:friday};
        var saturday = moment(startOfWeek).add(5, 'days');
        $scope.satObj = {date:saturday};
        var sunday = moment(startOfWeek).add(6, 'days');
        $scope.sunObj = {date:sunday};
        console.log("What is sunday ", $scope.sunObj);
    }
    /**
     *  View on click Functions
    */
    $scope.submitKey = function(apiKey, apiUrl) {
        if(apiKey && apiUrl) {
            localStorageService.modifyStorage(apiKey, apiUrl);
            $scope.hasToken = localStorageService.hasToken();
            initialize();
        }
        else {
            console.log("Error@!");
            growl.addErrorMessage("Please enter Api Key and URL");
        }

    };
    $scope.changeTimeFrame = function(timeFrame) {
        $scope.timeFrame = timeFrame;
        initialize();
    };
      $scope.submitTimeForTask = function() {
            var dateHolder = [];
            dateHolder.push($scope.monObj, $scope.tueObj, $scope.wedObj, $scope.thurObj, $scope.friObj, $scope.satObj, $scope.sunObj);
            timeSubmitService.submitTime(dateHolder, $scope.me).then(function(result) {
                growl.addSuccessMessage("Successfully sent your time to teamwork");
                $scope.tasks = null;
                $scope.projects = null;
                initialize();
            });

      };
    $scope.logout = function() {
        localStorageService.removeApiKey();
        initialize();
    };
    //end view on-click functions
});