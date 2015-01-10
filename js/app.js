var app = angular.module("bayesApp", ["ui.bootstrap"]);

app.controller("BayesController", function() {
  this.stage = "init";
  this.results = [];
  this.evidences = [];
  this.addHypotheses = function() {
    this.stage = "addingHypotheses";
    this.hypotheses = [];
    this.evidences= [] ;
    for (var i=0; i<this.numberOfHypotheses; i++) {
      this.hypotheses.push({
        prior:1.0/this.numberOfHypotheses,
        desc:"",
      });
    }
  };
  this.inference = function() {
    this.stage = "inference";
    this.addEvidence();
  };
  this.addEvidence = function(lastEvidence) {
    if (lastEvidence) {
      lastEvidence.inEdit=false;
    }
    this.calc();
    var evidence = {
      desc:"",
      inEdit:true,
      hypotheses:[]
    };
    this.evidences.push(evidence);
    for (var i=0; i<this.numberOfHypotheses; i++) {
      var hypothese = {
        index:i,
        probability:0.0
      };
      evidence.hypotheses.push(hypothese);
    }
  }
  this.calc = function() {
    var priors = [];
    for (var i=0; i<this.numberOfHypotheses; i++) {
      priors[i]=this.hypotheses[i].prior;
    }
    for (var i=0; i<this.evidences.length; i++) {
      var evidence = this.evidences[i];
      var sum = 0.0;
      for (var j=0; j<evidence.hypotheses.length; j++) {
        var hypothese = evidence.hypotheses[j];
        hypothese.probability=priors[j]*hypothese.likelihood;
        sum+=hypothese.probability;
      }
      for (var j=0; j<evidence.hypotheses.length; j++) {
        var hypothese = evidence.hypotheses[j];
        priors[j]=hypothese.probability/sum;
      }
    }
    this.results=[];
    for (var i=0; i<priors.length; i++) {
      this.results[i]={
        desc:this.hypotheses[i].desc,
        value:(Math.round(priors[i]*100*100)/100.0)
      };
    };
  }
});

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
