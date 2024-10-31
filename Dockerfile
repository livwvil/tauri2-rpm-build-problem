FROM rust:bookworm

ENV NODE_VERSION 18
ENV PNPM_VERSION 9.5.0
ENV DEBIAN_FRONTEND noninteractive

WORKDIR /home

RUN set -uex; \
    apt-get update; \
    apt-get install -y ca-certificates \
      gnupg \
      libwebkit2gtk-4.1-dev \
      build-essential \
      curl \
      wget \
      file \
      libxdo-dev \
      libssl-dev \
      libayatana-appindicator3-dev \
      librsvg2-dev; \
    mkdir -p /etc/apt/keyrings; \
    curl -fsSL https://deb.nodesource.com/gpgkey/nodesource-repo.gpg.key \
     | gpg --dearmor -o /etc/apt/keyrings/nodesource.gpg; \
    echo "deb [signed-by=/etc/apt/keyrings/nodesource.gpg] https://deb.nodesource.com/node_${NODE_VERSION}.x nodistro main" \
     > /etc/apt/sources.list.d/nodesource.list; \
    apt-get -qy update; \
    apt-get -qy install nodejs; \
    rm -rf /tmp/* /var/tmp/*;

RUN npm i -g pnpm@${PNPM_VERSION}

RUN cargo install tauri-cli
