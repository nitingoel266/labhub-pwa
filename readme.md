# LabHub PWA

## Before deployment

Before starting the deployment process, please ensure to take the latest code from the `main` branch of the repo:

`git clone -b main --single-branch git@github.com:abraj-dew/labhub_pwa.git`  
`cd labhub_pwa && git checkout main`  
`git pull origin main`  

**NOTE:**  
While cloning the repository using above command, if you want to use HTTPS (instead of SSH), you can use the following command:  
`git clone -b main --single-branch https://github.com/abraj-dew/labhub_pwa.git`  
However, while using this method, your normal GitHub password will not work and you will need to [create](https://github.com/settings/tokens/new) a new personal aceess token (PAT) on your GitHub account.  

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
