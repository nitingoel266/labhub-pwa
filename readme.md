# LabHub PWA

## Before deployment

Bfore starting the deployment process please ensure that you have the latest code from the `main` branch of the following repo:

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

* Before the above deployment command is run, please ensure that a `Node.js` version 18+ is installed in the deployment environment.  
