FROM mcr.microsoft.com/devcontainers/typescript-node:0-20

RUN apt update

ENV DEBIAN_FRONTEND noninteractive

RUN apt-get install curl gnupg -yq \
    && curl -sL https://deb.nodesource.com/setup_20.x | bash \
    && apt-get install nodejs -yq

# RUN apt update && apt -y upgrade && \
#     apt -y install python3 && \
#     apt update && apt install python3-pip -y

# Method1 - installing LibreOffice and java
# RUN apt --no-install-recommends install libreoffice -y
# RUN apt install -y libreoffice-java-common

RUN su node -c "npm install -g pnpm"
