#!/bin/sh
cd ~/Documents/PROJECTS/UTRDTR/BACKEND 


if [ -f ./session-store.db ]
then 
rm ~/Documents/PROJECTS/UTRDTR/BACKEND/session-store.db
fi

if [ -f ./store.db ]
then
rm ~/Documents/PROJECTS/UTRDTR/BACKEND/store.db
fi



nodemon ~/Documents/PROJECTS/UTRDTR/BACKEND/app.js
#rrm ~/Documents/PROJECTS/UTRDTR/BACKEND/session-store.db
