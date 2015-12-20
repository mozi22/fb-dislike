
Parse.initialize("", "");


var ParseObj = {

      user : null,

      // this will be an array consisting of the activity of user page
      // it will have all the postid's for which this user has pressed the
      // dislike button and if the user will undo the dislike we'll remove
      // that postid from this array.
      activityArray : new Array(), 


      getUser: function(userobj){

        var self = this;
        var user = Parse.Object.extend(Const.USER_OBJECT);
        var query = new Parse.Query(user);

        query.equalTo(Const.USER_ID, userobj.id);

        query.find({
          success: function(results) {

            if(results.length == 0){
              // user doesn't exists
              self.createUser(userobj.id,userobj.name);

            }else{
              // still have to take care of this one.
              self.user = results[0];
            }

          },
          error: function(error) {


            alert("Error: " + error.code + " " + error.message);
          }
        });
      },

      createUser: function(userid,name){
        var Users = Parse.Object.extend(Const.USER_OBJECT);
        this.user = new Users();

//        this.user.set(Const.ACCESS_TOKEN,access_token);
        this.user.set(Const.USER_ID,userid);
        this.user.set(Const.USERNAME,name);
        this.user.save();

      },

      // will go through all the disliked posts and save them.
      savePost: function(){
        var self = this;

        window.onbeforeunload = function() {
          if(self.activityArray.length > 0){
            for(var i=0; i < self.activityArray.length; i++){        
              var Posts = Parse.Object.extend(Const.POST_OBJECT);

              var post = new Posts();
              post.set(Const.POSTID,this.activityArray[i]);
              post.set(Const.USER,self.user);

              self.user.add(self.post);
            }

            self.user.save();
          }
          };

      },


      getPosts: function(userid){
        var query = new Parse.Query(Const.POST_OBJECT);

        query.equalTo(Const.POSTID, userid);

        query.find({
          success: function(results) {

            // user exists.
            alert("Successfully retrieved " + results.length + " scores.");

          },
          error: function(error) {

            // user does not exists or there's other problem.

            alert("Error: " + error.code + " " + error.message);
          }
        });

      },

      dislikedPost: function(id){
        this.activityArray.push(id)
      },

      undoDislike: function(id){
        var index = this.activityArray.indexOf(id);
        if (index >= 0) {
          this.activityArray.splice( index, 1 );
        }
      },

    };

var parsee = Object.create(ParseObj);
parsee.savePost();