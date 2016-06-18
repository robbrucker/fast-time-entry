
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

/**
 * And of course we define a controller for our route.
 */
.controller( 'HomeCtrl', function HomeController( $scope, $http, moment, growl ) {

    //for connecting with API
    $scope.hasToken = localStorage.getItem('apiKey') ? true : false;
    $scope.apiKey = $scope.hasToken ? localStorage.getItem('apiKey') : '';
    $scope.submitKey = function(apiKey, apiUrl) {
        if(apiKey && apiUrl) {
            $scope.hasToken = true;
            localStorage.setItem('apiKey', apiKey);
            localStorage.setItem('apiUrl', apiUrl);
            initialize();
        }
        else {
            console.log("Error@!");
            growl.addErrorMessage("Please enter Api Key and URL");
        }

    };

    if($scope.hasToken) {
        initialize();
    }

    $scope.changeTimeFrame = function(timeFrame) {
        console.log("Changing time frame ", timeFrame);
        $scope.timeFrame = timeFrame;
        initialize();
    };



    function initialize() {
        if(localStorage.getItem('apiKey')) {


        $scope.getProjects = function() {
                //get projects
                $http({
                    method: 'GET',
                    url: localStorage.getItem('apiUrl')+'/projects.json'
                }).then(function successCallback(response) {
                    $scope.projects = response.data.projects;
                }, function errorCallback(response) {
                });
            };

            $scope.getMe = function() {
                //get projects
                $http({
                    method: 'GET',
                    url: localStorage.getItem('apiUrl')+'/me.json'
                }).then(function successCallback(response) {
                    $scope.me = response.data.person.id;
                }, function errorCallback(response) {
                });
            };
            var base64 = btoa(localStorage.getItem('apiKey') + ":password");
            $http.defaults.headers.common['Authorization'] = 'Basic ' + base64;

            /**
             * This function gets a list of all projects
             */
            $scope.getProjects();


            /**
             * This function gets the person who is logged in, we will need their person id
             */
            $scope.getMe();


            //get all tasks for the project selected
            $scope.getTasks = function(projectId) {

                $scope.projectId = projectId.id;
                $http({
                    method: 'GET',
                    url: localStorage.getItem('apiUrl')+'/projects/'+projectId.id+'/tasks.json'
                }).then(function successCallback(response) {
                    $scope.tasks = response.data['todo-items'];
                    _.each($scope.tasks, function(task) {
                        task.facadeId = task.id.toString();
                    });
                    $scope.tasks = _.sortBy($scope.tasks, 'todo-list-name');
                }, function errorCallback(response) {
                    console.log("Some errors ", response);
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




      $scope.submitTimeForTask = function() {
          var dateHolder = [];
          dateHolder.push($scope.monObj, $scope.tueObj, $scope.wedObj, $scope.thurObj, $scope.friObj, $scope.satObj, $scope.sunObj);
          _.each(dateHolder, function(day) {
              var objKeys = _.keys(day);
              if(objKeys.length > 1) {
                  console.log("D is ", day);
                  var specificDate = day.date;
                  _.each(day, function (dayDetail, key) {
                      if (dayDetail && key != 'date') {
                          var theKeyInt = key;
                          var cleanDate = moment(specificDate).format('YYYYMMDD');
                          console.log("Clean date is ", cleanDate);
                          var data = {
                              "time-entry": {
                                  "description": "From API",
                                  "person-id": $scope.me,
                                  "date": cleanDate.toString(),
                                  "time": "09:00",
                                  "hours": dayDetail.toString(),
                                  "minutes": "0",
                                  "isbillable": "1"
                              }
                          };
                            //do the post
                          var fullUrl = localStorage.getItem('apiUrl') + '/tasks/' + theKeyInt.toString() + '/time_entries.json';
                          $http.post(localStorage.getItem('apiUrl')+'/tasks/'+theKeyInt.toString()+'/time_entries.json', data).then(function(success) {
                                console.log("Success", success);
                              growl.addSuccessMessage("Successfully sent your time to teamwork");
                          }, function(err) {
                              console.log("Post err", err);
                              growl.addErrorMessage("Could not post, check the console for errors");
                          });
                      }

                  });
              }
          });
          $scope.tasks = null;

      };
    $scope.logout = function() {
        localStorage.removeItem('apiKey');
        initialize();
    };



})

;

