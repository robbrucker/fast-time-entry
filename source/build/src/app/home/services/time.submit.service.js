/**
 * time submit service
 */

var app = angular.module("time.submit.service", []);
app.factory('timeSubmitService', function(localStorageService, $http, apiService, $q) {
    var timeSubmitService = {
        submitTime: function(dateHolder, userId) {
            var allTime = [];
            _.each(dateHolder, function(day) {
                var objKeys = _.keys(day);
                if(objKeys.length > 1) {
                    var specificDate = day.date;
                    _.each(day, function (dayDetail, key) {
                        if (dayDetail && key != 'date') {
                            var taskId = key;
                            var descriptionKey = key + "_textbox";
                            var cleanDate = moment(specificDate).format('YYYYMMDD');
                            var data = {
                                "time-entry": {
                                    "description": day && day[descriptionKey] ? day[descriptionKey] : "From API",
                                    "person-id": userId,
                                    "date": cleanDate.toString(),
                                    "time": "09:00",
                                    "hours": dayDetail.toString(),
                                    "minutes": "0",
                                    "isbillable": "1"
                                }
                            };
                            apiService.postTask(taskId, data).then(function(results) {
                                allTime.push(results);

                            });
                        }
                    });
                }
            });

            return $q.all(allTime).then(function() {
                return 200;
            });

        }
    };
    return timeSubmitService;
});