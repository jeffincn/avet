webpackJsonp([26],{1347:function(s,n){s.exports={content:["article",["p","\u6211\u4eec\u63d0\u4f9b ",["a",{title:null,href:"https://github.com/zeit/styled-jsx"},"styled-jsx"],' \u4f5c\u4e3a css in js \u7684\u65b9\u6848, \u5b83\u6709\u7740\u7c7b\u4f3c Web Components \u7684 "shadow CSS" \u7279\u6027\uff0c\u540c\u65f6\u5b83\u8fd8\u80fd\u5f88\u597d\u7684\u652f\u6301 server-rendering\uff0c\u800c\u4e14\u6709\u7740\u4e0d\u9519\u7684\u6027\u80fd\u3002'],["p","\u5b83\u6709\u5982\u4e0b\u7279\u6027\uff1a"],["ul",["li",["p","\u5b8c\u6574\u652f\u6301 CSS"]],["li",["p","\u8fd0\u884c\u65f6\u5927\u5c0f\u53ea\u6709 3kb, (gzipped \u4e4b\u540e)"]],["li",["p","\u5b8c\u5168\u9694\u79bb: \u9009\u62e9\u5668, \u52a8\u753b, \u5173\u952e\u5e27"]],["li",["p","\u652f\u6301\u524d\u7f00"]],["li",["p","\u9ad8\u6027\u80fd"]],["li",["p","Source maps"]],["li",["p","\u52a8\u6001\u6837\u5f0f"]],["li",["p","CSS \u9884\u5904\u7406"]]],["h2","\u5b83\u5982\u4f55\u5de5\u4f5c"],["p","\u8fd9\u662f\u4e00\u822c\u4f8b\u5b50\uff1a"],["pre",{lang:"javascript",highlighted:'<span class="token keyword">export</span> <span class="token keyword">default</span> <span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token operator">=</span><span class="token operator">></span>\n  <span class="token operator">&lt;</span>div<span class="token operator">></span>\n    <span class="token operator">&lt;</span>p<span class="token operator">></span>only <span class="token keyword">this</span> paragraph will <span class="token keyword">get</span> the style <span class="token punctuation">:</span><span class="token punctuation">)</span><span class="token operator">&lt;</span><span class="token operator">/</span>p<span class="token operator">></span>\n\n    <span class="token punctuation">{</span> <span class="token comment" spellcheck="true">/* \u8fd9\u91cc\u4f60\u53ef\u4ee5\u5f15\u5165 &lt;Component />\uff0c\u8fd9\u91cc\u7684 P \u6837\u5f0f\u4e0d\u4f1a\u5f71\u54cd\u5230\u8fd9\u4e2a\u7ec4\u4ef6\u5185\u90e8\u7684\u6837\u5f0f */</span> <span class="token punctuation">}</span>\n\n    <span class="token operator">&lt;</span>style jsx<span class="token operator">></span><span class="token punctuation">{</span><span class="token template-string"><span class="token string">`\n      p {\n        color: red;\n      }\n    `</span></span><span class="token punctuation">}</span><span class="token operator">&lt;</span><span class="token operator">/</span>style<span class="token operator">></span>\n  <span class="token operator">&lt;</span><span class="token operator">/</span>div<span class="token operator">></span>'},["code","export default () =>\n  <div>\n    <p>only this paragraph will get the style :)</p>\n\n    { /* \u8fd9\u91cc\u4f60\u53ef\u4ee5\u5f15\u5165 <Component />\uff0c\u8fd9\u91cc\u7684 P \u6837\u5f0f\u4e0d\u4f1a\u5f71\u54cd\u5230\u8fd9\u4e2a\u7ec4\u4ef6\u5185\u90e8\u7684\u6837\u5f0f */ }\n\n    <style jsx>{`\n      p {\n        color: red;\n      }\n    `}</style>\n  </div>"]],["p","\u8fd9\u4e2a\u4f8b\u5b50\u6700\u540e\u88ab\u7f16\u8bd1\u6210\u4e0b\u9762\u8fd9\u6837\uff1a"],["pre",{lang:"javascript",highlighted:'<span class="token keyword">import</span> <span class="token punctuation">{</span> style <span class="token keyword">as</span> _JSXStyle <span class="token punctuation">}</span> <span class="token keyword">from</span> <span class="token string">\'avet/styledJsx\'</span><span class="token punctuation">;</span>\n\n<span class="token keyword">export</span> <span class="token keyword">default</span> <span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token operator">=</span><span class="token operator">></span>\n  <span class="token operator">&lt;</span>div className<span class="token operator">=</span><span class="token string">\'jsx-123\'</span><span class="token operator">></span>\n    <span class="token operator">&lt;</span>p className<span class="token operator">=</span><span class="token string">\'jsx-123\'</span><span class="token operator">></span>only <span class="token keyword">this</span> paragraph will <span class="token keyword">get</span> the style <span class="token punctuation">:</span><span class="token punctuation">)</span><span class="token operator">&lt;</span><span class="token operator">/</span>p<span class="token operator">></span>\n    <span class="token operator">&lt;</span>_JSXStyle styleId<span class="token operator">=</span><span class="token string">\'123\'</span> css<span class="token operator">=</span><span class="token punctuation">{</span><span class="token template-string"><span class="token string">`p.jsx-123 {color: red;}`</span></span><span class="token punctuation">}</span> <span class="token operator">/</span><span class="token operator">></span>\n  <span class="token operator">&lt;</span><span class="token operator">/</span>div<span class="token operator">></span>'},["code","import { style as _JSXStyle } from 'avet/styledJsx';\n\nexport default () =>\n  <div className='jsx-123'>\n    <p className='jsx-123'>only this paragraph will get the style :)</p>\n    <_JSXStyle styleId='123' css={`p.jsx-123 {color: red;}`} />\n  </div>"]],["h2","\u4e3a\u4ec0\u4e48\u8981\u8fd9\u6837"],["p","\u552f\u4e00\u7684 className \u7ed9\u4e86\u6211\u4eec\u66f4\u597d\u7684\u6837\u5f0f\u5c01\u88c5\uff0c\u907f\u514d\u5927\u8303\u56f4\u7684\u6837\u5f0f\u6c61\u67d3\u3002\u800c\u4e14 ",["code","_JSXStyle"]," \u4e5f\u8fdb\u884c\u4e86\u4e00\u7cfb\u5217\u7684\u4f18\u5316\uff1a"],["ul",["li",["p","\u6e32\u67d3\u65f6\u624d\u6ce8\u5165\u6837\u5f0f"]],["li",["p","\u6837\u5f0f\u53ea\u4f1a\u6ce8\u5165\u4e00\u6b21\uff0c\u5373\u4f7f\u8fd9\u4e2a\u7ec4\u4ef6\u88ab\u5f15\u5165\u591a\u6b21"]],["li",["p","\u79fb\u9664\u4e0d\u4f7f\u7528\u7684\u6837\u5f0f"]],["li",["p","\u8ffd\u8e2a\u6837\u5f0f\u5728\u670d\u52a1\u7aef\u7684\u6e32\u67d3"]]],["h3","\u628a css \u653e\u5230\u72ec\u7acb\u7684\u6587\u4ef6"],["p","\u5f53\u7136\u4f60\u4e5f\u53ef\u4ee5\u628a\u6837\u5f0f\u5355\u72ec\u5230\u6587\u4ef6\u4e2d\u3002\u901a\u8fc7\u8fd9\u79cd\u7684\u65b9\u5f0f\u4e5f\u662f\u6bd4\u8f83\u597d\u7ef4\u62a4\u7684\uff0c\u7279\u522b\u662f\u6837\u5f0f\u6bd4\u8f83\u591a\u7684\u60c5\u51b5\u4e0b\u3002"],["pre",{lang:"javascript",highlighted:'<span class="token comment" spellcheck="true">// styles.js</span>\n<span class="token keyword">import</span> <span class="token punctuation">{</span> css <span class="token punctuation">}</span> <span class="token keyword">from</span> <span class="token string">\'avet/styledJsx\'</span><span class="token punctuation">;</span>\n\n<span class="token keyword">export</span> <span class="token keyword">const</span> button <span class="token operator">=</span> css<span class="token template-string"><span class="token string">`button { color: hotpink; }`</span></span><span class="token punctuation">;</span>\n<span class="token keyword">export</span> <span class="token keyword">default</span> css<span class="token template-string"><span class="token string">`div { color: green; }`</span></span><span class="token punctuation">;</span>'},["code","// styles.js\nimport { css } from 'avet/styledJsx';\n\nexport const button = css`button { color: hotpink; }`;\nexport default css`div { color: green; }`;"]],["p","\u7136\u540e\u901a\u8fc7 import \u8fdb\u884c\u5f15\u5165"],["pre",{lang:"javascript",highlighted:'<span class="token keyword">import</span> styles <span class="token keyword">from</span> <span class="token string">\'./styles\'</span>\n\n<span class="token keyword">export</span> <span class="token keyword">default</span> <span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token operator">=</span><span class="token operator">></span>\n  <span class="token operator">&lt;</span>div<span class="token operator">></span>\n    <span class="token operator">&lt;</span>button<span class="token operator">></span>styled<span class="token operator">-</span>jsx<span class="token operator">&lt;</span><span class="token operator">/</span>button<span class="token operator">></span>\n    <span class="token operator">&lt;</span>style jsx<span class="token operator">></span><span class="token punctuation">{</span>styles<span class="token punctuation">}</span><span class="token operator">&lt;</span><span class="token operator">/</span>style<span class="token operator">></span>\n    <span class="token operator">&lt;</span>style jsx<span class="token operator">></span><span class="token punctuation">{</span>button<span class="token punctuation">}</span><span class="token operator">&lt;</span><span class="token operator">/</span>style<span class="token operator">></span>\n  <span class="token operator">&lt;</span><span class="token operator">/</span>div<span class="token operator">></span>'},["code","import styles from './styles'\n\nexport default () =>\n  <div>\n    <button>styled-jsx</button>\n    <style jsx>{styles}</style>\n    <style jsx>{button}</style>\n  </div>"]],["h2","\u9488\u5bf9\u67d0\u4e2a\u8282\u70b9"],["p","\u4e0a\u9762\u7684\u4f8b\u5b50\u4e2d\u58f0\u660e\u4e86 div \u7684\u6837\u5f0f\u3002\u90a3\u4e48\u5728\u8fd9\u4e2a\u7ec4\u4ef6\u4e2d\uff0c\u6240\u6709\u7684 div \u90fd\u4f1a\u53d7\u5230\u8fd9\u4e2a\u6837\u5f0f\u7684\u5f71\u54cd\uff0c\u540c\u65f6\u88ab\u6ce8\u5165\u4e86 ",["code","jsx-123"]," \u8fd9\u4e2a\u6837\u5f0f\u3002"],["p","\u5982\u679c\u53ea\u662f\u50cf\u5f71\u54cd\u5230\u67d0\u4e2a div \u6837\u5f0f\uff0c\u90a3\u53ef\u4ee5\u901a\u8fc7\u5236\u5b9a className \u7684\u65b9\u5f0f\uff1a"],["pre",{lang:"javascript",highlighted:'<span class="token keyword">export</span> <span class="token keyword">default</span> <span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token operator">=</span><span class="token operator">></span>\n  <span class="token operator">&lt;</span>div className<span class="token operator">=</span><span class="token string">"root"</span><span class="token operator">></span>\n    <span class="token operator">&lt;</span>style jsx<span class="token operator">></span><span class="token punctuation">{</span><span class="token template-string"><span class="token string">`\n      .root {\n        color: green;\n      }\n    `</span></span><span class="token punctuation">}</span><span class="token operator">&lt;</span><span class="token operator">/</span>style<span class="token operator">></span>\n  <span class="token operator">&lt;</span><span class="token operator">/</span>div<span class="token operator">></span>'},["code",'export default () =>\n  <div className="root">\n    <style jsx>{`\n      .root {\n        color: green;\n      }\n    `}</style>\n  </div>']],["h2","\u5168\u5c40\u6837\u5f0f"],["p","\u4e00\u4e9b\u60c5\u51b5\u4e0b\u8fd8\u662f\u9700\u8981\u58f0\u660e\u5168\u5c40\u6837\u5f0f\u7684\uff0c\u90a3\u53ef\u4ee5\u901a\u8fc7 ",["code","global"]," \u5c5e\u6027\u5b8c\u6210\u3002"],["pre",{lang:"javascript",highlighted:'<span class="token keyword">export</span> <span class="token keyword">default</span> <span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token operator">=</span><span class="token operator">></span>\n  <span class="token operator">&lt;</span>div<span class="token operator">></span>\n    <span class="token operator">&lt;</span>style jsx global<span class="token operator">></span><span class="token punctuation">{</span><span class="token template-string"><span class="token string">`\n      body {\n        background: red\n      }\n    `</span></span><span class="token punctuation">}</span><span class="token operator">&lt;</span><span class="token operator">/</span>style<span class="token operator">></span>\n  <span class="token operator">&lt;</span><span class="token operator">/</span>div<span class="token operator">></span>'},["code","export default () =>\n  <div>\n    <style jsx global>{`\n      body {\n        background: red\n      }\n    `}</style>\n  </div>"]],["p","\u66f4\u591a\u7684\u4fe1\u606f\u53ef\u4ee5\u53c2\u8003 ",["a",{title:null,href:"https://github.com/zeit/styled-jsx"},"styled jsx"]," \u6587\u6863\u548c\u4f8b\u5b50"]],meta:{category:"\u7279\u6027",title:"CSS in JS",filename:"docs/spec/cssinjs.zh-CN.md"},toc:["ul",["li",["a",{className:"bisheng-toc-h2",href:"#\u5b83\u5982\u4f55\u5de5\u4f5c",title:"\u5b83\u5982\u4f55\u5de5\u4f5c"},"\u5b83\u5982\u4f55\u5de5\u4f5c"]],["li",["a",{className:"bisheng-toc-h2",href:"#\u4e3a\u4ec0\u4e48\u8981\u8fd9\u6837",title:"\u4e3a\u4ec0\u4e48\u8981\u8fd9\u6837"},"\u4e3a\u4ec0\u4e48\u8981\u8fd9\u6837"]],["li",["a",{className:"bisheng-toc-h2",href:"#\u9488\u5bf9\u67d0\u4e2a\u8282\u70b9",title:"\u9488\u5bf9\u67d0\u4e2a\u8282\u70b9"},"\u9488\u5bf9\u67d0\u4e2a\u8282\u70b9"]],["li",["a",{className:"bisheng-toc-h2",href:"#\u5168\u5c40\u6837\u5f0f",title:"\u5168\u5c40\u6837\u5f0f"},"\u5168\u5c40\u6837\u5f0f"]]]}}});