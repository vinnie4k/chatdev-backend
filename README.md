# chatdev-backend

Backend for Intro to iOS Course - Assignment 3: ChatDev

## Setup Instructions

### NodeJS

We will be using the NodeJS runtime environment. If you have Homebrew, you can install it with `brew install node`. Otherwise, follow installation guide [here](https://nodejs.org/en/download).

### Firebase Command Line Tools

Next, you need to install Firebase tools. We will be using the node package manager (npm) to do this: `npm install -g firebase-tools`

Once you have installed the Firebase tools, you may need to login. Run `firebase login:add` to connect your Google account.

### Environment Variables

To import our secrets, we will be using ************direnv************.
1. Install **direnv** [here](https://direnv.net/docs/installation.html).
2. Download the `.envrc` file given to you.
3. Drag this file into the root directory and type the following commands:
    1. `direnv allow`
    2. `eval "$(direnv hook zsh)"`
4. You should get a response back indicating that these environment variables have been loaded in.
