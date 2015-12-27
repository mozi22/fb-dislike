


var ParseObj = {

      user : null,

      // this will be an array consisting of the activity of user page
      // it will have all the postid's for which this user has pressed the
      // dislike button and if the user will undo the dislike we'll remove
      // that postid from this array.
      dislikeArray : new Array(), 

      // contains all the post id's which are currently on users screen.
      currentWindowArray: new Array(),

      undoArray : new Array(), 


      getUser: function(userid){

        var self = this;
        var user = Parse.Object.extend(Const.USER_OBJECT);
        var query = new Parse.Query(user);

        query.equalTo(Const.USER_ID, userid);

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
          if(this.dislikeArray.length > 0){
            for(var i=0; i < this.dislikeArray.length; i++){        
              var Posts = Parse.Object.extend(Const.POST_OBJECT);

              var post = new Posts();
              post.set(Const.POSTID,this.dislikeArray[i]);
              post.set(Const.USER,this.user);
              post.save();

            }

          }

          if(this.undoArray.length > 0){
            // delete from Post_obj where postID = 1,2,3  <=== 1,2,3 refers to undoArray values.

            var query = new Parse.Query(Const.POST_OBJECT);
            query.containedIn(Const.POSTID,this.undoArray);
            query.find().then(function(results) {
                return Parse.Object.destroyAll(results);
            }).then(function() {
                response.success();
            }, function(error) {
                response.error(error.message);
            });          
          }

      },


      getPosts: function(userid){
        var query = new Parse.Query(Const.POST_OBJECT);

        query.equalTo(Const.POSTID, userid);

        query.find({
          success: function(results) {

            alert("Successfully retrieved " + results.length + " scores.");

          },
          error: function(error) {

            // user does not exists or there's other problem.
            alert("Error: " + error.code + " " + error.message);
          }
        });

      },

      dislikedPost: function(id){
        this.dislikeArray.push(id)

        // temporary
        // this.savePost();
      },

      addPostsToWindow: function(postsids,func,pagetype){

        // keep only distance values.
        // The values can be repeated since fb loads posts on scroll
        // due to which this function will be called with all the ids of the page
        // the ids which are previously added will be in the array again.

        this.currentWindowArray = this.currentWindowArray.concat(postsids);
        this.currentWindowArray = this.ArrNoDupe(this.currentWindowArray);
        console.log(this.currentWindowArray.length);
        // get these records from parse in order to show the already disliked button as disliked.
        var query = new Parse.Query(Const.POST_OBJECT);
        query.containedIn(Const.POSTID,this.currentWindowArray);
        query.find().then(function(results) {
            func(results,pagetype);
        }).then(function() {
        }, function(error) {
          console.log(error);
        });
      },

      // returns the array with distinct values.
      ArrNoDupe: function(a) {
          var temp = {};
          for (var i = 0; i < a.length; i++)
              temp[a[i]] = true;
          var r = [];
          for (var k in temp)
              r.push(k);
          return r;
      },


      undoDislike: function(id){

        var index = this.dislikeArray.indexOf(id);
        if (index >= 0) {

          // just remove it from this array since we haven't saved it in the db yet.
          this.dislikeArray.splice( index, 1 );
        }
        else{
          // value does not exist in dislikeArray, this means that the undoed dislike post is not from the 
          // current activity, hence we'll keep it to remove it's record from the database.
          this.undoArray.push(id);
        }
      },

    };

var parsee = Object.create(ParseObj);

window.onbeforeunload = function() {
  parsee.savePost();
}