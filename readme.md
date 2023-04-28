# LabHub PWA

## Before deployment

Before starting the deployment process, please ensure to take the latest code from the `main` branch of the repo:

`git clone -b main --single-branch git@github.com:abraj-dew/labhub_pwa.git`  
`cd labhub_pwa && git checkout main`  
`git pull origin main`  

## Deployment process
Go to the root directory of the project and run the following command:  
`npm run prod`  

## Check deployment status

You can check the deployment status by running the following command:  
`npm run pm2:ls`  

## Notes

* Before running the deployment command `npm run prod`, please ensure that `Node.js` **version 18+** is installed in the deployment environment.  
