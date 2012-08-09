App.Views.ShowUser = Backbone.View.extend({
  events: {
	  "click .setActive": "setActive",
	  "submit": "validateAndSave"
  },
  
  tagName: "li",

  initialize: function() {
    _.bindAll(this, 'render');
    this.model.bind('change', this.render);
    this.render();
  },

  render: function() {
	  var templateData = this.model.toJSON();
	  templateData.DisplayName = this.model.getDisplayName();
	  templateData.Number = this.model.getNumber();
	  templateData.IsAnswered = this.model.isAnswered();
	  if (templateData.Affiliation == null) { templateData.Affiliation = ''; }
	  
	  if (this.model.get('editing') ) {
		  var template = _.template( $("#user_edit_template").html(), templateData);
	  }
	  else {
		  var template = _.template( $("#user_show_template").html(), templateData);
	  }
	  $(this.el).html(template );
	  
	  if (this.model.get('active') ){
		  $(this.el).addClass('active');
	  }
	  else {
		  $(this.el).removeClass('active');
	  }
	  
	  return this;
  },
  
  setActive: function() {
	  if (this.$('.moreInformation').css('display') == 'none') {
		  this.model.set({'active': true});
		  $(this.el).addClass('active');
		  this.$('.moreInformation').show();
	  }
	  else {
		  this.model.set({'active': false});
		  $(this.el).removeClass('active');
		  this.$('.moreInformation').hide();
		  window.location.hash = '#';
		  return false;
	  }
  },
  
  validateAndSave: function(e) {
	  var values = this.$('form').serialize();
	  // @todo validate value
	  // send ajax PUT
	  $.ajax({
		  type: 'PUT',
		  url: '/users/' + this.model.get('Id'),
		  data: values,
		  beforeSend: function() { $('#userEditAjaxIndicator').show(); },
		  complete: function() { $('#userEditAjaxIndicator').hide(); },
		  success: function(jqXHR, textStatus, errorThrown) {
			  if (textStatus == 'success') {
				  this.model.set(jqXHR);
			  }
		  }.bind(this),
		  error: function() {}
	  });
	  // @todo Afficher les erreurs potentielles
	  // @todo Mettre à jour les données du Model
	  this.model.set({'editing': false}, {'silent': true});
	  window.location.hash = 'users/' + this.model.get('Id') + '/show';
	  return false;
  }
});
