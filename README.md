sau-web
=======

Sea Around Us - Web Client

GETTING STARTED
---------------

After you clone this project...

1. Install Node/NPM. Then use NPM to install `grunt-cli` (Grunt), `bower`, and `yo` (Yeoman).
1. Install the Ruby Runtime. Then, in the terminal, install "compass" with the command `gem install compass`
1. In the Finder (or File Explorer), navigate to the project's root folder (sau-web). Duplicate the file `aws-keys-template.json` and rename it `aws-keys.json`.
1. In the terminal, navigate your working directory to the root folder (sau-web). Then type `npm install`. It will take a while to do it's thing.
1. Type `bower update`. Wait for that to finish.

That's all. To see the website in your browser, you need to run it via a grunt server. In the terminal, make sure you're working directory is sau-web, then do `grunt serve`.

By default, the application will be served on http://0.0.0.0:9000.

The application will attempt to use http://localhost:8000 as the API server.  If you'd like to connect to a different host on port 8000, start the server with the apihost argument.  To connect to a different host and port, specify it as apihostport.  For instance, to connect to the deployed API server:

<code>grunt serve --apihostport=sau-web-mt-env.elasticbeanstalk.com</code>



