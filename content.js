var dislike_button = {

    button_icon: chrome.extension.getURL("images/dislike_icon.png"),
    button_icon_pressed: chrome.extension.getURL("images/dislike_icon_pressed.png"),
    $document: null,




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
  
    // this will keep reading all the posts id's of the page
    // as they kept on dynamically being added by facebook
    // on news feed or users profile page.

    // We'll use this to retrieve the information of these posts
    // from parse to see if they were already disliked by the user before.

    readOnScreenPostsID: function(){
      var temp = new Array();
      $('[id*="hyperfeed_story_id_"]').each(function(){
        temp.push($(this).attr('id').replace( /^\D+/g, ''));
      });
      
      if(temp.length == 0){
        // maybe the page is user profile page.
        $('._4-u2.mbm._5jmm._5pat._5v3q._4-u8._x72._50nb').each(function(){
          
          tag = $(this).attr('data-ft'); 
          json = $.parseJSON(tag);
          postid = json.top_level_post_id;

          temp.push(postid);

        });

      }

      if(temp.length == 0){
        return;
      }

      parsee.addPostsToWindow(temp,this.ChangeSelectedPostButtonColors,"profile");
    },


    ChangeSelectedPostButtonColors: function(results,pagetype){

      var button_icon =  chrome.extension.getURL("images/dislike_icon.png");
      var button_icon_pressed =  chrome.extension.getURL("images/dislike_icon_pressed.png");


      if(results.length == 0)
        return;

      var self = this;

      if(pagetype == "profile"){
        $('._4-u2.mbm._5jmm._5pat._5v3q._4-u8._x72._50nb').each(function(){

          for(i=0;i<results.length;i++){
            
            if(results[i].get("POSTID") == $.parseJSON($(this).attr('data-ft')).top_level_post_id){
              // matched. change the color of button to blue.
              var dislike_button = $(this).find('.dislike_button');
              dislike_button.attr('src',button_icon_pressed);
              dislike_button.css('color','#5890ff');
            }
          }

        });
      }
      else{

        $('[id*="hyperfeed_story_id_"]').each(function(){

          for(i=0;i<results.length;i++){
            if(results[i].get("POSTID") == $(this).attr('id').replace( /^\D+/g, '')){

              // make this button pressed.
              var dislike_button = $(this).find('.dislike_button');
              dislike_button.attr('src',button_icon_pressed);
              dislike_button.css('color','#5890ff');
            }
          }
        });
      }
    }

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
      ds.appendButton();
      ds.readOnScreenPostsID();
}

// if the user is already logged in and he/she refreshes the page.
setTimeout(function(){

if(localStorage['fbd-userid'] !== undefined && localStorage['fbd-userid']!=""){
  registerPostLoginOptions(localStorage['fbd-userid']);
}

},2000);
