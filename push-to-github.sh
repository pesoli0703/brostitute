#!/bin/bash
# Helper script to push Brostitute to GitHub
# Usage: ./push-to-github.sh <GITHUB_USERNAME> <GITHUB_TOKEN> <REPO_NAME>

USERNAME=$1
TOKEN=$2
REPO=${3:-brostitute}

if [ -z "$USERNAME" ] || [ -z "$TOKEN" ]; then
  echo "Usage: ./push-to-github.sh <GITHUB_USERNAME> <GITHUB_TOKEN> [REPO_NAME]"
  echo "Example: ./push-to-github.sh johndoe ghp_xxxxxxxxxxxx brostitute"
  exit 1
fi

echo "Creating GitHub repository: $REPO..."
curl -H "Authorization: token $TOKEN" \
     -H "Accept: application/vnd.github.v3+json" \
     https://api.github.com/user/repos \
     -d "{\"name\":\"$REPO\",\"private\":false,\"description\":\"Brostitute - Modern Intentional Dating Web Application & PWA\"}"

echo "Adding remote and pushing..."
git remote remove origin 2>/dev/null || true
git remote add origin "https://${USERNAME}:${TOKEN}@github.com/${USERNAME}/${REPO}.git"
git branch -M main
git push -u origin main

echo "Successfully pushed to https://github.com/${USERNAME}/${REPO}!"
