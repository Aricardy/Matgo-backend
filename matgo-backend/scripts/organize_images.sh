#!/bin/bash

# Create necessary directories
mkdir -p public/uploads/profiles
mkdir -p public/uploads/matatus
mkdir -p public/uploads/saccos

# Copy user profile pictures
cp /home/allan/Music/Images/dp\ users/*.jpg public/uploads/profiles/

# Copy sacco logo pictures
cp /home/allan/Music/Images/dp\ saccos/*.png public/uploads/saccos/

# Copy matatu pictures
cp /home/allan/Music/Images/Bus/*.jpg public/uploads/matatus/

echo "Images have been organized in the public/uploads directory."
