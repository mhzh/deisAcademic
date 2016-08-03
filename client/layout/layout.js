Template.layout.onRendered(function() {
  $('.js-login span')
  .popup({
    content: "Sign in with your Brandeis email",
    position: 'right center',
  })
;

});

Template.layout.events({
  "click .js-login": function(event){
 		event.preventDefault();
 		Meteor.loginWithGoogle(function(err){
			if(err){
				if(err.toString() === "Error: Please sign-up with a Brandeis Google account. [400]"){
					window.alert(err);
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
});

Template.layout.helpers({
  createAccount: function(){
    if(Meteor.userId()){
      Meteor.call("addUserProfile_Google",(new Date()).toLocaleString());
    };
  },

  existsProfile: function(){
    return UserProfilePnc.findOne({userId: Meteor.userId()})
  },
});