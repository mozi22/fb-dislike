var dislike_button = {

    button_icon: null,
    $document: null,




    init: function(){

      this.$document = jQuery(document);
      this.button_icon = chrome.extension.getURL("images/dislike_icon.png");
      this.button_icon_pressed = chrome.extension.getURL("images/dislike_icon_pressed.png");
    },




    // this one checks if the user is scrolling
    // and adds the button to the later posts
    // appended on scroll.
    registerScroll:function(){

      var self = this;
       

      this.$document.scroll(function() {
       var scrollPercent = 100 * $(window).scrollTop() / (self.$document.height() - $(window).height());
        if (scrollPercent >= 60) {

          self.appendButton();
          self.readOnScreenPostsID();
        } else {
        }
      });
    },


    appendButton: function(){
      // append the button to the initial page posts
      // after 2 seconds so that the posts are first
      // loaded properly and than the button appended.
      var self = this;
      setTimeout(function(){

        // it appends the button in the posts. If 
        // the button is not there.
        jQuery('._42nr:not(:has(.dislike_button))').append('<span><a data-reactroot="" class="dislike_button" role="button" href="#" title="Dislike""><img src="'+self.button_icon+'" style="margin-right:5px;margin-top:5px;" />Dislike</a></span>');

        $( ".dislike_button").unbind( "click" );
        jQuery('.dislike_button').click(function(){

            var disliked = true;

            if($(this).css('color') == "rgb(88, 144, 255)"){
              // undo
              disliked = false;

              $(this).children().attr('src',self.button_icon);
              $(this).css('color','#7f7f7f');
            }
            else{            
              $(this).children().attr('src',self.button_icon_pressed);
              $(this).css('color','#5890ff');
            }

            postid = $(this).closest('[id*="hyperfeed_story_id_"]').attr('id');

            if(postid === undefined){
              // it's a facebook page or user profile page rather than a news feed.
              tag = $(this).closest('._4-u2').attr('data-ft');
              json = $.parseJSON(tag);
              postid = json.top_level_post_id;
            }

            // remove text and only get the digits.
            postid = postid.replace( /^\D+/g, ''); 



          if( disliked == true){
  
            // disliked
            parsee.dislikedPost(postid);

          }else{
            // undo disliked
            parsee.undoDislike(postid);
          }


        });
      },2000);
    },

    // reads all post id's which are currently on the screen.
    readOnScreenPostsID: function(){
      var temp = new Array();
      $('[id*="hyperfeed_story_id_"]').each(function(){
        temp.push($(this).attr('id').replace( /^\D+/g, ''));
      });
      
      parsee.addPostsToWindow(temp,this.ChangeSelectedPostButtonColors);
    },


    ChangeSelectedPostButtonColors: function(results){

      if(results.length == 0)
        return;

      $('[id*="hyperfeed_story_id_"]').each(function(){

        index = results.indexOf($(this).attr('id').replace( /^\D+/g, ''));
        
        // if in the array we've a value, that means the post is shown on the page
        // as well as we've it in the db. Having it in the db means user disliked it before.
        if(index != -1 ){
          // make this button pressed.
          var dislike_button = $(this).find('.dislike_button');
          dislike_button.attr('src',self.button_icon_pressed);
          dislike_button.css('color','#5890ff');
        }
      });
    }

};


chrome.extension.onMessage.addListener(function(msg, sender, sendResponse) {

  if (msg.type == 'userloggedIn') {

      ds.registerScroll();
      parsee.getUser(msg.user.id);
      ds.appendButton();
      ds.readOnScreenPostsID();

      localStorage['fbd-userid'] = msg.user.id;
  }
});



ds = Object.create(dislike_button);
ds.init();

setTimeout(function(){

if(localStorage['fbd-userid'] !== undefined && localStorage['fbd-userid']!=""){

  ds.registerScroll();
  parsee.getUser(localStorage['fbd-userid']);
  ds.appendButton();
  ds.readOnScreenPostsID();

}

},1000);
