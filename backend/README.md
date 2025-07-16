
![Logo](https://res.cloudinary.com/dps1fvdxq/image/upload/v1752571400/prompthub_uploads/oj0rtbwpfhh47km2dh0i.jpg)


#  (Backend)

The backend of Prompthub, providing a secure, scalable RESTful API for user authentication, prompt management, interaction, and moderation.


## Features

- Authentication: sign up, login, Google O auth, logout.
- User Profiles: get/update profile, view stats
- Prompt CRUD: create, read (single/all), update, delete
- Social Interactions: comment, share prompts, fork
- Search & Filtering: by tags, popularity, recency
- Copy to Clipboard button for easy reuse
- Fully Responsive Design using Tailwind CSS


## Tech Stack

- **Node.js** with **Typescript** & **Graphql Apollo** server
- Database:**PostgreSQL** with **Prisma** and **Redis** for cache memory 
- Authentication: **JWT** access tokens 
- Environment Management: **dotenv**
- Deployment: **Docker, DockerCompose**, and hosted on **Render**.


## setup & Installation

1. Clone the repo:
```bash
git clone https://github.com/imharishpatil/Prompthub.git
cd Prompthub/backend
```
2. Install dependencies:
```bash
npm install
# or
yarn install
```
3. Configure environment variables

4. Run locally:
```bash
npm run dev
# or
yarn dev
```
5. The API server should be running at http://localhost:4000 (or as configured)

## Environment Variables

To run this project, you will need to add the following environment variables to your .env file

`DATABASE_URL=`
`REDIS_URL=`
`JWT_SECRET=`
`GOOGLE_CLIENT_ID=`
`PORT=`


## Deployment

To deploy this project 
1. Build for production:
```bash
npm run build
```
2. Deploy via Docker : 

- command to build images for services defined in a docker-compose.yml
```
docker-compose build
```
- start all the services defined in a docker-compose.yml
```
docker-compose up
```

3. Or deploy on any hosting service or cloud like AWS, Azure, Render....


## Contributing

Contributions are welcomed! Please follow these steps:

1. Fork the repo
2. Create a feature/xyz branch
3. Commit updates with descriptive messages
4. Open a Pull Request explaining your changes
Please ensure your code meets linting standards and is formatted consistently.


## Acknowledgements

 - [Graphql APIs ](https://graphql.org)
 - [Docker](https://www.docker.com)
 - [Prisma](https://www.prisma.io)
- [Postgresql](https://postgresql.org)
- [Redis](https://redis.io)



## Feedback

If you have any feedback, please reach out to us at 
- [**Profile**](https://harishpatil.vercel.app/)
- [**Email**](imharishpatil@gmail.com)

Enjoy using Prompthub? Don't forget to ⭐ the repo!
