# Welcome to SHOWTIXer

My intention was to build a site that could find relevant events and shows for music lovers and keep them in one place. I ended up using the Ticketmaster Discovery API in order to find events based on a keyword search, and the TasteDive API in order to find relevant artists dependent on a user's event choices.

## Here's a bit of how my timeline went:

### Day 1
While brainstorming ideas and exploring my options I attempted to use the Ticketfly and Eventbrite API's, but I was unable to gain access without either paying or having a fully deployed website, so I ended up building a simple search function using the Ticketmaster API. I spent most of the day learning about the API and manipulating the data to get the results I wanted, and getting the artists listed on each event, and to display them on my page.

### Day 2
I manipulated the data further and created a basic layout for my site, as well as added links to search for each artist that appeared on any event displayed, as well as added a post route to save events and accompanying information. I also spent the day setting up my databases using Sequelize, created my models of users and events, as well as added the ability to save an event to user relationship, and pull from the database to display a user's events on the favorites page.

### Day 3

I spent most of the day tweaking my models, and then decided to add an extra display page for saved events, which not only shows the artists on that particular event, but uses the list of accompanying artists to call from another API, published by TasteDive, in order to recommend similar artists that a user may enjoy based on their event choice.

### Day 4
I dived further into TasteDive, and although it is a pretty simple API, it allowed me to find a relevant YouTube video and Wikipedia "teaser" to display, giving the user a bit more of information about a particular artist. I also added links to search for Ticketmaster events by those artists' names, and links to search for a given artist in TasteDive, allowing a user to continually explore new artists and learn a little bit about them.

### Day 5
In order to add a bit of user customization, I had hoped to add a favorite genres or artists options for users, and apply those when searching the Ticketmaster API, however the search paramaters for the API weren't very easy to work with, using segment and genre "ID" numbers, which isn't very useful for a user unfamiliar with the API. I opted to add a search by zipcode and search radius, the former of which is saveable in the user profile, and automatically added to search page. When using a search radius, the Ticketmaster API allowed for either search by latitude/longitude, or geohash, neither of which is useful for an average user. I opted to use the Zipcodes and Geohash node packages, and converted the users zipcode to a geohash before adding it to the query paramaters.

### Day 6
Styling, and debugging with Heroku deployment. *(To be continued...)*

# Technologies Used
* HTML
* CSS/Bootstrap
* Javascript/JQUERY
* Node JS (Express, EJS, and many more packages)
* Sequelize/Postgres
