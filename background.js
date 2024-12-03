let searchEngines = [
    { id: 'google', name: 'Google', url: 'https://www.google.com/search?q={q}' },
    { id: 'bing', name: 'Bing', url: 'https://www.bing.com/search?q={q}' },
    { id: 'baidu', name: 'Baidu', url: 'https://www.baidu.com/s?wd={q}' }
];

// 初始化时从存储中获取搜索引擎配置
chrome.storage.sync.get('searchEngines', (data) => {
    if (data.searchEngines) {
        searchEngines = data.searchEngines;
    } else {
        chrome.storage.sync.set({ 'searchEngines': searchEngines }, () => {
        });
    }
    createContextMenus();
});

chrome.action.onClicked.addListener(() => {
    chrome.runtime.openOptionsPage();
});

function createContextMenus() {
    // 清除所有现有的上下文菜单
    chrome.contextMenus.removeAll(() => {
    // 创建父菜单
    const parent = chrome.contextMenus.create({
        id: 'search',
        title: '按搜索引擎搜索',
        contexts: ['selection']
    });

    // 为每个搜索引擎创建子菜单
    searchEngines.forEach(engine => {
        chrome.contextMenus.create({
        id: engine.id,
        parentId: 'search',
        title: engine.name,
        contexts: ['selection']
        });
    });
    });
}

// 处理上下文菜单点击事件
chrome.contextMenus.onClicked.addListener((info, tab) => {
    if (info.selectionText) {
    const engine = searchEngines.find(e => e.id === info.menuItemId);
    if (engine) {
        const url = engine.url.replace('{q}', encodeURIComponent(info.selectionText));
        chrome.tabs.create({ url });
    }
    }
});