# Web Push

无须安装软件，即可向设备推送通知

测试通知地址: https://web-push-codelab.glitch.me

发送通知的结构体为

```
{
  "notification_config": {
    "title": "标题",
    ...Notification.Options, // 具体更多字段可参考: https://developer.mozilla.org/en-US/docs/Web/API/ServiceWorkerRegistration/showNotification，某些字段在某些设备上不生效
  }
}
```