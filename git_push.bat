@echo off
cls

call rmdir /s /q .git

echo init
call git init
echo git remote add origin
call git remote add origin https://github.com/sergeyyurkov1/peerjs.git
echo git add
call git add *

echo git commit
call git commit --all --message="commit"

@REM call git tag -a v2.0 -m "Release version 2.0"

echo git push
call git push --force origin main
@REM v2.0
@REM --tags

pause
