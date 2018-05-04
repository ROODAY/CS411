# Trippppr

Trippppr introduces you to events, restaurants, points of interests, and flights for any location you might be visiting! Simply enter your trip details into the search box and press search! All manner of options will be displayed for your trip, simply click save on what interests you and save the trip at the end to be able to quickly view that information later! Happy Tripppping!

Created by [Rudhra Raveendran](https://github.com/ROODAY), [Lucy Zhan](https://github.com/lucyyz), [Nick Pearce](https://github.com/nickjpearce), and [Teng Xu](https://github.com/TengXu).

# How Trippppr Works
Trippppr makes use of a variety of APIs to function correctly. When a user first loads the page, Trippppr asks for location permissions to auto-fill the starting city. After a user completes the search form and begins a search, Trippppr first finds the latitute and longitude of the start and end cities using the Google Maps Geocode API. After finding the coordinates (and caching them to the city name for later uses), Trippppr passes the coordinates and timeframe of the trip along to Eventbrite, Zomato, Google Maps Places, and IATA Geo. Eventbrite finds the nearest events to the coordinates that fit within the timeframe, Zomato returns the nearest/most popular restaurants near the coordinates, Google Maps Places returns Points of Interest near the coordinates, and IATA Geo returns the IATA airport code of the nearest airport to each respective pair of coordinates. Every API call is also cached for 3 days to ensure quick access of data for subsequent calls. At this point Trippppr has all the information except for flights, so the IATA codes of the start and end airports and the timeframe of the trip are then sent to Goibibo to return airfare information. Now, a user has all the information they need to plan their trip. If they are logged in with Facebook OAuth, they'll find "Save" buttons on all the events/restaurants/etc, and a "Save Trip" button at the bottom of the page. This allows users to name and save their trips for easy viewing on the Saved Trips page. 

# Issues We Ran Into
For the most part, the APIs worked fine and as expected, but there were some limitations that forced us to reduce the scope of Trippppr. Initially we wanted the application to suggest recommendations for new trips based on currently saved trips, but to do so would require creating our own recommendation engine as it would have to be fine tuned to the criteria we collect for trips. We decided that such a large undertaking would be out of scope for the purpose of this application. Further, we wanted to include hotels from Goibibo, but their hotels endpoint required knowing a city ID that they defined in a large CSV, and they did not expose an API to find a city ID from a city name. Building our own API to retrieve a city ID from a name would require implementing a fuzzy matching search through a CSV, and again we decided this was out of scope. 

# Plans for Future
Ideally add in hote search and a custom recommendation engine. For the latter, we'd also have to implement a travel preferences option for users to better find travel options, as well as create new routes for better management of saved trips (currently saved trips can be made but not deleted, and cannot be edited).

# Setup
### Quick deploy with Heroku
[![Deploy](https://www.herokucdn.com/deploy/button.svg)](https://heroku.com/deploy)

### Deploying locally
Getting a local instance of Trippppr up and running only takes a couple minutes! First, set up a development MongoDB database with the following commands:
```
mkdir db
npm run mongo
```

Install the necessary dependencies:
```
npm install
npm run config
```

Edit the configuration file in `.env` for your setup, and then run the application:
```
npm run dev
```