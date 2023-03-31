console.log('sw.js')

const createStore = () => {
  const _tableName = 'history'
  const _db = new Promise((resolve, reject) => {
    const request = self.indexedDB.open('storage', 1)
    request.onerror = reject
    request.onupgradeneeded = (event) => {
      event.target.result.createObjectStore(_tableName, { keyPath: 'createdAt' })
    }
    request.onsuccess = (event) => resolve(event.target.result)
  })
  return {
    add(info) {
      return _db.then(db => db.transaction(_tableName, 'readwrite').objectStore(_tableName)).then(objStore => objStore.add(info))
    },
    async query({ page = 1, size = 50 } = {}) {
      const db = await _db
      const objectStore = db.transaction(_tableName).objectStore(_tableName);

      return new Promise(resolve => {
        const rows = []
        objectStore.openCursor().onsuccess = (event) => {
          const cursor = event.target.result;
          if (cursor) {
            rows.push(cursor.value)
            cursor.continue()
          } else {
            const results = rows.sort((a, b) => b.createdAt - a.createdAt).slice((page - 1) * size, page * size)
            resolve(results)
          }
        };
      })
    }
  }
}

const createClientChannel = (obj) => {
  const channel = new BroadcastChannel('sw-message')
  channel.addEventListener('message', event => {
    const { type, payload, key } = event.data
    if (type !== 'invoke') return;
    const { name, args } = payload
    Promise.resolve(obj[name]?.(...args))
      .then(result => {
        channel.postMessage({ type: 'callback', payload: { name, key, result } })
      })
  })
  return {
    invoke() {

    }
  }
}

const store = createStore()

const channel = createClientChannel({
  getHistory: ({ page = 1, size = 50 } = {}) => {
    return store.query({ page, size })
  }
})

self.addEventListener("install", (event) => {
  // skipWaiting() 返回一个 promise，但完全可以忽略它
  self.skipWaiting();

  // 执行 service worker 安装所需
  // 的任何其他操作，
  // 可能需要在 event.waitUntil() 的内部进行
});

self.addEventListener('push', e => {
    const json = e.data.json()
    console.log(json)
    const { notification_config: n } = json

    const notification = self.registration.showNotification(n.title, {
      actions: [ // safari not support
        {
          action: '复制',
          title: '复制'
        }
      ],
      badge: '', // safari not support
      data: undefined, // safari not support
      ...n
    })
    e.waitUntil(Promise.all([notification, store.add({ ...json, createdAt: Date.now() })]))
})

self.addEventListener('notificationclick', e => {
  console.log(e)
  e.waitUntil(
    clients.matchAll({ type: 'window' })
      .then(clients => {
        if (!clients.length) {
          // @todo 打开一个页面
          return
        }
        const client = clients[0]
        return client.focus()
      })
  )
})