[简体中文](./README.md) | [繁體中文](./README.zh-Hant.md) | [English](./README.en.md)

# 北京交通大学教务系统评教一键填写教程

下面提供三种方法，第一种亲测有效，也最推荐。

## 1. 控制台注入

进入具体科目的评教页面后，按键盘 `F12` 或 `右键网页空白处 → 检查 / Inspect`，然后点击上方的 `控制台 / Console`，粘贴以下脚本并回车：

```javascript
(() => {
  function clickLabelByText(text, clickAll = false) {
    const labels = [...document.querySelectorAll('label')]
      .filter(label => label.innerText.trim() === text);

    const targets = clickAll ? labels : labels.slice(0, 1);

    targets.forEach(label => {
      const id = label.getAttribute('for');
      const input = id ? document.getElementById(id) : label.querySelector('input[type="radio"]');

      if (input && !input.disabled) {
        label.click();
        input.click();
        input.checked = true;
        input.dispatchEvent(new Event('input', { bubbles: true }));
        input.dispatchEvent(new Event('change', { bubbles: true }));
      }
    });

    return targets.length;
  }

  // 点击所有“符合”
  const fuheCount = clickLabelByText('符合', true);

  // 点击“优秀”
  const youxiuCount = clickLabelByText('优秀', false);

  // 文本框填写“无”
  const textareas = [...document.querySelectorAll('textarea')]
    .filter(el => !el.disabled && el.offsetParent !== null);

  textareas.forEach(el => {
    el.value = '无';
    el.dispatchEvent(new Event('input', { bubbles: true }));
    el.dispatchEvent(new Event('change', { bubbles: true }));
  });

  console.log(`已点击 ${fuheCount} 个“符合”`);
  console.log(`已点击 ${youxiuCount} 个“优秀”`);
  console.log(`已填写 ${textareas.length} 个文本框为“无”`);
})();
```

检查无误后提交即可。

## 2. 书签注入

按键盘 `Ctrl + Shift + B` 显示书签栏，添加一个新书签，网址位置填写下面这一整段代码：

```javascript
javascript:(()=>{function c(t,a){const L=[...document.querySelectorAll('label')].filter(l=>l.innerText.trim()===t&&l.offsetParent!==null);const T=a?L:L.slice(0,1);T.forEach(l=>{const id=l.getAttribute('for');const i=id?document.getElementById(id):l.querySelector('input[type="radio"]');if(i&&!i.disabled){l.click();i.click();i.checked=true;i.dispatchEvent(new Event('input',{bubbles:true}));i.dispatchEvent(new Event('change',{bubbles:true}));}});return T.length}const a=c('符合',true);const b=c('优秀',false);const ts=[...document.querySelectorAll('textarea')].filter(e=>!e.disabled&&e.offsetParent!==null);ts.forEach(e=>{e.value='无';e.dispatchEvent(new Event('input',{bubbles:true}));e.dispatchEvent(new Event('change',{bubbles:true}));});alert(`已填写：符合 ${a} 个，优秀 ${b} 个，文本框 ${ts.length} 个。请检查后手动保存。`);})();
```

进入具体科目的评教页面后，点击刚刚的书签即可动填写当前页面。

## 3. 油猴注入

安装 Tampermonkey 插件后，新建脚本，把下面代码粘进去保存：

```javascript
// ==UserScript==
// @name         北京交通大学评教一键填写
// @namespace    bjtu-assessment-helper
// @version      1.0
// @description  一键选择符合、优秀，并填写无
// @match        https://aa.bjtu.edu.cn/teaching_assessment/stu/*/update/
// @match        https://aa.bjtu.edu.cn/teaching_assessment/stu/*/update/*
// @grant        none
// ==/UserScript==

(function () {
  'use strict';

  function clickLabelByText(text, clickAll = false) {
    const labels = [...document.querySelectorAll('label')]
      .filter(label => label.innerText.trim() === text && label.offsetParent !== null);

    const targets = clickAll ? labels : labels.slice(0, 1);

    targets.forEach(label => {
      const id = label.getAttribute('for');
      const input = id ? document.getElementById(id) : label.querySelector('input[type="radio"]');

      if (input && !input.disabled) {
        label.click();
        input.click();
        input.checked = true;
        input.dispatchEvent(new Event('input', { bubbles: true }));
        input.dispatchEvent(new Event('change', { bubbles: true }));
      }
    });

    return targets.length;
  }

  function run() {
    const fuheCount = clickLabelByText('符合', true);
    const youxiuCount = clickLabelByText('优秀', false);

    const textareas = [...document.querySelectorAll('textarea')]
      .filter(el => !el.disabled && el.offsetParent !== null);

    textareas.forEach(el => {
      el.value = '无';
      el.dispatchEvent(new Event('input', { bubbles: true }));
      el.dispatchEvent(new Event('change', { bubbles: true }));
    });

    alert(`已填写：符合 ${fuheCount} 个，优秀 ${youxiuCount} 个，文本框 ${textareas.length} 个。请检查后手动保存。`);
  }

  function addButton() {
    if (document.getElementById('bjtu-assessment-helper-btn')) return;

    const btn = document.createElement('button');
    btn.id = 'bjtu-assessment-helper-btn';
    btn.textContent = '一键填写评教';

    btn.style.position = 'fixed';
    btn.style.right = '30px';
    btn.style.top = '120px';
    btn.style.zIndex = '999999';
    btn.style.padding = '10px 16px';
    btn.style.background = '#1677ff';
    btn.style.color = '#fff';
    btn.style.border = 'none';
    btn.style.borderRadius = '6px';
    btn.style.cursor = 'pointer';
    btn.style.fontSize = '14px';
    btn.style.boxShadow = '0 2px 8px rgba(0,0,0,.2)';

    btn.onclick = run;
    document.body.appendChild(btn);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', addButton);
  } else {
    addButton();
  }
})();
```

装好后，打开评教页面，右上角会多一个 “一键填写评教” 按钮，点一下就行。

## 致谢

ChatGPT 5.5。
