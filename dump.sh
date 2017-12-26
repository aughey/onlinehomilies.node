dir=private3
for f in sessions groups hits recordings; do
  sqlite3 -header -csv $dir/production.sqlite3 "select * from $f;" > $dir/$f.csv
done
