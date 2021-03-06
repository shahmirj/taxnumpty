'use strict';

describe('Controller: Calculator', function () {

  // load the controller's module
  beforeEach(module('taxnumptyApp'));

  var MainCtrl, scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    MainCtrl = $controller('Calculator', {
      $scope: scope
    });

    // Tests assume this year for calculations
    scope.selectYear({name:'UK 2013/14'});
  }));

  it('should alter depending on age', function () {
    scope.visSalary = 20000;
    scope.$digest();
    var prevIncomeTax = scope.calculatorState.incomeTax;
    scope.selectedAge = scope.ages[2];
    scope.$digest();
    expect(scope.calculatorState.incomeTax).not.toBe(prevIncomeTax);
  });

  it('Over 65s should not pay nationalInsurance', function () {
    scope.visSalary = 20000;
    scope.selectedAge = scope.ages[2];
    scope.$digest();
    expect(scope.calculatorState.nationalInsurance).toBe(0);
  });

  it('should make national insurance optional', function () {
    scope.visSalary = 20000;
    scope.calculatorState.noNI = true;
    scope.$digest();
    expect(scope.calculatorState.nationalInsurance).toBe(0);
  });

  it('should have student loan payment if selected and over the threshold', function () {
    scope.visSalary = 40000;
    scope.calculatorState.student = false;
    scope.$digest();
    expect(scope.calculatorState.studentLoan).toBe(0);
    scope.calculatorState.student = true;
    scope.$digest();
    expect(scope.calculatorState.studentLoan).toBe(2124);
  });

  it('should have student apply 9% student loan', function () {
    scope.visSalary = 17000;
    scope.calculatorState.student = false;
    scope.$digest();
    expect(scope.calculatorState.studentLoan).toBe(0);
    scope.calculatorState.student = true;
    scope.$digest();
    expect(scope.calculatorState.studentLoan).toBe(48);
    scope.visSalary = 30000;
    scope.$digest();
    expect(scope.calculatorState.studentLoan).toBe(1224);
    scope.visSalary = 16365;
    scope.$digest();
    expect(scope.calculatorState.studentLoan).toBe(0);
  });

  it('over 65s dont pay student loan', function () {
    scope.visSalary = 40000;
    scope.calculatorState.student = true;
    scope.selectedAge = scope.ages[2];
    scope.$digest();
    expect(scope.calculatorState.studentLoan).toBe(0);
  });

  it('should increase your allowance correctly if you are blind', function () {
    scope.visSalary = 16375;
    scope.calculatorState.blind = true;
    scope.$digest();
    expect(scope.calculatorState.incomeTax).toBe(955);
  });

  it('should increase your allowance correctly if you over 75 and married', function () {
    scope.visSalary = 16000;
    scope.calculatorState.married = true;
    scope.selectedAge = scope.ages[2];
    scope.$digest();
    expect(scope.calculatorState.incomeTax).toBe(276.5);
  });

  it('should allow you to specify allowances', function () {
    scope.visSalary = 40000;
    scope.calculatorState.married = true;
    scope.calculatorState.addAllowance = 1000;
    scope.$digest();
    expect(scope.calculatorState.incomeTax).toBe(5912);
    scope.visSalary = 120000;
    scope.$digest();
    expect(scope.calculatorState.incomeTax).toBe(41422);
    scope.calculatorState.blind = true;
    scope.$digest();
    expect(scope.calculatorState.incomeTax).toBe(40558);
  });

  /*it('should calculate the pension contribution of the HMRC', function () {

    scope.visSalary = 41500;
    scope.calculatorState.pension = 1000;
    scope.$digest();
    expect(scope.calculatorState.pensionHMRC).toBe(210);

    scope.calculatorState.pension = 6000;
    scope.$digest();
    expect(scope.calculatorState.pensionHMRC).toBe(1210);

    scope.visSalary = 43000;
    scope.calculatorState.pension = 43000;
    scope.$digest();
    expect(scope.calculatorState.pensionHMRC).toBe(7022);

  });


  it('should give no pensions tax relief over 50000', function () {

    scope.visSalary = 100000;
    scope.calculatorState.pension = 50000;
    scope.$digest();
    expect(scope.calculatorState.pensionHMRC).toBe(20000);

    scope.visSalary = 100000;
    scope.calculatorState.pension = 60000;
    scope.$digest();
    expect(scope.calculatorState.pensionHMRC).toBe(20000);

  });*/


});
