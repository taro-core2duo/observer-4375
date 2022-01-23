# observer-4375

![enter image description here](https://i.ibb.co/2jYxY7G/Group-25.png)
日本の地震情報をわかりやすく配信します。
**※ただいま試験的運用中です**

# 画面の解説

![enter image description here](https://i.ibb.co/Zg67MTY/Web-12-1-2022-202946-observer-4375-vercel-app.jpg)

### 1.地震感知情報

P2P地震情報より「地震感知情報」を取得し、表示します。
P2P地震情報とは

> 気象庁が発表する地震情報・津波予報と、ユーザ同士の「揺れた！」という地震感知情報をP2Pネットワークで共有するサービスです。
> 
> P2P地震情報 https://www.p2pquake.net/#

上にある様にユーザーの「揺れた！」という情報を収集して、地震発生を感知するため、すべての地震に対して対応できるわけではありません。
また、ごくまれに地震発生の誤感知もあります。（悪戯などによる）
上記の性質を理解したうえでご利用下さい。

![enter image description here](https://i.ibb.co/nfjwRzT/image.png)

「該当地域」には「地震発生の可能性のある地域」と「その情報の信頼度」が表示されます。
例：宮城南部A　福島浜通りE
「その情報の信頼度」はAからFが存在しており、Aが最も信頼度が高くなっています。ここではAからEを表示しています。

### 2.最新の地震

直近に発生した地震の情報を表示します。

### 3.震度分布

直近の地震の震度分布図を表示します。

![enter image description here](https://i.ibb.co/T8WSfKJ/iMac-1.png)

震度分布図における、震度を表すアイコンは上の通りです。
現時点では「震度5弱以上と推定されるが震度情報を入手していない」観測点に関しては、混乱を避けるため表示を行っていません。

### 4.過去の地震

過去9件の地震情報を表示します。海外地震情報には対応していません。

### 5.津波情報

津波情報（津波注意報、津波警報、大津波警報）が発表された際、それが表示されます。

![enter image description here](https://i.ibb.co/1MYk2jf/image.png)

発令時は上のように表示されます。

![enter image description here](https://i.ibb.co/f9Pv1Rh/image.png)

発令が解除された際は上のように表示されます。

# 著作権等

- ソースコードはMIT Licenseにて管理されています。
- 地震情報は[JSON API v2 · P2P地震情報 (p2pquake.net)](https://www.p2pquake.net/json_api_v2/#menu)を利用させていただいています。
- [JSON API v2 · P2P地震情報 (p2pquake.net)](https://www.p2pquake.net/json_api_v2/#menu)は気象庁 地震情報・津波予報: CC BY 4.0 準拠しており、その旨をここに示しておきます。

# その他

- 予告なしにサービスを停止する場合があります。
  - また、このアプリケーションの利用によるいかなる損害に関しても、一切の責任を負いません。併せてご理解ください。
  - お使いの機種によってはレイアウトが崩れる場合がありますが、ご了承下さい。
  - また、フィーチャーフォン及びInternet Explorerには対応していません。ご了承ください。

****

> Written with [StackEdit](https://stackedit.io/).
