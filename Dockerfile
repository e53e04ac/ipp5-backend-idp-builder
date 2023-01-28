#
#   @e53e04ac/ipp5-backend-idp-builder/Dockerfile
#   Copyright (C) @e53e04ac
#   MIT License
#

FROM node:18-alpine

COPY $${contextAppDirectoryRelativePath}package*.json $${containerAppDirectoryPath}

WORKDIR $${containerAppDirectoryPath}

RUN npm install

COPY $${contextAppDirectoryRelativePath} $${containerAppDirectoryPath}

RUN addgroup -S $${containerAppGroup} && adduser -S $${containerAppUser} -G $${containerAppGroup}

USER $${containerAppUser}

ENTRYPOINT $${containerAppEntrypoint}
