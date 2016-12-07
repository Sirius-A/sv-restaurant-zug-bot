# sv-restaurant-zug-bot
Telegram bot to retrieve the menu of the SV restaurant in Zug (called Five Moods)

## Try it 
Add the bot using http://telegram.me/FiveMoodsBot and call `/get@FiveMoodsBot` to recieve todays menu.

If you want the bot to send you the menu regularly, try  `/getDaily@FiveMoodsBot` or  `/getPartTime@FiveMoodsBot`.


# Develop
1. To host a similar bot like this, clone this repo:

    ```
    $ git clone git@github.com:Sirius-A/sv-restaurant-zug-bot.git
    ```

2. Install all packages with

    ```
    $ npm install
    ```

3. Adjust the code and set the API token for your own bot. Talk to the [BotFather](https://telegram.me/BotFather) for that.
    To run the bot on your machine run

    ```
    $ node index.js
    ```

4. Once you’re satisfied with the behavior, commit all your files and deploy the app to Heroku

    ```
    $ heroku create
    Creating app... done, ⬢ radiant-refuge-28891
    $ git push heroku master
    ```

5. Run the following command to avoid the error log message `Error R10 (Boot timeout) -> Web process failed to bind to $PORT within 60 seconds of launch`:

    ```
    $ heroku scale web=0 worker=1
    ```

## Credits and Thanks
[Roman Blum](https://github.com/rmnblm/) for creating the [hsr-lunchbot](hsr-lunchbot), which was used as a starting point for this bot

## Disclaimer
This bot and I are not affiliated with SV Groups in any way. This bot is not officially supported by SV.