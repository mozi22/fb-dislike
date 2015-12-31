# fb-dislike

A sample chrome-extension implemented to add a dislike button on facebook posts. It also uses **parse api** on backend to keep track of the disliked posts.

To run simply download the project and add it to your chrome browser using the following steps.

1. Go to [facebook developers](https://developers.facebook.com) page and create a new facebook app.
2. Go to [parse](https://parse.com/apps/quickstart) and create a new Web project by Clicking on Data and than Web.
3. Now Download this project.
4. Replace the **APP_ID** in `popup.html` with your `facebook app id`.
5. Place the parse initialize code in `parse.js` file under the comment saying "Paste your initialize code here". 
6. Go to chrome and type `chrome://extensions/`.
7. Enable `developer mode` checkbox on the page.
8. Click `Load Unpacked Extension` and select the project folder.
9. Go to your facebook newsfeed.
10. Open Popup icon for the extension shown on top left of your browser and click the facebook login link.
11. This will open up a new tab page saying success. Close it and go back to the feed.
12. Now you'll find dislike button under each post. Enjoy !!!.
