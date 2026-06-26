#!/bin/bash
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"
nvm use 20

cd /home/immanuels/Desktop/rri/frontend
npm ci --include=optional
npm run build

cd /home/immanuels/Desktop/rri/infra
npm ci
npx cdk deploy --require-approval never
