const webpush = require('web-push')

const pushSubscription = {
  "endpoint": "https://web.push.apple.com/QG86NXEhpotfr14AzPg6BDyeiyBIRWxhAqRnBt2Xjp2Yu48j2LHkrZuZ53WJ5ShLXhTZARmFNm6m08E2vSoOVIXVjkYLYn10x3G0zZpd2m6nM6EkqmnB8dnGuwLVq1NEBESSWmNI3zPFByQZxOnRxnmz5ChU59GnI8NMAJhZZ98",
  "keys": {
    "p256dh": "BLye9nm76vIJhLjDp1W-kg8IvLo3dLljHuZaniRoA2muUwgxGP5Z19o4wZnPjPAIqzKTq9BfDVLMtB7KjMRBiu8",
    "auth": "R7NCE881_3Ci9TQg3jqwfQ"
  }
};

const payload = `{
  "notification_config": {
    "title": "hello web push",
    "body": "这是内容体这是内容体这是内容体",
    "icon": "https://via.placeholder.com/50x50",
    "image": "https://via.placeholder.com/50x50?text=hahaha",
    "actions": [
       {"title": "复制", "action": "copy", "args": ["abc"]},
       {"title": "打开", "action": "openUrl", "args": ["https://www.baidu.com"]}
    ]
   }
}`;

const options = {
  vapidDetails: {
    subject: 'https://www.qwertyyb.com',
    publicKey: 'BBaQuJBSl1ImfSnxy5XujDhJzio3rVXAwwZHsAH9ZvJi8NNsehLifAbdzasRpbyP635md8akkidIxCu7UkBx3Mo',
    privateKey: 'hov3WUdUsfNwLvF1xx-FH_NekcjXHN8g0Vg9hYS4mN4'
  },
}

webpush.sendNotification(
  pushSubscription,
  payload,
  options
).then(res => {
  console.log(res)
})