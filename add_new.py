import pymongo
import tempfile
import sys
import subprocess
import yaml
import shutil
from pymongo import MongoClient

tempdir = tempfile.mkdtemp()
print(tempdir)

subprocess.call(['tar','xvzf','-','--directory',tempdir],stdin=sys.stdin)
subprocess.call(['sh','patch_edit.sh',tempdir])

edit = None
with open(tempdir + "/edit.yaml","r") as f:
  edit = yaml.load(f.read())

print(edit)

shutil.rmtree(tempdir)
