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

    $scope.showTeams = false;
    $scope.teamFocused = false;
    $scope.focusedTeam = {};
    $scope.teamPlaying = {};
    $scope.readyToStart = false;

    $scope.hasStarted = false;
    $scope.currentQuestion = {};

    $scope.reset = function() {
        $scope.hasStarted = false;
        $scope.currentQuestion = {};
        $scope.currentQuestionNum = 1;

        for (var i = 0; i < $scope.teamPlaying.players.length; i++) {
            $scope.teamPlaying.players[i].going = false;
        }
    };

    $scope.$on('peopleLoaded', function(){
        $scope.teams = [
            $scope.purpleTeam = {
                "name" : "purple",
                "people" : getTeam("purple"),
                "hasFocus" : false
            },
            $scope.platinumTeam = {
                "name" : "platinum",
                "people" : getTeam("platinum"),
                "hasFocus" : false
            },
            $scope.goldTeam = {
                "name" : "gold",
                "people" : getTeam("gold"),
                "hasFocus" : false
            },
            $scope.paisleyTeam = {
                "name" : "paisley",
                "people" : getTeam("paisley"),
                "hasFocus" : false
            },
            $scope.titaniumTeam = {
                "name" : "titanium",
                "people" : getTeam("titanium"),
                "hasFocus" : false
            },
            $scope.blackTeam = {
                "name" : "black",
                "people" : getTeam("black"),
                "hasFocus" : false
            },
            $scope.psychedelicTeam = {
                "name" : "psychedelic",
                "people" : getTeam("psychedelic"),
                "hasFocus" : false
            },
            $scope.greenTeam = {
                "name" : "green",
                "people" : getTeam("green"),
                "hasFocus" : false
            },
            $scope.blueTeam = {
                "name" : "blue",
                "people" : getTeam("blue"),
                "hasFocus" : false
            },
            $scope.redTeam = {
                "name" : "red",
                "people" : getTeam("red"),
                "hasFocus" : false
            }
        ];
    });

    function getTeam(color) {
        var array = [];
        for (var i = 0; i < $scope.people.length; i++) {
            if ($scope.people[i].team == color) {
                array.push($scope.people[i]);
            }
        }
        return array;
    }

    $scope.focusTeam = function(team) {
        for (var i = 0; i < $scope.teams.length; i++) {
            $scope.teams[i].hasFocus = false;
        }
        team.hasFocus = true;
        $scope.teamFocused = true;
        $scope.focusedTeam = team;
    };

    $scope.unfocusTeam = function(team) {
        team.hasFocus = false;
        $scope.teamFocused = false;
    };

    $scope.players = [];
    $scope.$watch('focusedTeam', function() {
        if ($scope.teamFocused) {
            var array = [];
            for (var i = 0; i < $scope.focusedTeam.people.length; i++) {
                if ($scope.focusedTeam.people[i].playing) {
                    array.push($scope.focusedTeam.people[i])
                }
            }
            $scope.players = array;
        }
    }, "true");

    $scope.confirmTeam = function(team) {
        $scope.teamPlaying = team;
        $scope.teamPlaying.players = $scope.players;
        var players = $scope.teamPlaying.players;
        for (var i = 0; i < players.length; i++) {
            var imageId = players[i].img.split("/")[4];
            players[i].imgSrc = imageId + ".png";
        }
        $scope.readyToStart = true;
    };


    /*THE GAME VARS AND FUNCTIONS*/

    $scope.start = function() {
        $scope.hasStarted = true;
        $scope.currentQuestionNum = 1;
        $scope.currentPlayerNum = 0;
        $scope.totalPlayers = $scope.teamPlaying.players.length;

        loadQuestion($scope.currentQuestionNum);
        $scope.teamPlaying.players[$scope.currentPlayerNum].going = true;
    };

    function loadQuestion(num) {
        for (var i = 0; i < $scope.questions.length; i++) {
            if ($scope.questions[i].index == num) {
                $scope.currentQuestion = $scope.questions[i];
                break;
            }
        }
    }

    function setPlayer(currentPlayerNum) {
        var nextNum = currentPlayerNum + 1;
        if (nextNum == $scope.totalPlayers) {
            nextNum = 0;
        }
        $scope.currentPlayerNum = nextNum;
        $scope.teamPlaying.players[currentPlayerNum].going = false;
        $scope.teamPlaying.players[$scope.currentPlayerNum].going = true;
    }

    $scope.nextQuestion = function(){
        $scope.currentQuestionNum += 1;
        loadQuestion($scope.currentQuestionNum);
        setPlayer($scope.currentPlayerNum);
    };

    $scope.revealAnswer = function(answer) {
        answer.reveal = true;
    };


});