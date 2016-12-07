FROM node
MAINTAINER  Attila Szeremi <attila+webdev@szeremi.com>
RUN mkdir /src
WORKDIR /src
RUN cd /src
# Copy just the package.json file file as a cache step.
COPY package.json /src/package.json

# Install yarn and install packages with it.
RUN npm i yarn -g && yarn install

# Copy the base environment variables.
COPY .env_example .env

# Now copy the rest of the files.
COPY . .

RUN npm run build
EXPOSE 1337
CMD ["npm", "run", "start"]
