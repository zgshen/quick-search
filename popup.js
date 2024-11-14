let engines = [];

// 从存储中加载搜索引擎配置
chrome.storage.sync.get('searchEngines', (data) => {
  if (data.searchEngines) {
    engines = data.searchEngines;
    renderEngines();
  }
});

function createEngineElement(engine, index) {
    const div = document.createElement('div');
    div.className = 'engine-item';

    const nameInput = document.createElement('input');
    nameInput.type = 'text';
    nameInput.placeholder = '搜索引擎名称';
    nameInput.value = engine.name;
    nameInput.className = 'engine-name';

    const urlInput = document.createElement('input');
    urlInput.type = 'text';
    urlInput.placeholder = '搜索URL (使用 {q} 作为查询占位符)';
    urlInput.value = engine.url;
    urlInput.className = 'engine-url';

    const deleteButton = document.createElement('button');
    deleteButton.textContent = '删除';
    deleteButton.className = 'delete-btn';
    deleteButton.dataset.index = index;
    deleteButton.addEventListener('click', (e) => {
        const index = parseInt(e.target.dataset.index);
        removeEngine(index);
    });

    div.appendChild(nameInput);
    div.appendChild(urlInput);
    div.appendChild(deleteButton);

    return div;
}

function renderEngines() {
  const container = document.getElementById('engineList');
  container.innerHTML = '';

  engines.forEach((engine, index) => {
    const engineElement = createEngineElement(engine, index);
    container.appendChild(engineElement);
  });
  /*
  engines.forEach((engine, index) => {
    const div = document.createElement('div');
    div.className = 'engine-item';
    div.innerHTML = `
      <input type="text" placeholder="搜索引擎名称" value="${engine.name}" class="engine-name">
      <input type="text" placeholder="搜索URL (使用 {q} 作为查询占位符)" value="${engine.url}" class="engine-url">
      <button onclick="removeEngine(${index})">删除</button>
    `;
    container.appendChild(div);
  });*/
}

function removeEngine(index) {
  engines.splice(index, 1);
  renderEngines();
  //createContextMenus();
}

document.getElementById('addEngine').addEventListener('click', () => {
  engines.push({
    id: 'engine_' + Date.now(),
    name: '',
    url: ''
  });
  renderEngines();
});

document.getElementById('saveEngines').addEventListener('click', () => {
  const names = document.querySelectorAll('.engine-name');
  const urls = document.querySelectorAll('.engine-url');
  
  engines = Array.from(names).map((name, i) => ({
    id: engines[i].id,
    name: name.value,
    url: urls[i].value
  }));

  chrome.storage.sync.set({ searchEngines: engines }, () => {
    chrome.runtime.sendMessage({ type: 'updateContextMenus' });
    createContextMenus();
    alert('保存成功！');
  });
});

function createContextMenus() {
    // 清除所有现有的上下文菜单
    chrome.contextMenus.removeAll(() => {
    // 创建父菜单
    const parent = chrome.contextMenus.create({
        id: 'search',
        title: '使用搜索引擎搜索',
        contexts: ['selection']
    });

    // 为每个搜索引擎创建子菜单
    engines.forEach(engine => {
        chrome.contextMenus.create({
        id: engine.id,
        parentId: 'search',
        title: engine.name,
        contexts: ['selection']
        });
    });
    });
}
