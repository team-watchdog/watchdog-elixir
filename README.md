![Watchdog Elixir Logo](/public/logo.png)

# Welcome to Elixir
💻 Live URL: http://elixir.watchdog.team/
## Background
Elixir is a project launched by Team Watchdog(@teamwatchdog) in response to the medicine and medical equipment shortage caused by the 2022 Economic Crisis in Sri Lanka (https://longform.watchdog.team/whats-happening-with-the-sri-lankan-economy). 

The initial attempt was to design something that could speed up demand-side mapping, allowing hospitals to enter their needs directly. These requests would then be matched (by generic name, brand name, dosage) to the closest available entry in the NMRA database of licensed importers, so that any donors would know where to get medicine from. We've since addded the ability for donors to pledge supplies inside the system itself — where they get connected to the MOH donor division and other aid organizations directly via structured emails.

## Problems we are trying to solve
1. Collecting structured data about medicine requirements from facilities around the country.
2. Minimising typos, disambiguations, and clerical errors when collecting requests.
3. Creating a central database of all medicine requirements around the country.
4. Providing potential donors access to information about local suppliers for specific drugs.

## Approach (K.I.S.S.)
Elixir was designed so that it requires the least possible integration points. It's built to be a ***90/10 solution***. 

> See https://www.ycombinator.com/library/4D-yc-s-essential-startup-advice: 'One piece of advice that YC partner Paul Buchheit (PB) always gives in this case is to look for the “90/10 solution”. That is, look for a way in which you can accomplish 90% of what you want with only 10% of the work/effort/time. If you search hard for it, there is almost always a 90/10 solution available. Most importantly, a 90% solution to a real customer problem which is available right away, is much better than a 100% solution that takes ages to build.'


# Technical
## Tech Stack
- Typescript with NextJS
- TailwindCSS
- Postgres with Prisma
- Elasticsearch
- Sendgrid

## Environment variables
- `DATABASE_URL`: URL with authentication details for your POSTGRESQL instance. (This should go inside `.env` if you're using .env files to set environment variables.)
- `ELASTICSEARCH_CLOUD_ID`: Elastic cloud instance ID
- `ELASTICSEARCH_USERNAME`: Elasticsearch instance username
- `ELASTICSEARCH_PASSWORD`: Elasticsearch instance password
- `SENDGRID_API_KEY`: Sendgrid API Key. Sendgrid is used to send authentication emails and emails about pledges.
- `APP_HOST_URL`: Link to the dashboard used to send users back to the app from emails.
- `FORWARD_EMAILS_TO`: Array of emails separated commas. Pledge emails will get forwarded to these specific emails. 
- `JWT_SECRET`: JWT secret to generate JWTs for authentication

## Setting up on your local environment
1. Clone this repo on your machine.
2. Put your `.env.local` file inside the source folder or set the environment variables via the terminal.
3. Run `yarn install` to install all dependencies
4. Run `prisma migrate run` to setup your POSTGRES database.
5. Run `yarn dev` to start your development server
## Loading up with hospital and medicine data
Refer to: https://github.com/team-watchdog/elixir-helpers



# License
Elixir is licensed under Apache 2.0. We grant you a non-exclusive, royalty free license to use Elixir and the Watchdog logos, solely in connection with other implementations of Elixir. 
