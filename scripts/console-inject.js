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

  // 点击所有"符合"
  const fuheCount = clickLabelByText('符合', true);

  // 点击"优秀"
  const youxiuCount = clickLabelByText('优秀', false);

  // 文本框填写"无"
  const textareas = [...document.querySelectorAll('textarea')]
    .filter(el => !el.disabled && el.offsetParent !== null);

  textareas.forEach(el => {
    el.value = '无';
    el.dispatchEvent(new Event('input', { bubbles: true }));
    el.dispatchEvent(new Event('change', { bubbles: true }));
  });

  console.log(`已点击 ${fuheCount} 个"符合"`);
  console.log(`已点击 ${youxiuCount} 个"优秀"`);
  console.log(`已填写 ${textareas.length} 个文本框为"无"`);
})();
