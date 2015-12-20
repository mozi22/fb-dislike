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
        if (self.$document.scrollTop() >= 50) {

          self.appendButton();
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

};


chrome.extension.onMessage.addListener(function(msg, sender, sendResponse) {

  if (msg.type == 'userloggedIn') {

      ds.registerScroll();
      parsee.getUser(msg.user);
      ds.appendButton();
  }
});



ds = Object.create(dislike_button);
ds.init();

