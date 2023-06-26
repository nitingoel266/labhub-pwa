# LabHub PWA

## Before deployment

Before starting the deployment process, please ensure to take the latest code from the `main` branch of the repo:

`git clone -b main --single-branch https://gitlab.dewsolutions.in/ft/labhub-pwa.git`  
`cd labhub-pwa && git checkout main`  

## Deployment process
Go to the root directory of the project and run the following command:  
`npm run prod`  

## Check deployment status

You can check the deployment status by running the following command:  
`npm run pm2:ls`  

## Test your deployment

You can test if the deployment is correctly working by issuing a `curl` request on *port 3000*:  
`curl http://localhost:3000/`  
If you are getting response using the above command, then you have correctly deployed the application.

## Exposing the application to the Web
You can expose the application to the web using a *reverse proxy* like **Nginx** by serving the content for the exposed domain/website from the 3000 port (*http://localhost:3000/*) on the server.

## Notes

* Before running the deployment command `npm run prod`, please ensure that `Node.js` **version 18+** is installed in the deployment environment.  
* Note that the application starts on **port 3000**. Therefore, please ensure that port 3000 is not already used by some other process in the deployment environment.
