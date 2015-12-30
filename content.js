var dislike_button = {

    $document: null,

    posts: new Array(),


    init: function(){
      this.$document = jQuery(document);
    },




    // this one checks if the user is scrolling
    // and adds the button to the later posts
    // appended on scroll.
    registerScroll:function(){

      var self = this;
       

      this.$document.scroll(function() {
       var scrollPercent = 100 * $(window).scrollTop() / (self.$document.height() - $(window).height());
        if (scrollPercent >= 60) {

          self.readOnScreenPostsID();
        } else {
        }
      });
    },


    /*
    *
    * 1) Reads all posts one by one and finds their ids.
    *
    * 2) Appends dislike buttons for those posts if it doesn't exists.
    *
    * 3) Makes call to db to retrieve the records with the postIds found in step 1.
    *
    * 4) If records exists, go through the posts and post objects again to find matching
    *    ids and updating the color of buttons as selected.
    *
    */

    readOnScreenPostsID: function(){

      var self = this;

      var temp = new Array();

      $('[id*="hyperfeed_story_id_"]').each(function(){

        postid = $(this).attr('id').replace( /^\D+/g, '');

        self.addDislikeButton(postid,$(this));


        temp.push(postid);
      });
      
      if(temp.length == 0){
        // maybe the page is user profile page.
        $('[class*="_4-u2 mbm _5jmm _5pat _5v3q _4-u8"]').each(function(){
          
          tag = $(this).attr('data-ft'); 
          json = $.parseJSON(tag);
          postid = json.top_level_post_id;


          self.addDislikeButton(postid,$(this));

          temp.push(postid);

        });

      }

      if(temp.length == 0){
        return;
      }

      parsee.addPostsToWindow(temp,this.changeInitialSelection,this.posts);
    },


    // this function appends a button to the posts, if it isn't appended yet.
    // and creates an object representation(posts.js) for each post dislike button.
    addDislikeButton : function(postid,tag){

      if(!this.CheckIfDislikeButtonExists(postid)){


        post = Object.create(Post);
        post.init(tag,1);
        post.setPostID(postid);

        this.posts.push(post);
      }
    },


    changeInitialSelection: function(results,posts){

      this.posts = posts;
      if(results.length == 0){
        return;
      }

      for(i=0;i<results.length;i++){

        for(j=0;j<this.posts.length;j++){

          if(results[i].get("POSTID") == this.posts[j].getPostID()){
            this.posts[j].toggleDislike();
          }
        }
      }

    },

    CheckIfDislikeButtonExists: function(id){
      for(i=0;i<this.posts.length;i++){
        if(this.posts[i].getPostID() == id){
          return true;
        }
      }
      return false;
    },

};


chrome.extension.onMessage.addListener(function(msg, sender, sendResponse) {

  if (msg.type == 'userloggedIn') {

      registerPostLoginOptions(msg.user.id);
      localStorage['fbd-userid'] = msg.user.id;
  }
});



ds = Object.create(dislike_button);
ds.init();


function registerPostLoginOptions(id){

      ds.registerScroll();
      parsee.getUser(id);
      ds.readOnScreenPostsID();
}

// if the user is already logged in and he/she refreshes the page.
setTimeout(function(){

if(localStorage['fbd-userid'] !== undefined && localStorage['fbd-userid']!=""){
  registerPostLoginOptions(localStorage['fbd-userid']);
}

},2000);
