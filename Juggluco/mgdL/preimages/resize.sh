for fil in *.jpg *.png
do
 convert $fil -quality 10% ../$fil
done

