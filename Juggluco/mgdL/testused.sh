for i in *jpg ;do if ! grep -q $i *.html;then echo $i;fi;done
