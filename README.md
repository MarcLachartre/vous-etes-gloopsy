This is a simple app which aims to track where La Gloopsy is sticking its stickers.

A user can signin/out, login/out.
=> If logged out, a user can only see the markers on the map and click on it to see the popup containing a name, date/time and comment.
=> If logged in, a user can create a marker by using its own location coordinates or by placing it on the map. each marker is made of the following details: { id, geometry: {type, coordinate: [lng, lat]}, properties: {owner, description, email, date, time} }. A user (with the maker id) can only delete his markers, or edit its markers comment.

What is to be done now...

-   refactor
-   better typing with typescript
-   rework front end design
-   create a user db with documents wich contain fields username (and...)
-   create a user interface with a username and account editable/ with for example number of markers, get a list of my markers...
-   filter pins on the map according to who posted it
-   improve db connection (not open and close db connection on each request...)
-   add marker to fetch markers only in back end and not in client
