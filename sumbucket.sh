aws s3 ls $1 | awk '{print $3}' | python -c "import numpy; import sys; print('{:,}'.format(numpy.sum([int(x) for x in sys.stdin.readlines()])))"

