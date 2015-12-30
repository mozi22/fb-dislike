

var Post = {

  // the post tag.
  postTag : null,

  postID : null,

  // the dislike tag we'll embed with this post.
  associatedDislikeTag : null,

  // if this post is disliked
  disliked : false,

  // if postType = 0 , it means this is a newsfeed post
  // if postType = 1 , it means this is a profile page post.
  postType : 0,

  button_icon: chrome.extension.getURL("images/dislike_icon.png"),
  button_icon_pressed: chrome.extension.getURL("images/dislike_icon_pressed.png"),


  init: function(posttag,posttype){


    //append the button
    posttag.find("._42nr").append('<span><a data-reactroot="" class="dislike_button" role="button" href="#" title="Dislike""><img src="'+this.button_icon+'" style="margin-right:5px;margin-top:5px;" />Dislike</a></span>');


    this.postTag = posttag;
    this.associatedDislikeTag = this.postTag.find(".dislike_button");
    this.postType = posttype;
    this.registerClick();
  },

  setPostID: function(postid){
    this.postID = postid;
  },

  toggleDislike : function(addToParseArray){

    if(this.disliked){
      this.disliked = false;
      this.associatedDislikeTag.children().attr('src',this.button_icon);
      this.associatedDislikeTag.css('color','#7f7f7f');

      // this will only add the data to undoArray in parse.js if we performed
      // this operation through button click instead of it's being set on page
      // load.
      if(addToParseArray){
        parsee.undoDislike(this.postID);
      }
    }
    else{
      this.disliked = true;
      this.associatedDislikeTag.children().attr('src',this.button_icon_pressed);
      this.associatedDislikeTag.css('color','#5890ff');

      // this will only add the data to undoArray in parse.js if we performed
      // this operation through button click instead of it's being set on page
      // load.
      if(addToParseArray){
        parsee.dislikedPost(this.postID);
      }
    }

    return this.disliked;
  },

  getPostID: function(){
    return this.postID;
  },

  getPostType: function(){
    return this.postType;
  },


  isDisliked: function(){
    return this.disliked;
  },



  registerClick: function(){
    var self = this;
    this.associatedDislikeTag.click(function(){

      self.toggleDislike(true);

    });
  },


};