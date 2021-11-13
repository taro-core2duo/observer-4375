---
title: "how to use quake app"
tags: ""
---

# IF4375
### Information from 4375  
日本の地震観測点数である4375から命名。  
地震情報等を表示するwebサイトです。  
***
![image.png](/public/md/md1.png)
レイアウトは画像の通りです。（デザイン変更の可能性あり） 

>## 上段  

### 鉄道遅延情報
地震情報に関連するものとして、全国の鉄道遅延情報を表示します。

鉄道会社名/遅延している路線名（または列車の種類）  
このような表示になっています。

データは[rti技研のサービス](https://rti-giken.jp/fhc/api/train_tetsudo/)を利用しています。  
10分に一度自動的に更新されます。  
データの正しさに関しては保証しかねます。  

>## 中段左

### 最新の地震情報
日本における地震で最新のものを表示します。  
上から  
- 発生時刻
- 最大震度
- マグニチュード
- 震源
- 震源の深さ
- 津波の有無
- 各地の震度（地震が観測された地震観測点の名前）

となっています。  

データはp2p地震情報の[JSON API v2](https://www.p2pquake.net/json_api_v2/#/P2P%E5%9C%B0%E9%9C%87%E6%83%85%E5%A0%B1%20API/get_history)を利用しています。  
データの正しさに関しては保証しかねます。  

>## 中段右

### 最新の地震における震度分布図
最新の地震における震度分布図を表示します。  
- 震度1
<img src="/public/scale/1.png" width="50px">
- 震度2
<img src="/public/scale/2.png" width="50px">
- 震度3
<img src="/public/scale/3.png" width="50px">
- 震度4
<img src="/public/scale/4.png" width="50px">
- 震度5弱
<img src="/public/scale/5-.png" width="50px">
- 震度5強
<img src="/public/scale/5+.png" width="50px">
- 震度6弱
<img src="/public/scale/6-.png" width="50px">
- 震度6強
<img src="/public/scale/6+.png" width="50px">
- 震度7
<img src="/public/scale/7.png" width="50px">  
- 震源
<img src="/public/scale/center.png" width="50px"> 

上のアイコンで表示されます。
![image.png](/public/md/md2.png)  
データはp2p地震情報の[JSON API v2](https://www.p2pquake.net/json_api_v2/#/P2P%E5%9C%B0%E9%9C%87%E6%83%85%E5%A0%B1%20API/get_history)を利用しています。  
データの正しさに関しては保証しかねます。  

>## 下段左

### 地震感知情報
地震感知情報を表示します。  
ユーザ同士の「揺れた！」という地震感知情報をP2Pネットワークで共有するサービスである「**p2p地震情報**」を利用しています。
![image.png](/public/md/md3.png)
- ### レベル
レベルは「レベル1～レベル4」まであり、地震感知情報の信頼度を表します。  
- ### 件数
件数は地震が感知された件数を表します。
- ### 開始/更新
地震感知情報が「開始時刻」と「更新時刻」の間に検出されたというのを表します。
- ### 地名/件数/信頼度
各地域ごとの地震感知情報を表示します。
信頼度はAからFまであり、Aが最も高い信頼度になっています。  

データはp2p地震情報の[JSON API v2](https://www.p2pquake.net/json_api_v2/#/P2P%E5%9C%B0%E9%9C%87%E6%83%85%E5%A0%B1%20API/get_history)を利用しています。  
データの正しさに関しては保証しかねます。  
>## 下段中

### 直近の地震
直近の地震を表示します。  
わずかにデータ反映が遅れる場合があります。  

データはp2p地震情報の[JSON API v2](https://www.p2pquake.net/json_api_v2/#/P2P%E5%9C%B0%E9%9C%87%E6%83%85%E5%A0%B1%20API/get_history)を利用しています。  
データの正しさに関しては保証しかねます。  

> ## 下段右

### 津波情報

津波情報が発表された際にその情報を表示します。  
![image.png](/public/md/md4.png)
津波情報発表時刻、津波情報発表地域、津波情報種類、直ちに来襲するか否か、が表示されます。
![image.png](/public/md/md5.png)
津波情報がキャンセルされた場合は上のように表示されます。  

データはp2p地震情報の[JSON API v2](https://www.p2pquake.net/json_api_v2/#/P2P%E5%9C%B0%E9%9C%87%E6%83%85%E5%A0%B1%20API/get_history)を利用しています。  
データの正しさに関しては保証しかねます。  
***
当サイトは気象庁の情報をp2p地震情報のJSON API v2を介して利用しています。  
当サイトは鉄道comの情報をrti技研のサービスを介して利用しています。  
当サイトの利用によるいかなる損害についても、一切の責任を負いません。また、情報の正確性も一切保証しません。
