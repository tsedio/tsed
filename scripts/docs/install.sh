cd docs && yarn install && cd ..

# clean
rm -rf "$PWD/docs-references/package.json"
rm -rf "$PWD/docs-references/.vuepress/scripts"
rm -rf "$PWD/docs-references/.vuepress/components"
rm -rf "$PWD/docs-references/.vuepress/styles"
rm -rf "$PWD/docs-references/.vuepress/public"
rm -rf "$PWD/docs-references/assets"
rm -rf "$PWD/docs-references/.vuepress/enhanceApp.js"
rm -rf "$PWD/docs-references/.vuepress/config.base.js"
rm -rf "$PWD/docs-references/node_modules"
rm -rf "$PWD/docs-references/docs/getting-started/"
rm -rf "$PWD/docs-references/docs/snippets/"
rm -rf "$PWD/docs-references/tutorials/snippets/"

# install
cp -f "$PWD/docs/package.json" "$PWD/docs-references"
cp -R -f "$PWD/docs/assets" "$PWD/docs-references/assets"
cp -R -f "$PWD/docs/.vuepress/scripts" "$PWD/docs-references/.vuepress/scripts"
cp -R -f "$PWD/docs/.vuepress/components" "$PWD/docs-references/.vuepress/components"
cp -R -f "$PWD/docs/.vuepress/styles" "$PWD/docs-references/.vuepress/styles"
cp -R -f "$PWD/docs/.vuepress/public" "$PWD/docs-references/.vuepress/public"
cp -f "$PWD/docs/.vuepress/enhanceApp.js" "$PWD/docs-references/.vuepress"
cp -f "$PWD/docs/.vuepress/config.base.js" "$PWD/docs-references/.vuepress"
cp -f "$PWD/docs/.vuepress/window-boot.js" "$PWD/docs-references/.vuepress"

mkdir "$PWD/docs-references/docs/"
mkdir "$PWD/docs-references/docs/getting-started/"
mkdir "$PWD/docs-references/tutorials/"

cp -R -f "$PWD/docs/snippets" "$PWD/docs-references/docs/snippets"
cp -R -f "$PWD/docs/getting-started/snippets" "$PWD/docs-references/docs/getting-started/snippets"
cp -R -f "$PWD/docs/tutorials/snippets" "$PWD/docs-references/tutorials/snippets"

ln -s "$PWD/docs/node_modules" "$PWD/docs-references/node_modules"
