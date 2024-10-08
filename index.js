/**
 * @typedef {import('mdast').Root} Root
 */

import { visit } from "unist-util-visit";
import { u } from "unist-builder";

function scanRuby(str) {
  let match;
  let index = 0;
  const regex =
    /(?:\{([^\|\}]+)\|([^\|\}]+)(?:\|[^\{\|\}]+)*\})|(?:\|([^\|《》]+)《([^《》]+)》)/g;
  const result = [];

  while ((match = regex.exec(str)) !== null) {
    result.push(str.substring(index, match.index));
    if (match[1] && match[2]) {
      // {漢字|かんじ}形式の場合
      result.push([match[1], match[2]]);
    } else if (match[3] && match[4]) {
      // |漢字《かんじ》形式の場合
      result.push([match[3], match[4]]);
    }
    index = match.index + match[0].length;
  }
  result.push(str.substring(index, str.length));
  return result.filter((s) => s !== "");
}

function buildRubyToken(orig, pron) {
  return [
    u("text", { value: orig }),
    u("rp", { data: { hName: "rp" } }, [u("text", { value: "《" })]),
    u("rt", { data: { hName: "rt" } }, [u("text", { value: pron })]),
    u("rp", { data: { hName: "rp" } }, [u("text", { value: "》" })]),
  ];
}

function buildRubyAst(strs) {
  const origChars = Array.from(strs[0]);
  if (origChars.length + 1 === strs.length) {
    const result = [];
    for (let i = 0; i < origChars.length; i++) {
      result.push(...buildRubyToken(origChars[i], strs[i + 1]));
    }
    return u("ruby", { data: { hName: "ruby" } }, result);
  } else {
    const orig = strs[0];
    const pron = strs.slice(1).join("");
    return u("ruby", { data: { hName: "ruby" } }, buildRubyToken(orig, pron));
  }
}

export default function plugin() {
  /**
   * @param {Root} tree
   */
  function transformer(tree) {
    visit(tree, "text", (node, index, parent) => {
      const nodes = scanRuby(node.value).map((e) => {
        if (typeof e === "string") {
          return { type: "text", value: e };
        } else {
          return buildRubyAst(e);
        }
      });

      parent.children.splice(index, 1, ...nodes);
      return index + nodes.length;
    });
  }

  return transformer;
}
