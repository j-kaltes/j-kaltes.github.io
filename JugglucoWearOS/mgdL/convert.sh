for file in *.png
do
 convert $file -background white -alpha remove -alpha off ${file/.png/-white.png}
done
