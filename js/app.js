var app = angular.module("APP", []);

app.controller("mainCTRL", function($scope, $http){
    $http({
        method: "GET",
        url: "questions.json"
    }).then(function(data){
        $scope.questions = data.data.questions;
    });

    $scope.hasStarted = false;
    $scope.currentQuestion = {};

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
});