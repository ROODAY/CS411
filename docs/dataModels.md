# Data Models

Will be made as tables in MongoDB
* = required

## User
- String: Name *
- Number: ID *
- Object Array: Saved Trips


# Cache Usage
Cache will be "typeCache" table in database for each type of element (events, restaurants, etc.)
Eached cached item will contain time of creation, if older than 3 days, retrieve new info.
All items will be cached by route parameters for easy but specific access