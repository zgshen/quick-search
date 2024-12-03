let engines = [];
  
  function loadEngines() {
    chrome.storage.sync.get('searchEngines', (data) => {
      if (data.searchEngines) {
        engines = data.searchEngines;
      }
      renderEngines();
    });
  }
  
  function renderEngines() {
    const container = document.getElementById('engineList');
    container.innerHTML = '';
    
    engines.forEach((engine, index) => {
      const div = document.createElement('div');
      div.className = 'engine-item';
      
      const nameInput = document.createElement('input');
      nameInput.type = 'text';
      nameInput.placeholder = '引擎名称';
      nameInput.value = engine.name;
      nameInput.className = 'name-input';
      
      const urlInput = document.createElement('input');
      urlInput.type = 'text';
      urlInput.placeholder = '搜索URL (使用 {q} 作为查询占位符)';
      urlInput.value = engine.url;
      urlInput.className = 'url-input';
      
      const deleteButton = document.createElement('button');
      deleteButton.textContent = '删除';
      deleteButton.className = 'delete-btn';
      deleteButton.onclick = () => removeEngine(index);
      
      div.appendChild(nameInput);
      div.appendChild(urlInput);
      div.appendChild(deleteButton);
      
      container.appendChild(div);
    });
  }
  
  function removeEngine(index) {
    engines.splice(index, 1);
    renderEngines();
  }
  
  function saveEngines() {
    const nameInputs = document.querySelectorAll('input:nth-child(1)');
    const urlInputs = document.querySelectorAll('input:nth-child(2)');
    
    engines = Array.from(nameInputs).map((nameInput, i) => ({
      id: engines[i]?.id || 'engine_' + Date.now(),
      name: nameInput.value,
      url: urlInputs[i].value
    }));
  
    chrome.storage.sync.set({ searchEngines: engines }, () => {
      chrome.runtime.sendMessage({ type: 'updateContextMenus' });
      alert('保存成功！');
    });
  }
  
  document.addEventListener('DOMContentLoaded', () => {
    loadEngines();
    document.getElementById('addEngine').onclick = () => {
      engines.push({
        id: 'engine_' + Date.now(),
        name: '',
        url: ''
      });
      renderEngines();
    };
    
    document.getElementById('saveEngines').onclick = saveEngines;
  });