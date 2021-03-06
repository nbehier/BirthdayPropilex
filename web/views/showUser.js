App.Views.ShowUser = Backbone.View.extend({
  events: {
	  "click .setActive": "setActive",
	  "submit": "validateAndSave",
	  "validated:invalid": "render",
	  "change #Answered": "changeAnsweredField"
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
	  templateData.LocationTitle = this.model.getLocationTitle();
	  if (templateData.Affiliation == null) { templateData.Affiliation = []; }
	  else { templateData.Affiliation = templateData.Affiliation.split(', '); }
	  
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
	  
	  if (this.model.hasErrorMessage() ) {
		  this.displayErrors();
	  }
	  
	  this.updateFormElements();
	  
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
	  var valuesArray = this.$('form').serializeArray();
	  
	  this.model.removeAllErrorMessage();
	  
	  _.each(valuesArray, function(element, index, list){
		  var errorMessage = this.model.preValidate(element.name, element.value);
		  if (errorMessage != '') {
			  this.model.addErrorMessage(element.name, errorMessage);
		  }
	  }, this);

	  if (this.model.hasErrorMessage() ) {
		  this.displayErrors();
		  return false;
	  }

	  // send ajax PUT
	  $.ajax({
		  type: 'PUT',
		  url: '/users/' + this.model.get('Id'),
		  data: values,
		  beforeSend: function() { $('#userEditAjaxIndicator').show(); },
		  complete: function() { $('#userEditAjaxIndicator').hide(); },
		  success: function(jqXHR, textStatus, errorThrown) {
			  if (textStatus == 'success') {
				  // Mettre à jour les données du Model
				  this.model.set(jqXHR);
			  }
			  else {
				// @todo Afficher les erreurs potentielles
			  }
		  }.bind(this),
		  error: function() {}
	  });
	  
	  this.model.set({'editing': false}, {'silent': true});
	  window.location.hash = 'users/' + this.model.get('Id') + '/show';
	  return false;
  },
  
  displayErrors: function() {
	  this.removeErrors();
	  _.each(this.model.getAllErrorMessage(), function(element, index, list){
		  var formElement = this.$('form [name=' + index + ']');
		  formElement.parent()
		  	.append('<span class="errorMessage">' + element + '</span>')
		  	.addClass('error');
	  }, this);
  },
  
  removeErrors: function() {
	  this.$('form .errorMessage').remove();
	  this.$('form .error').removeClass('error');
  },
  
  updateFormElements: function(){
		var selectMeal = this.$('select#Meal');

		if (selectMeal.length > 0 ) {
			var mealsMinRange = this.model.getMealsBegin();
			var mealsMaxRange = this.model.getMealsEnd();
			
			selectMeal.hide();
			_.each(selectMeal.children(), function(option, idx) { 
				$(option).attr('rel', idx + 0.5);
			});
			
			var tabsMeal = _.map(selectMeal.children(), function(option) { 
				return { 'text' : $(option).text(), 'data' : $(option).val() };
			});
	        
			// create the slider
			( new Razorfish.Slider( {
				width: 300,
				handleWidth: 12,
				useRange: true,
				tabs: tabsMeal,
				tabsRelative: -20
			} ) )
			.appendTo( selectMeal.parent() )
			.bind     ( 'range', this.changeRange )
			.setRange (mealsMinRange, mealsMaxRange );
		}
		
		this.displayLinkToAnswered($('input[name=Answered]:checked').val() );
	},
	
	changeRange: function(evt, min, max) {
		var selectMeal = $('select#Meal');

		_.each(selectMeal.children(), function(option) {
			var option = $(option);
			if (option.attr('rel') >= min && option.attr('rel') <= max) {
				option.attr('selected', 'selected');
			}
			else {
				option.removeAttr('selected');
			}
		});
	},
	
	changeAnsweredField: function(evt) {
		this.displayLinkToAnswered($(evt.target).val() );
	},
	
	displayLinkToAnswered: function(answeredVal) {
		if (answeredVal == 1) {
			$('.LinktoAnswered').show();
		}
		else {
			$('.LinktoAnswered').hide();
		}
	}
});
