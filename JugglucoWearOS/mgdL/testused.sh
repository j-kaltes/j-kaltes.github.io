for i in *png ;do if ! grep -q $i index.html;then echo $i;fi;done
