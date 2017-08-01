for f in sessions groups hits recordings; do
  sqlite3 -header -csv private/production.sqlite3 "select * from $f;" > private/$f.csv
done
