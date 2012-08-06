App.Views.IndexDocument = Backbone.View.extend({
  initialize: function() {
    this.collection = this.options.collection;
    this.render();
  },

  render: function() {
    if(this.collection.models.length > 0) {
      var out = "<h3><a href='#documents/new'>Create New</a></h3><ul>";

      this.collection.each(function(item) {
        out += "<li>";
        out += "<a href='#documents/" + item.get('Id') + "'>" + item.escape('Title') + "</a>";
        out += " [<a href='#documents/" + item.get('Id') + "/delete'>delete</a>]";
        out += "</li>";
      });

      out += "</ul>";
    } else {
      out = "<h3>No documents! <a href='#documents/new'>Create one</a></h3>";
    }
    $(this.el).html(out);
    $('#app').html(this.el);
  }
});
