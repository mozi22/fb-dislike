var successURL = 'https://www.facebook.com/connect/login_success.html';

function onFacebookLogin() {


                    chrome.tabs.getAllInWindow(null, function(tabs) {
                        for (var i = 0; i < tabs.length; i++) {
                            if (tabs[i].url.indexOf(successURL) == 0) {
                                var params = tabs[i].url.split('#')[1];
                                access = params.split('&')[0];
                                console.log(access);
                                chrome.tabs.onUpdated.removeListener(onFacebookLogin);
                                
                                chrome.browserAction.setPopup({popup: "popup2.html"});


                                var script = document.createElement("script");
                                script.src = "https://graph.facebook.com/me?" + access + "&callback=displayUser";
                                document.body.appendChild(script);

                            }
                        }
                    });

            }

            function displayUser(user) {

                // user.name
                // user.first_name
                // user.last_name
                // user.email
                // user.id
                // user.gender

                //send object to the parse.js to insert user.
                chrome.tabs.query({}, function(tabs) {
                        for (var i=0; i<tabs.length; ++i) {
                            chrome.tabs.sendMessage(tabs[i].id, {type: "userloggedIn", user : user }, function(response) {});
                            // if(tabs[i].url.indexOf("https://www.facebook.com/connect/") > -1){
                            //     chrome.tabs.remove(tabs[i].id);
                            // }
                        }

                });



            }

            chrome.tabs.onUpdated.addListener(onFacebookLogin);
