for i in *png ;do if ! grep -q $i mmol.html;then echo $i;fi;done
