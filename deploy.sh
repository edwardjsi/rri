#!/bin/bash
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"
nvm use 20

cd ~/rri/frontend
npm ci --include=optional
npm run build

cd ~/rri/infra
npm ci
npx cdk deploy --require-approval never
