#/bin/sh

name=$1;

if [ "$name" = "" ]
then
  echo "Please name your parser (name needs to be in kebab-case)";
  exit;
elif [ -d "./parsers/$name" ]
then
  echo "The parser $name already exist. Please choose another name.";
  exit;
fi

# Replace - by space in name
nameWithSpace=`tr '-' ' ' <<< "$name"`;
# Capitalize every word
beautifiedName=$(echo "${nameWithSpace}" | awk '{for(i=1;i<=NF;i++)sub(/./,toupper(substr($i,1,1)),$i)}1')

# Copy in new parser to keep parser-skeleton as is
cp -R parser-skeleton "./parsers/$name";

# Replace the content. Using .bak so that we are cross platform https://stackoverflow.com/a/22084103
sed -i.bak 's;../parsers/global-libs;../global-libs;g' "parsers/$name/parser-skeleton.parser.ts";
sed -i.bak 's/parser-skeleton/'"$name"'/g' "parsers/$name/parser-skeleton.spec.ts";
sed -i.bak 's/parser-skeleton/'"$name"'/g' "parsers/$name/README.md";
sed -i.bak 's/parser-name-skeleton/'"$beautifiedName"'/g' "parsers/$name/README.md";

# Remove bak files
rm "parsers/$name/parser-skeleton.parser.ts.bak";
rm "parsers/$name/parser-skeleton.spec.ts.bak";
rm "parsers/$name/README.md.bak";

# Rename the files
mv "./parsers/$name/parser-skeleton.parser.ts" "./parsers/$name/$name.parser.ts";
mv "./parsers/$name/parser-skeleton.spec.ts" "./parsers/$name/$name.spec.ts";

# Command to test only the created parser
echo "You can now develop your parser. Go to parsers/$name and start developing 💪"
echo "You can launch your tests using yarn test parsers/$name/$name.spec.ts"
echo "You can find more informations on https://specifyapp.com/developers/parsers"