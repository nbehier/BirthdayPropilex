var User = Backbone.Model.extend({
  idAttribute: "Id",
		
  defaults: {
    "edit": false,
    "active": false,
    "editing": false
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
  
  validate: function(attributes) {
	  //if (! _.isString(attributes.Firstname ) ) { return {'message':'Firstname not a string', 'attribut': 'Firstname'}; }
	  //if (attributes.Firstname.length == 0 ) { return {'message':'Firstname empty string', 'attribut': 'Firstname'}; }
	  return true;
  }

});
