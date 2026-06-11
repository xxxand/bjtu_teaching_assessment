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
