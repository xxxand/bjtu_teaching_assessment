# 北京交通大學教務系統評教一鍵填寫教學

下面提供三種方法，第一種親測有效，也最推薦。

## 1. 控制台注入

進入具體科目的評教頁面後，按鍵盤 `F12` 或 `右鍵網頁空白處 → 檢查 / Inspect`，然後點擊上方的 `控制台 / Console`，貼上以下腳本並按 Enter：

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

  // 點擊所有「符合」
  const fuheCount = clickLabelByText('符合', true);

  // 點擊「優秀」
  const youxiuCount = clickLabelByText('優秀', false);

  // 文字框填寫「無」
  const textareas = [...document.querySelectorAll('textarea')]
    .filter(el => !el.disabled && el.offsetParent !== null);

  textareas.forEach(el => {
    el.value = '無';
    el.dispatchEvent(new Event('input', { bubbles: true }));
    el.dispatchEvent(new Event('change', { bubbles: true }));
  });

  console.log(`已點擊 ${fuheCount} 個「符合」`);
  console.log(`已點擊 ${youxiuCount} 個「優秀」`);
  console.log(`已填寫 ${textareas.length} 個文字框為「無」`);
})();
```

檢查無誤後提交即可。

## 2. 書籤注入

按鍵盤 `Ctrl + Shift + B` 顯示書籤列，新增一個書籤，網址位置填入下面這一整段程式碼：

```javascript
javascript:(()=>{function c(t,a){const L=[...document.querySelectorAll('label')].filter(l=>l.innerText.trim()===t&&l.offsetParent!==null);const T=a?L:L.slice(0,1);T.forEach(l=>{const id=l.getAttribute('for');const i=id?document.getElementById(id):l.querySelector('input[type="radio"]');if(i&&!i.disabled){l.click();i.click();i.checked=true;i.dispatchEvent(new Event('input',{bubbles:true}));i.dispatchEvent(new Event('change',{bubbles:true}));}});return T.length}const a=c('符合',true);const b=c('優秀',false);const ts=[...document.querySelectorAll('textarea')].filter(e=>!e.disabled&&e.offsetParent!==null);ts.forEach(e=>{e.value='無';e.dispatchEvent(new Event('input',{bubbles:true}));e.dispatchEvent(new Event('change',{bubbles:true}));});alert(`已填寫：符合 ${a} 個，優秀 ${b} 個，文字框 ${ts.length} 個。請檢查後手動儲存。`);})();
```

進入具體科目的評教頁面後，點擊剛剛的書籤即可自動填寫目前頁面。

## 3. 油猴注入

安裝 Tampermonkey 外掛後，新增腳本，把下面程式碼貼進去儲存：

```javascript
// ==UserScript==
// @name         北京交通大學評教一鍵填寫
// @namespace    bjtu-assessment-helper
// @version      1.0
// @description  一鍵選擇符合、優秀，並填寫無
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
    const youxiuCount = clickLabelByText('優秀', false);

    const textareas = [...document.querySelectorAll('textarea')]
      .filter(el => !el.disabled && el.offsetParent !== null);

    textareas.forEach(el => {
      el.value = '無';
      el.dispatchEvent(new Event('input', { bubbles: true }));
      el.dispatchEvent(new Event('change', { bubbles: true }));
    });

    alert(`已填寫：符合 ${fuheCount} 個，優秀 ${youxiuCount} 個，文字框 ${textareas.length} 個。請檢查後手動儲存。`);
  }

  function addButton() {
    if (document.getElementById('bjtu-assessment-helper-btn')) return;

    const btn = document.createElement('button');
    btn.id = 'bjtu-assessment-helper-btn';
    btn.textContent = '一鍵填寫評教';

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

裝好後，打開評教頁面，右上角會多一個「一鍵填寫評教」按鈕，點一下就行。

## 致謝

ChatGPT 5.5。
