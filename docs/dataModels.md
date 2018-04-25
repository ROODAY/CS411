# Data Models

Will be made as tables in MongoDB
* = required

## User
- String: Name *
- String: Email *
- String: Hashed Password *
- String: Current Location
- Object: Travel Preferences
	- Number: Distance Limit
	- String: Preferred Days of Week/Time
	- String: Preferrred transportation method
- Object Array: Saved Trips

## Trip
- Date: Timeframe
- String: Location
- String: Travel Method
- Object Array: Events
- Object Array: Restaurants
- Object Array: POIs


# Cache Usage

Cache will be "cache" table in database
Cache will contain locations, each one containing the following lists populated from last search. 
Eached cached item will contain time of creation, if older than 5 days, retrieve new info.
All items will be cached by location (and sorted by time if applicable)

## Events
- String: Location
- String: Name
- Date: Time
- Number: Price
- String: Link

## Transportation Methods
- String: Type (plane/bus/etc)
- Date: Time
- String: From/To
- Number: Price
- String: Link

## Restaurants
- String: Location
- String: Name
- String: Link
- String: Phone Number

## POIs
- String: Name
- String: Location
- Number: Price
- String: Extra Info (link/number/contact info)