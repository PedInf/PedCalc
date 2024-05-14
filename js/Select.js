async function loadDataAndPopulateSelectAndTextarea(url, selectHeader, textareaHeader, selectElemId, textareaElemId, changeListener) {
  const selectElem = document.querySelector(`#${selectElemId}`);
  const textareaElem = document.querySelector(`#${textareaElemId}`);

  try {
    const jsonData = await loadData(url);
    selectElem.innerHTML = jsonData.map(({ [selectHeader]: selectValue, [textareaHeader]: textareaValue }) =>
      `<option data-value="${textareaValue}">${selectValue}</option>`
    ).join('');
    textareaElem.value = jsonData.length > 0 ? jsonData[0][textareaHeader] : '';

    // Add change event listener to update the textarea
    selectElem.addEventListener('change', () => {
      const selectedIndex = selectElem.selectedIndex;
      const selectedValue = selectElem.options[selectedIndex].getAttribute('data-value');
      textareaElem.value = selectedValue;
    });

    // Execute the change listener if provided
    if (typeof changeListener === 'function') {
      changeListener(selectElem, textareaElem);
    }
  } catch (error) {
    console.error(error.message);
  }
}

async function loadData(url) {
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error('Error loading JSON data');
    }
    return await response.json();
  } catch (error) {
    throw new Error('Error loading JSON data');
  }
}

