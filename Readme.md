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

## License
```
Copyright 2015 Muazzam Ali

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

   http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
```
