import argparse
parser = argparse.ArgumentParser()
parser.add_argument('title', help='title of the post')
args=parser.parse_args()

from datetime import datetime
dt = datetime.now().strftime('%Y-%m-%d')
file_name="_posts/%s-%s.md" % (dt, args.title)
f = open(file_name, 'w')
f.write('---\n')
f.write('layout: post\n')
f.write('title: \n')
f.write('description: \n')
f.write('category: articles\n')
f.write('tags: \n')
f.write('---\n')
f.close()

from subprocess import call
call(['vim', file_name])
print file_name + ' generated'
