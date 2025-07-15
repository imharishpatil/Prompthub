
![Logo](https://res.cloudinary.com/dps1fvdxq/image/upload/v1752571400/prompthub_uploads/oj0rtbwpfhh47km2dh0i.jpg)


#  (Frontend)

The frontend of Prompthub—a sleek, responsive React/Next.js application that delivers a smooth experience for browsing, managing, and interacting with prompts.


## Overview
The frontend serves as the user-facing layer of Prompthub, enabling 
users to:
- Register and log in (with Google Oauth)
- Explore public prompts
- create & fork prompts or comment on prompts
- Copy or share prompt content with ease
- View personal prompt collections and profiles
- and so on...
## Demo

- [**Prompthub**](https://prompthub-gamma.vercel.app/)




## Features

- Light/dark mode toggle
- Authentication via 3rd-party providers (Google)
- Prompt Management – create, edit, delete, fork, comment
- Search and Filtering – discover prompts by tags, keywords.
- Profile Dashboard – curated view of user activity
- Copy to Clipboard button for easy reuse
- Fully Responsive Design using Tailwind CSS


## Tech Stack

**Framework:** Next.js (React) with Typescript

**Styling:** Tailwind CSS and ShadcnUI

**State Management:** React Context API

**Utilities:** Graphql Apis, Cloudinary (for image storage).

**Deployment:** Vercel


## setup & Installation

1. Clone the repo:
```bash
git clone https://github.com/imharishpatil/Prompthub.git
cd Prompthub/frontend
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
5. Visit **http://localhost:3000** in your browser

## Environment Variables

To run this project, you will need to add the following environment variables to your .env file

`NEXT_PUBLIC_GRAPHQL_ENDPOINT=`
`GOOGLE_CLIENT_ID=`
`CLOUDINARY_CLOUD_NAME=`
`CLOUDINARY_API_KEY=`
`CLOUDINARY_API_SECRET=`


## Deployment

To deploy this project 
1. Build for production:
```bash
npm run build
```
2. Deploy via Vercel (recommended): connect repo in Vercel dashboard.

3. Or deploy on any static host or Node.js environment, making sure API_URL and auth config match your backend.


## Contributing

Contributions are welcomed! Please follow these steps:

1. Fork the repo
2. Create a feature/xyz branch
3. Commit updates with descriptive messages
4. Open a Pull Request explaining your changes
Please ensure your code meets linting standards and is formatted consistently.


## Acknowledgements

 - [ShadcnUI Components ](https://ui.shadcn.com)
 - [Lucid Icons](https://lucide.dev)
 - [Cloudinary- image cloud storage](hhttps://cloudinary.com)


## Feedback

If you have any feedback, please reach out to us at 
- [**Profile**](https://harishpatil.vercel.app/)
- [**Email**](imharishpatil@gmail.com)

Enjoy using Prompthub? Don't forget to ⭐ the repo!
