var app = angular.module("bayesApp", ["ui.bootstrap"]);

app.controller("BayesController", ["$scope", "$log", function($scope, $log) {

  $scope.clear = function() {
    $scope.stage = "init";
    $scope.results = [];
    $scope.evidences = [];
    $scope.numberOfHypotheses = "";
  }

  $scope.clear();

  $scope.addHypotheses = function() {
    $scope.stage = "addingHypotheses";
    $scope.hypotheses = [];
    $scope.evidences= [] ;
    for (var i=0; i<$scope.numberOfHypotheses; i++) {
      $scope.hypotheses.push({
        prior:1.0/$scope.numberOfHypotheses,
        desc:"",
      });
    }
  };
  $scope.inference = function() {
    $scope.stage = "inference";
    $scope.addEvidence();
  };
  $scope.addEvidence = function(lastEvidence) {
    if (lastEvidence) {
      lastEvidence.inEdit=false;
    }
    $scope.calc();
    var evidence = {
      desc:"",
      inEdit:true,
      hypotheses:[]
    };
    $scope.evidences.push(evidence);
    for (var i=0; i<$scope.numberOfHypotheses; i++) {
      var hypothese = {
        index:i,
        probability:0.0
      };
      evidence.hypotheses.push(hypothese);
    }
  }
  $scope.deleteEvidence = function(i) {
    var newEvidences = [];
    for (var j=0; j<$scope.evidences.length; j++) {
      if (j!=i) newEvidences.push($scope.evidences[j]);
    }
    $scope.evidences = newEvidences;
    $scope.calc();
  }
  $scope.calc = function() {
    var priors = [];
    for (var i=0; i<$scope.numberOfHypotheses; i++) {
      priors[i]=$scope.hypotheses[i].prior;
    }
    angular.forEach($scope.evidences, function(evidence) {
      var sum = 0.0;
      for (var j=0; j<evidence.hypotheses.length; j++) {
        var hypothese = evidence.hypotheses[j];
        hypothese.probability=priors[j]*hypothese.likelihood;
        sum+=hypothese.probability;
      };
      for (var j=0; j<evidence.hypotheses.length; j++) {
        var hypothese = evidence.hypotheses[j];
        priors[j]=hypothese.probability/sum;
      }
    });
    $scope.results=[];
    for (var i=0; i<priors.length; i++) {
      $scope.results[i]={
        desc:$scope.hypotheses[i].desc,
        value:(Math.round(priors[i]*100*100)/100.0)
      };
      $log.log($scope.results)
    };
  }
}]);

app.directive('focusMe', function($timeout, $parse) {
  return {
    //scope: true,   // optionally create a child scope
    link: function(scope, element, attrs) {
      var model = $parse(attrs.focusMe);
      scope.$watch(model, function(value) {
        if(value === true) {
          $timeout(function() {
            element[0].focus();
          });
        }
      });
      // to address @blesh's comment, set attribute value to 'false'
      // on blur event:
      // element.bind('blur', function() {
      //   console.log('blur');
      //   scope.$apply(model.assign(scope, false));
      // });
    }
  };
});

app.directive('onEnter', function () {
  return function (scope, element, attrs) {
    element.bind("keydown keypress", function (event) {
      if(event.which === 13) {
        scope.$apply(function (){
          scope.$eval(attrs.onEnter);
        });

        event.preventDefault();
      }
    });
  };
});
