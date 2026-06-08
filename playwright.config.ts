import type {PlaywrightTestConfig} from "@playwright/test"

const config: PlaywrightTestConfig = {
  // Run all tests under the `tests/` folder.clear
  timeout: 80000,
  workers: 1,
  retries: 1,
  testMatch: [
   "tests/**/*spec.ts"
  ],
  reporter:[
    ["dot"],
    ["json",{outputFile:'test-results/result.json'}],
    ["html",{outputDir:'playwright-report'}],
    ["allure-playwright"],
    ["./core-framework/reporters/tabular-reporter.ts" , {
      emailReport: {
        enabled: false, // Set to true to enable email sending
        recipients: [""], // List of email recipients
        smtpConfig: {
          host: "smtp.gmail.com", // SMTP server host
          port: 587, // SMTP port
          secure: false, // true for 465, false for other ports
          auth: {
            user: "your-email@gmail.com", // Sender email
            pass: "your-app-password" // App password (not regular password)
          }
        }
      }
    }]
  ],
  use:{
    
    headless:false,
    // Add ignoreHTTPSErrors here to handle certificate issues
    ignoreHTTPSErrors: true,
    launchOptions:{
      args:[
        "--start-maximized",
        "--ignore-certificate-errors",
        "--allow-insecure-localhost",
        "--disable-web-security",
        "--disable-site-isolation-trials"
      ]
    },
    screenshot:"on",
    video:"retain-on-failure",
    
  },
  projects:[
    {
      name:"chrome",
      use:{
        viewport:null,
        channel:'chrome'
      }  
    }
  ]
};

export default config;