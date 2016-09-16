var app = angular.module("APP", []);

app.controller("mainCTRL", function($scope, $http){
    $http({
        method: "GET",
        url: "questions.json"
    }).then(function(data){
        $scope.questions = data.data.questions;
    });
    $http({
        method: "GET",
        url: "people.json"
    }).then(function(data){
        $scope.people = data.data;
        $scope.$broadcast('peopleLoaded');
    });

    $scope.hasStarted = false;
    $scope.currentQuestion = {};
    $scope.purpleTeam = [];

    $scope.start = function() {
        $scope.currentQuestionNum = 1;
        loadQuestion($scope.currentQuestionNum);
        $scope.hasStarted = true;
    };

    $scope.nextQuestion = function(){
        $scope.currentQuestionNum += 1;
        loadQuestion($scope.currentQuestionNum);
    };

    function loadQuestion(num) {
        for (var i = 0; i < $scope.questions.length; i++) {
            if ($scope.questions[i].index == num) {
                $scope.currentQuestion = $scope.questions[i];
                break;
            }
        }
    }

    $scope.revealAnswer = function(answer) {
        answer.reveal = true;
    };

    $scope.reset = function() {
        $scope.hasStarted = false;
        $scope.currentQuestion = {};
        $scope.currentQuestionNum = 1;
    };
    
    function getTeam(color) {
        var array = [];
        for (var i = 0; i < $scope.people.length; i++) {
            if ($scope.people[i].team == color) {
                array.push($scope.people[i]);
            }
        }
        return array;
    }

    $scope.$on('peopleLoaded', function(){
        $scope.purpleTeam = getTeam("purple");
        $scope.platinumTeam = getTeam("platinum");
        $scope.goldTeam = getTeam("gold");
        $scope.paisleyTeam = getTeam("paisley");
        $scope.titaniumTeam = getTeam("titanium");
        $scope.blackTeam = getTeam("black");
        $scope.psychedelicTeam = getTeam("psychedelic");
        $scope.greenTeam = getTeam("green");
        $scope.blueTeam = getTeam("blue");
        $scope.redTeam = getTeam("red");
});


});