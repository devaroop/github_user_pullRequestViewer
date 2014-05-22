Github User Pull Request Viewer :)
=============================

### It gives the idea of a user's open source contributions on GitHub, view the pull requests in different tabs, etc. Try link: http://devaroop.github.io/github_user_pullRequestViewer/

##How to use?

* Try the above URL, enter your Github Login and hit 'enter'. Thats it !
* You can paginate results to see more using the "Next Page" button at the bottom.

##How it works?

* It fetches user's activity details using the Github Events API (https://developer.github.com/v3/activity/events/)
* Filters the pull requests opened by the user
* Displays on the screen, thats it !

#####Challenges:

* This application does not use any server, its all in the browser :) Thanks to the events API supporting CORS requests..yee
* The events API returns only 30 (max) results per request but allows pagination and hence the number of items may be different in each page.
* Some API result pages may not contain any pullRequestEvent for the user, in that case, it automatically switches to the next page until there are no activities of the user.


##Contributing

* If you have any suggestions, or want to contribute, feel free to fork and open a pull request.
* Once you do that, just try the application on your browser and see if your above pull request appeared in the list :) Just kidding !

##Development

* Download the code, load the 'index.html' using a web server on your machine, and start developing.