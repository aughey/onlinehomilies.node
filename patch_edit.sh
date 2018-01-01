#!/bin/sh

sed 's/="/:/g' < $1/edit.txt | sed 's/"$//g' > $1/edit.yaml
