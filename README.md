---
title: "how to use quake app"
tags: ""
---

# IF4375
### Information from 4375  
日本の地震観測点数である4375から命名。  
地震情報等を表示するwebサイトです。  
***
![image.png](https://boostnote.io/api/teams/sHsT4vNs0/files/5361edbbcc175fb07cb4960e282ec0482b183fe82c2df3383fb7637d379356a2-image.png)
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
<img src="https://boostnote.io/api/teams/sHsT4vNs0/files/42c3c643a64efdc99a11311169e201564b0e6868283e6e4e416879e5ee3f4403-1.png" width="50px">
- 震度2
<img src="https://boostnote.io/api/teams/sHsT4vNs0/files/67f1cd1467e4ba06059d72a6278c6c06b55786c12f65bfad333e3051d4d6c505-2.png" width="50px">
- 震度3
<img src ="https://boostnote.io/api/teams/sHsT4vNs0/files/36ded389e0a6fced3c8ab99bcfa8179badfb83cd5c8cdd42c10db41df7ca2b08-3.png" width="50px">
- 震度4
<img src="https://boostnote.io/api/teams/sHsT4vNs0/files/6976a1b25dc08a5548e6a930deab8a77cfc9cb8679a50bb14b09d7db4ed37e74-4.png" width="50px">
- 震度5弱
<img src="https://boostnote.io/api/teams/sHsT4vNs0/files/2c02a45c1b1ef13685d2a1a9936589166a97d0a3e0e880e07cecb80e9b4e90fe-5-.png" width="50px">
- 震度5強
<img src="https://boostnote.io/api/teams/sHsT4vNs0/files/8d5503aa58bde66a61b54086d955a3bd1561e7397f03ce760581c3e4256d2d4d-5+.png" width="50px">
- 震度6弱
<img src="https://boostnote.io/api/teams/sHsT4vNs0/files/c2671ca4e6ff1decc8b9662d382721e5a248c88f9a7662eb23e4a1ca53ef266d-6-.png" width="50px">
- 震度6強
<img src="https://boostnote.io/api/teams/sHsT4vNs0/files/349e61cca5b1370d52fab1d13d2cb30aa3df4975bbc49c309773e89cfa627465-6+.png" width="50px">
- 震度7
<img src="https://boostnote.io/api/teams/sHsT4vNs0/files/03858f5afed366557a5893714ec95315cc2bb88e786507b82d02ebb8d30ebf8d-7.png" width="50px">  
- 震源
<img src="https://boostnote.io/api/teams/sHsT4vNs0/files/9caf78dfa6b42c78911c00d8098c6b5a11f0e70fab10a986d756b1c929f94bd6-center.png" width="50px"> 

上のアイコンで表示されます。
![image.png](https://boostnote.io/api/teams/sHsT4vNs0/files/ef5737a340e5b10ddba376d2067c2c34dd3f38d4421688e04d1d94cc66f8ac03-image.png)  
データはp2p地震情報の[JSON API v2](https://www.p2pquake.net/json_api_v2/#/P2P%E5%9C%B0%E9%9C%87%E6%83%85%E5%A0%B1%20API/get_history)を利用しています。  
データの正しさに関しては保証しかねます。  

>## 下段左

### 地震感知情報
地震感知情報を表示します。  
ユーザ同士の「揺れた！」という地震感知情報をP2Pネットワークで共有するサービスである「**p2p地震情報**」を利用しています。
![image.png](https://boostnote.io/api/teams/sHsT4vNs0/files/72582715b4540be2e4ce112f3bbe0c82b0b97afe7e34fc7b4a73234993e8e6ab-image.png)
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
![image.png](https://boostnote.io/api/teams/sHsT4vNs0/files/eaecd3c14e485e52ed835846c9b2d57e913869df093a7ab121656da030a0975e-image.png)
津波情報発表時刻、津波情報発表地域、津波情報種類、直ちに来襲するか否か、が表示されます。
![image.png](https://boostnote.io/api/teams/sHsT4vNs0/files/f48be687a521d04abf9d27a8a7f6b8b614234a7f205632f27dbd328b187f5fa4-image.png)
津波情報がキャンセルされた場合は上のように表示されます。  

データはp2p地震情報の[JSON API v2](https://www.p2pquake.net/json_api_v2/#/P2P%E5%9C%B0%E9%9C%87%E6%83%85%E5%A0%B1%20API/get_history)を利用しています。  
データの正しさに関しては保証しかねます。  
***
当サイトは気象庁の情報をp2p地震情報のJSON API v2を介して利用しています。  
当サイトは鉄道comの情報をrti技研のサービスを介して利用しています。  
当サイトの利用によるいかなる損害についても、一切の責任を負いません。また、情報の正確性も一切保証しません。
