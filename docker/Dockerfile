# Set the environment using a build arg. Default to prod.
ARG BUILD_STAGE=prod

#################################################################
### Base stage needed by all stages.
#################################################################
FROM node:18.3.0-buster-slim as base

# Set env variables used by all stages.
ARG BUILD_STAGE

ENV BUILD_STAGE=${BUILD_STAGE}
ENV USER=node
ENV GROUP=node

WORKDIR /usr/src/app

# # Adds Cruise root CA to node. https://nodejs.org/api/cli.html#cli_node_extra_ca_certs_file
# ENV NODE_EXTRA_CA_CERTS=/usr/local/share/ca-certificates/secure.car_R2_Root_Authority.crt
# RUN wget https://s3-us-west-2.amazonaws.com/cert.pki.secure.car/R2/rsa/pem -O $(echo $NODE_EXTRA_CA_CERTS) && \
#   chmod 0644 $(echo $NODE_EXTRA_CA_CERTS) && \
#   update-ca-certificates

RUN apt-get update && apt-get install -y \
  curl

# Install pnpm
RUN corepack enable && \
  corepack prepare pnpm@7.11.0 --activate

# Install tini process manager.
RUN curl -sSL https://github.com/krallin/tini/releases/download/v0.18.0/tini > /usr/bin/tini && \
  chmod 755 /usr/bin/tini


#################################################################
### Dev stage.
#################################################################
FROM base as dev

# Install fixuid for fixing file permissions in dev.
RUN curl -SsL https://github.com/boxboat/fixuid/releases/download/v0.4/fixuid-0.4-linux-amd64.tar.gz | tar -C /usr/bin -xzf - && \
  chown root:root /usr/bin/fixuid && \
  chmod 4755 /usr/bin/fixuid && \
  mkdir -p /etc/fixuid && \
  printf "user: $USER\ngroup: $GROUP\n" > /etc/fixuid/config.yml

RUN apt-get update && \
  DEBIAN_FRONTEND=noninteractive apt-get install -y --no-install-recommends \
  postgresql-client && \
  apt-get install -y --no-install-recommends procps && \
  apt-get clean && \
  rm -rf /var/lib/apt/lists/*

#################################################################
### Install node modules in a separate stage.
#################################################################
FROM base as node_modules

# Install packages only needed for building node_modules.
RUN apt-get update && \
  DEBIAN_FRONTEND=noninteractive apt-get install -y --no-install-recommends \
  make g++ python && \
  apt-get clean && \
  rm -rf /var/lib/apt/lists/*

WORKDIR /

COPY ./package.json ./pnpm-lock.yaml .npmrc /
RUN pnpm install --frozen-lockfile

#################################################################
### Intermediate stage used by test and prod.
#################################################################
FROM base as intermediate

# Build app as non-root user.
RUN chown -R node:node .

USER node:node


# Copy node_modules.
COPY --from=node_modules --chown=node:node /node_modules ./node_modules
COPY --chown=node:node . .

RUN pnpm build

USER root:root


#################################################################
### Test stage.
#################################################################
FROM intermediate as ci


#################################################################
### Prod stage.
#################################################################
FROM intermediate as prod

# Remove dev node_modules.
RUN pnpm prune --prod


#################################################################
### Final stage determined by build arg.
#################################################################
FROM ${BUILD_STAGE}

# Copy entrypoint.
COPY ./docker/docker-entrypoint.sh /usr/bin/docker-entrypoint.sh

RUN chmod +x /usr/bin/docker-entrypoint.sh
RUN chmod 755 /usr/bin/docker-entrypoint.sh

USER node:node

ENTRYPOINT ["/usr/bin/docker-entrypoint.sh"]
CMD ["pnpm", "start:prod"]
