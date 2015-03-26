#!/bin/sh

echo Building jar.
/usr/local/Cellar/ant/1.9.4/libexec/bin/ant

echo Uploading jar...
scp server.jar root@playwolf.us:~/heroes.jar

echo Restarting server
ssh root@myfi.jasonmirra.com 'screen -S heroes -X quit;screen -S heroes -d -m java -jar heroes.jar'

echo Done.
