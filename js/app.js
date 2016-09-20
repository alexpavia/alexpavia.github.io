var app = angular.module("APP", []);

app.controller("mainCTRL", function($scope, $http, $timeout){
    $http({
        method: "GET",
        url: "questions.json"
    }).then(function(data){
        $scope.questions = data.data.questions;
        grandTotalPoints();
    });
    $http({
        method: "GET",
        url: "people.json"
    }).then(function(data){
        $scope.people = data.data;
        $scope.$broadcast('peopleLoaded');
    });
    $http({
        method: "GET",
        url: "months.json"
    }).then(function(data){
        $scope.months = data.data;
    });

    $scope.showTeams = false;
    $scope.teamFocused = false;
    $scope.focusedTeam = {};
    $scope.teamPlaying = {};
    $scope.readyToStart = false;

    $scope.hasStarted = false;
    $scope.currentQuestion = {};

    function grandTotalPoints() {
        var total = 0;
        for (var i = 0; i < $scope.questions.length; i++) {
            for (var j = 0; j < $scope.questions[i].answers.length; j++) {
                total += $scope.questions[i].answers[j].value;
            }
        }
        $scope.grandTotal = total;
    }
    
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
                "hasFocus" : false,
                "liaison" : "Brittany Marshall"
            },
            /*$scope.platinumTeam = {
                "name" : "platinum",
                "people" : getTeam("platinum"),
                "hasFocus" : false,
                "liaison" : "Maggie Smothers"
            },*/
            $scope.goldTeam = {
                "name" : "gold",
                "people" : getTeam("gold"),
                "hasFocus" : false,
                "liaison" : "Mindie Meyers"
            },
            $scope.paisleyTeam = {
                "name" : "paisley",
                "people" : getTeam("paisley"),
                "hasFocus" : false,
                "liaison" : "Rebecca Houchin"
            },
            $scope.titaniumTeam = {
                "name" : "titanium",
                "people" : getTeam("titanium"),
                "hasFocus" : false,
                "liaison" : "Jyllian Anderson"
            },
            $scope.blackTeam = {
                "name" : "black",
                "people" : getTeam("black"),
                "hasFocus" : false,
                "liaison" : "CarrieAnna McFadden"
            },
            $scope.psychedelicTeam = {
                "name" : "psychedelic",
                "people" : getTeam("psychedelic"),
                "hasFocus" : false,
                "liaison" : "Jenny Ellingson"
            },
            $scope.greenTeam = {
                "name" : "green",
                "people" : getTeam("green"),
                "hasFocus" : false,
                "liaison" : "Angelena Kharchenko"
            },
            $scope.blueTeam = {
                "name" : "blue",
                "people" : getTeam("blue"),
                "hasFocus" : false,
                "liaison" : "Jordan Manchester"
            },
            $scope.redTeam = {
                "name" : "red",
                "people" : getTeam("red"),
                "hasFocus" : false,
                "liaison" : "Kelli Hullaby"
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

    $scope.allPeoplePlaying = false;
    $scope.$watch('allPeoplePlaying', function(n, o){
        if ($scope.teamFocused) {
            for (var i=0; i < $scope.focusedTeam.people.length; i++) {
                $scope.focusedTeam.people[i].playing = n;
            }
        }
    });

    $scope.toggleCheckAll = function(team) {
        for (var i=0; i < team.people.length; i++) {
            team.people[i].playing = !team.people[i].playing;
        }
    };


    /*THE GAME VARS AND FUNCTIONS*/

    $scope.finalAnswer = "";
    $scope.strikes = 0;
    $scope.questionPoints = 0;
    $scope.totalPoints = 0;
    $scope.checkingAnswer = false;
    $scope.loadingQuestion = false;
    $scope.finished = false;
    $scope.currentPlayerName = '';

    var display = document.querySelector('#time');
    var display2 = document.querySelector('#time2');

    $scope.start = function() {
        $scope.hasStarted = true;
        $scope.currentQuestionNum = 1;
        $scope.currentPlayerNum = 0;
        $scope.totalPlayers = $scope.teamPlaying.players.length;

        loadQuestion($scope.currentQuestionNum);
        $scope.teamPlaying.players[$scope.currentPlayerNum].going = true;
        $scope.currentPlayerName = $scope.teamPlaying.players[$scope.currentPlayerNum].name;
        startTimer(15, display);
    };

    function loadQuestion(num) {
        for (var i = 0; i < $scope.questions.length; i++) {
            if ($scope.questions[i].index == num) {
                $scope.currentQuestion = $scope.questions[i];
                break;
            }
        }
        $scope.loadingQuestion = false;
    }

    function setPlayer(currentPlayerNum) {
        var nextNum = currentPlayerNum + 1;
        if (nextNum == $scope.totalPlayers) {
            nextNum = 0;
        }
        $scope.currentPlayerNum = nextNum;
        $scope.teamPlaying.players[currentPlayerNum].going = false;
        $scope.teamPlaying.players[$scope.currentPlayerNum].going = true;
        $scope.currentPlayerName = $scope.teamPlaying.players[$scope.currentPlayerNum].name;

        startTimer(15, display);
    }

    $scope.nextQuestion = function(){
        $scope.loadingQuestion = true;
        $scope.finalAnswer = "";

        for (var i = 0; i < $scope.currentQuestion.answers.length;i++) {
            $scope.revealAnswer($scope.currentQuestion.answers[i]);
        }
        
        if ($scope.currentQuestionNum == 15) {
            $scope.gameFinished();
        } else {
            $timeout(function(){
                $scope.totalPoints += $scope.questionPoints;
                $scope.currentQuestionNum += 1;

                $scope.strikes = 0;
                $scope.questionPoints = 0;
                loadQuestion($scope.currentQuestionNum);
                setPlayer($scope.currentPlayerNum);
            }, 4000);
        }
    };

    $scope.submitAnswer = function(question, answer) {
        $scope.checkingAnswer = true;

        var matched = false;
        for (var i = 0; i < question.answers.length; i++) {
            if (question.answers[i].locked) {
                //question already answered, do nothing
            } else {
                for (var j = 0; j < question.answers[i].alternates.length; j++) {
                    if (answer == question.answers[i].alternates[j]) {
                        //matches answer
                        matched = true;
                        $scope.checkingAnswer = false;

                        $scope.showCorrectMessage();
                        $scope.revealAnswer(question.answers[i]);
                        giveQuestionPoints(question.answers[i].value);
                        clearInterval(interval);

                        question.answers[i].locked = true;

                        if (question.answers.every(checkLocked)) {
                            $scope.nextQuestion();
                        } else {
                            $timeout(function(){
                                setPlayer($scope.currentPlayerNum);
                                $scope.finalAnswer = "";
                            }, 3000);
                        }
                        break;
                    } else {
                        //move to next answer
                    }
                }
            }

        }
        if (!matched) {
            //wrong answer
            clearInterval(interval);
            $scope.showFailMessage();
            $timeout(function(){
                $scope.checkingAnswer = false;
                $scope.forceNext();
            }, 3000);

        }
    };

    function checkLocked(question) {
        return question.locked == true;
    }

    $scope.showCorrectMessage = function() {
        $scope.showSuccess = true;
        $timeout(function(){
           $scope.showSuccess = false;
        }, 3000);
    };

    $scope.showFailMessage = function() {
        $scope.showFail = true;
        $timeout(function(){
            $scope.showFail = false;
        }, 3000);
    };

    $scope.revealAnswer = function(answer) {
        answer.reveal = true;
    };

    function giveQuestionPoints(value) {
        $scope.questionPoints += value;
    }

    $scope.forceNext = function() {
        $scope.strikes += 1;
        $scope.finalAnswer = "";
        if ($scope.strikes == 2) {
            $timeout(function(){
                $scope.nextQuestion();
            });
        } else {
            $timeout(function(){
                setPlayer($scope.currentPlayerNum);
            });
        }

    };

    $scope.gameFinished = function() {
        $scope.finished = true;
        $scope.teamPlaying.players[$scope.currentPlayerNum].going = false;
        clearInterval(interval);
    };

    $scope.startBonus = false;
    $scope.showBonus1 = false;
    $scope.showBonus2 = false;
    $scope.showBonus1Result = false;
    $scope.showBonus2Result = false;
    $scope.showFinalScreen = false;
    $scope.bonusRight = false;
    $scope.bonusWrong = false;

    $scope.showBonus = function() {
        if (!$scope.startBonus) {
            $scope.startBonus = true;
            $scope.showBonus1 = true;
            startTimer(15, display2)
        } else {
            $scope.resetBonus();
            $scope.bonusRight = false;
            $scope.bonusWrong = false;
            $scope.showBonus2Result = false;
            $scope.showBonus2 = true;
            startTimer(15, display2)
        }
    };

    $scope.endBonusQuestion = function() {
        if ($scope.showBonus1) {
            $timeout(function(){
                $scope.showBonus1 = false;
                $scope.showBonus1Result = true;
            });
        } else {
            $timeout(function(){
                $scope.showBonus1Result = false;
                $scope.showBonus2 = false;
                $scope.showBonus2Result = true;
            });
        }
    };

    $scope.answerBonus = function(answer) {
        $timeout(function(){
            if (answer == "November") {
                $scope.bonusRight = true;
                $scope.bonusWrong = false;
            } else {
                $scope.bonusRight = false;
                $scope.bonusWrong = true;
            }
            clearInterval(interval);
            $scope.endBonusQuestion();
        });

    };

    $scope.bonusBagResult = 0;
    $scope.bonusBagOpened = false;
    $scope.bonusPrizeChosen = false;
    $scope.bonusBombOpened = false;
    $scope.targetChosen = false;
    $scope.bombedTeams = [];
    $scope.bonusBombResult = 0;

    $scope.bonusBag = function() {
        $scope.bonusPrizeChosen = true;
        $scope.bonusBagOpened = true;
        $scope.bonusBagResult = genRandomNum(25, 50);
        $scope.totalPoints += $scope.bonusBagResult;

    };

    $scope.resetBonus = function() {
        $scope.bonusBagResult = 0;
        $scope.bonusBagOpened = false;
        $scope.bonusPrizeChosen = false;
        $scope.bonusBombResult = 0;
        $scope.bonusBombOpened = false;
        $scope.bonusPrizeChosen = false;
        $scope.targetChosen = false;
        $scope.targetName = "";
    };

    $scope.bonusBomb = function() {
        $scope.bonusPrizeChosen = true;
        $scope.bonusBombOpened = true;
        $scope.showTeamsBomb = true;
    };

    $scope.applyBomb = function(team) {
        $scope.targetChosen = true;
        $scope.targetName = team.name;
        $scope.bonusBombResult = genRandomNum(1, 100);
        var obj = {
            name : $scope.targetName,
            value : $scope.bonusBombResult
        };
        $scope.bombedTeams.push(obj);
    };

    function genRandomNum(min, max) {
        return Math.floor(Math.random() * (max - min)) + min;
    }

    $scope.end = function() {
        $scope.showFinalScreen = true;
        console.log($scope.bombedTeams);
    };

    var interval;
    function startTimer(duration, display) {
        clearInterval(interval);
        var timer = duration, minutes, seconds;
        interval = setInterval(function () {
            minutes = parseInt(timer / 60, 10);
            seconds = parseInt(timer % 60, 10);

            minutes = minutes < 10 ? "0" + minutes : minutes;
            seconds = seconds < 10 ? "0" + seconds : seconds;

            display.textContent = minutes + ":" + seconds;

            if (--timer < 0) {
                timer = duration;
            }
            if (seconds == undefined || seconds == "00") {
                if (!$scope.startBonus) {
                    clearInterval(interval);
                    $scope.forceNext();
                } else {
                    clearInterval(interval);
                    $scope.bonusWrong = true;
                    $scope.endBonusQuestion();
                }
            }
        }, 1000);
    }
});