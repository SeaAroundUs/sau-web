sau-web
=======

Sea Around Us - Web Client

GETTING STARTED
---------------
Check [Lore](https://github.com/SeaAroundUs/lore/wiki/Setting-up-a-sandbox-environment#github-sau-web-repo) page for more info.  
After you clone this project...

1. Install Node/NPM from https://www.npmjs.com/. During the installation, be sure to check off add to PATH. If it is not an option make sure to check if it in your environmental path by typing 'where npm' in the cmd line. Then use NPM to install `grunt-cli` (Grunt), `bower`, and `yo` (Yeoman) by typing 'npm install -g package-name'
1. Install the Ruby Runtime from https://rubyinstaller.org/downloads/. During the installation, be sure to check off add to PATH. If it is not an option make sure to check if it in your environmental path by typing 'where ruby' in the cmd line. Then, in the terminal, install "compass" with the command `gem install compass`
1. In the Finder (or File Explorer), navigate to the project's root folder (sau-web). Duplicate the file `aws-keys-template.json` and rename it `aws-keys.json`.
1. In the terminal, navigate your working directory to the root folder (sau-web). Then type `npm install`. It will take a while to do it's thing.
1. If any packages come back with an error message, try 'npm install -g package-name'.

1. Type `bower update`. Wait for that to finish.

That's all. To see the website in your browser, you need to run it via a grunt server. In the terminal, make sure you're working directory is sau-web, then do `grunt serve`. 

The application will attempt to use http://localhost:8000 as the API server.  If you'd like to connect to a different host on port 8000, start the server with the apihost argument.  To connect to a different host and port, specify it as apihostport.  For instance, to connect to the deployed API server:

<code>grunt serve --apihostport=</code>



