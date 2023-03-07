#!/bin/bash

echo "$(pwd)"

if [[ "$EAS_BUILD_PLATFORM" == "android" ]]; then
  echo $GOOGLE_SERVICES_BASE64 | base64 --decode > google-services.json
elif [[ "$EAS_BUILD_PLATFORM" == "ios" ]]; then
  echo $GOOGLE_SERVICES_INFO_BASE64 | base64 --decode > GoogleService-Info.plist
fi

echo "$(ls)"