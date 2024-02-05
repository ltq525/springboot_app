scp dist/js/*.js spring:spring/app/
scp dist/css/*.css spring:spring/app/

ssh spring 'cd spring/app/ && ./rename.sh'
