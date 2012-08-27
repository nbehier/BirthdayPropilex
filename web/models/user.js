var User = Backbone.Model.extend({
  idAttribute: "Id",
		
  defaults: {
    "edit": false,
    "active": false,
    "editing": false,
    "errorMessages": {}
  },
	
  url : function() {
    var base = 'users/';

    if (this.isNew()) {
      return base;
    }

    return base + (base.charAt(base.length - 1) == '/' ? '' : '/') + this.id;
  },
  
  getDisplayName: function() {
	  return this.get('Firstname') + ' ' + this.get('Lastname');
  },
  
  getNumber: function() {
	  return this.get('Firstname').search(' ');
  },
  
  isAnswered: function() {
	  return true;
  },
  /*
  validate: function(attributes) {
	  //if (! _.isString(attributes.Firstname ) ) { return {'message':'Firstname not a string', 'attribut': 'Firstname'}; }
	  //if (attributes.Firstname.length == 0 ) { return {'message':'Firstname empty string', 'attribut': 'Firstname'}; }
	  return true;
  }
  */
  validation: {
    Firstname: [{
      required: true,
      msg: 'Le prénom est requis'
    },{
      minLength: 3,
      msg: 'Le prénom doit comporter au-moins 3 caractères'
    }],
    Lastname: [{
      required: true,
      msg: 'Le nom est requis'
    },{
      minLength: 3,
      msg: 'Le nom doit comporter au-moins 3 caractères'
    }],
    Email: {
      pattern: 'email'
    }
  },
  
  removeAllErrorMessage: function(){
	  this.set('errorMessages', {}, {'silent': true});
  },
  
  addErrorMessage: function(name, value){
	  var messages = this.get('errorMessages');
	  messages[name] = value;
	  this.set('errorMessages', messages, {'silent': true});
  },
  
  hasErrorMessage: function(){
	  return !_.isEmpty(this.get('errorMessages'));
  },
  
  getErrorMessage: function(name){
	  return this.get('errorMessages')[name];
  },
  
  getAllErrorMessage: function(){
	  return this.get('errorMessages');
  },
  
  getMealsBegin: function() {
	  var meals = this.get('Meal');
	  if (meals != undefined && meals.length > 0) {
		  var firstMeal = _.first(meals);
		  return ((firstMeal['Meal.Date'].substr(-2,2) - 12) * 3) + (firstMeal['Meal.Type'] * 1) - 1;
	  }
	  return 2;
  },
  
  getMealsEnd: function() {
	  var meals = this.get('Meal');
	  if (meals != undefined && meals.length > 0) {
		  return this.getMealsBegin() + meals.length;
	  }
	  return 4;
  }
  

});
