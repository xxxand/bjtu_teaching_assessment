[简体中文](./README.md) | [繁體中文](./README.zh-Hant.md) | [English](./README.en.md)

# BJTU Teaching Assessment One-Click Filler

Three methods are provided below. Method 1 is personally tested and most recommended.

## 1. Console Injection

After entering the assessment page for a specific course, press `F12` or `Right-click empty area → Inspect`, then click the `Console` tab, paste the following script, and press Enter:

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

  // Click all "符合" (Meets Expectations)
  const fuheCount = clickLabelByText('符合', true);

  // Click "优秀" (Excellent)
  const youxiuCount = clickLabelByText('优秀', false);

  // Fill textareas with "无" (None)
  const textareas = [...document.querySelectorAll('textarea')]
    .filter(el => !el.disabled && el.offsetParent !== null);

  textareas.forEach(el => {
    el.value = '无';
    el.dispatchEvent(new Event('input', { bubbles: true }));
    el.dispatchEvent(new Event('change', { bubbles: true }));
  });

  console.log(`Clicked ${fuheCount} "符合"`);
  console.log(`Clicked ${youxiuCount} "优秀"`);
  console.log(`Filled ${textareas.length} textareas with "无"`);
})();
```

Verify and submit.

## 2. Bookmarklet Injection

Press `Ctrl + Shift + B` to show the bookmarks bar, add a new bookmark, and paste the following code into the URL field:

```javascript
javascript:(()=>{function c(t,a){const L=[...document.querySelectorAll('label')].filter(l=>l.innerText.trim()===t&&l.offsetParent!==null);const T=a?L:L.slice(0,1);T.forEach(l=>{const id=l.getAttribute('for');const i=id?document.getElementById(id):l.querySelector('input[type="radio"]');if(i&&!i.disabled){l.click();i.click();i.checked=true;i.dispatchEvent(new Event('input',{bubbles:true}));i.dispatchEvent(new Event('change',{bubbles:true}));}});return T.length}const a=c('符合',true);const b=c('优秀',false);const ts=[...document.querySelectorAll('textarea')].filter(e=>!e.disabled&&e.offsetParent!==null);ts.forEach(e=>{e.value='无';e.dispatchEvent(new Event('input',{bubbles:true}));e.dispatchEvent(new Event('change',{bubbles:true}));});alert(`Filled: ${a} "符合", ${b} "优秀", ${ts.length} textareas. Please check and manually save.`);})();
```

After entering the assessment page, click the bookmark to auto-fill the current page.

## 3. Tampermonkey Userscript

Install the Tampermonkey extension, create a new script, and paste the following code:

```javascript
// ==UserScript==
// @name         BJTU Teaching Assessment One-Click Filler
// @namespace    bjtu-assessment-helper
// @version      1.0
// @description  One-click select "符合" and "优秀", fill "无"
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

    alert(`Filled: ${fuheCount} "符合", ${youxiuCount} "优秀", ${textareas.length} textareas. Please check and manually save.`);
  }

  function addButton() {
    if (document.getElementById('bjtu-assessment-helper-btn')) return;

    const btn = document.createElement('button');
    btn.id = 'bjtu-assessment-helper-btn';
    btn.textContent = 'One-Click Fill';

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

After installation, a "One-Click Fill" button will appear in the top-right corner of the assessment page.

## Acknowledgements

ChatGPT 5.5.
