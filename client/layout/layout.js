Template.layout.onRendered(function() {
  //get the padding
  const side_bar_height = $("#side_nav_bar").height();
  const functions_height = $("#functions").height();
  const information_height = $("#information").height();
  const information_margin = 10;
  const padding = side_bar_height - functions_height - information_height - information_margin * 2;

  $('#information').attr("style", "padding-top:" + padding + "px");

  $(window).resize(function() {
    const side_bar_height = $("#side_nav_bar").height();
    const functions_height = $("#functions").height();
    const information_height = $("#information").height();
    const information_margin = 10;
    const padding = side_bar_height - functions_height - information_height - information_margin * 2;

    $('#information').attr("style", "padding-top:" + padding + "px");
  });

  $('.js-login span')
  .popup({
    content: "Sign in with your Brandeis email",
    position: 'right center',
  });

  $('.ui.dropdown').dropdown({
    action: 'hide'
  });
});

Template.profileButton.onRendered(function() {
  $('.ui.dropdown').dropdown({
    action: 'hide'
  });
});

Template.loginButton.onRendered(function() {
  $('.js-login span')
  .popup({
    content: "Sign in with your Brandeis email",
    position: 'right center',
  });
});

Template.layout.events({
  "click .js-login": function(event){
 		event.preventDefault();
 		Meteor.loginWithGoogle(function(err){
			if(err){
				if(err.toString() === "Error: Please sign-up with a Brandeis Google account. [400]"){
					window.alert("Please sign-up with a Brandeis Google account. \nIf you can't switch to your Brandeis account here, please try to add it on google.com first.");
					return;
				}
      };

      const current_url = Router.current().url;
      const arg = current_url.substring(current_url.lastIndexOf("/") + 1);
      if(/^[23456789ABCDEFGHJKLMNPQRSTWXYZabcdefghijkmnopqrstuvwxyz]{17}$/.test(arg)){
        window.onbeforeunload = function(e) {};
        document.location.reload(true);
      }

      return;
		});
 	},

  "click .js-log-out": function(event){
    event.preventDefault();
    Meteor.logout();
    Router.go('/');
  },

  "click .js-majorPlan": function(event) {
      event.preventDefault();
      Template.instance().myPageDict.set('pageName', "majorPlan");
  },
});

Template.layout.helpers({
  createAccount: function(){
    if(Meteor.userId()){
      Meteor.call("addUserProfile_Google");
    };
  },

  existsProfile: function(){
    return UserProfilePnc.findOne({userId: Meteor.userId()})
  },
});
