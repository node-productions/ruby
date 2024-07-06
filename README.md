# @nplabo/remark-ruby

This is a [remark](https://github.com/remarkjs/remark) plugin rebuilt based on remark-denden-ruby(https://www.npmjs.com/package/remark-denden-ruby).

> [!NOTE]
> version 0.0.7:
> Aozora Bunko style ruby notation (in part) is now available.

## Installation

```sh
# Of course you can use npm, yarn, pnpm or other tools.
bun add @nplabo/remark-ruby
```

## Usage

ESM only.

```js
import { unified } from "unified";
import remarkParse from "remark-parse";
import remarkRehype from "remark-rehype";
import rehypeStringify from "rehype-stringify";
import remarkRuby from "@nplabo/remark-ruby";

const md2html = (md) => {
  const result = unified()
    .use(remarkParse)
    .use(remarkRuby)
    .use(remarkRehype)
    .use(rehypeStringify)
    .processSync(md);
  return result.toString();
};

const markdown = `
{双方向散乱分布関数|そうほうこうさんらんぶんぷかんすう}
※|青空文庫《あおぞらぶんこ》風の|ルビ《ふりがな》記法
`;

console.log(md2html(markdown));
```

The result is:

```html
<!-- formatted HTML -->
<p>
  <ruby
    >双方向散乱分布関数<rp>《</rp><rt>そうほうこうさんらんぶんぷかんすう</rt
    ><rp>》</rp></ruby
  >
</p>
<p>
  ※
  <ruby>青空文庫<rp>《</rp><rt>あおぞらぶんこ</rt><rp>》</rp></ruby>
  風の
  <ruby>ルビ<rp>《</rp><rt>ふりがな</rt><rp>》</rp></ruby>
  記法
</p>
```

## Restrictions

Escaping like `\{Info\|Warning\}` is not supported due to **technical reason**. You can use inline code instead.

## LICENSE and Copyright

Copyright (c) 2022 fabon. Released under the MIT License.
