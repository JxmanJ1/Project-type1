# CS2-Matrix
Frontend
index.html: The main page of the website, which aggregates news, matches, and team rosters.

AutReg.html: The page for user authentication, containing forms for login and registration.

Steam.html: A dedicated page for official Steam news and the real-time status of game servers.

Politika.html: A static page with the site's Privacy Policy.

Used.html: A static page with the site's Terms of Use.

styles.css: The main stylesheet that defines the visual appearance of the entire website.

script.js: The main JavaScript file that handles all client-side logic, including fetching data, user interactions, and DOM manipulation.

Backend (PHP API)
login.php: Handles the user login process by verifying credentials against the user database.

register.php: Manages new user registration, including password hashing and saving data.

subscribe.php: Processes newsletter subscription requests.

news.php: An API endpoint to fetch general esports news from news.json.

steam_news.php: An API endpoint to fetch official Steam news from steam.json.

matches.php: An API endpoint to fetch match data from matches.json.

teams.php: An API endpoint to fetch team data from teams.json.

steam_status.php: An API endpoint that connects to the official Steam API to get the real-time status of game servers.

Database (JSON files)
/db/users.json: Stores registered user data (this file is created by register.php and is not provided, but its existence is implied).

/db/news.json: Contains esports news articles.

/db/matches.json: Contains data about upcoming, ongoing, and past matches.

/db/teams.json: Contains information about esports teams and their players.

/db/steam.json: Stores official news announcements from Steam.

/db/subscribers.json: Stores the email addresses of users subscribed to the newsletter.
