# IPFS-Example

分散型インターネットの基盤のひとつ、IPFSを色々試してみる。


* [IPFS](https://ipfs.tech//)
* [IPFS Docs](https://docs.ipfs.tech/)
* [ProtoSchool](https://proto.school/)


## IPFS Deamon 起動

下記のうち一つをダウンロードしてIPFS Deamonを起動する。

* [Kubo (go-ipfs)](https://github.com/ipfs/kubo)
* [ipfs-Docker](https://hub.docker.com/r/ipfs/go-ipfs/)
* [JS IPFS](https://js.ipfs.tech/)

```
$ ipfs daemon
Initializing daemon...
Kubo version: 0.16.0-38117db6f
Repo version: 12
~
Daemon is ready
```

## IPFS API & CLI を試す

* [Kubo command-line](https://docs.ipfs.tech/reference/kubo/cli/)
* [Kubo RPC API v0 reference](https://docs.ipfs.tech/reference/kubo/rpc/)


## Braveブラウザでコンテンツを表示する
要Braveブラウザ

* [Brave](https://brave.com/)
* [Braveでのipfsサポート](https://brave.com/ipfs-support/)

### ■ ディレクトリにまとめたコンテンツをIPFSに追加・表示

IPFS上にHTMLもろもろのコンテンツ一式（jog, png, mp4, fmp4, dash, hls）をディレクトリごと追加して、相対パスで表示する。

まず、[Sorce example001](https://github.com/Hideyuki-Machida/IPFS-Example/tree/main/example001) をIPFSに追加

```
$ ipfs add -r example001
added QmW2CLsTR1Y35MuR8VUcXFDFQyd1HRAeUYGtwtoK8LivMY example001/MSE.js
~
added QmbPdU5M21ZEKwQ28J2zHDQX79TXksYUVfoNJNREgvaWRF example001
 9.48 MiB / 9.48 MiB [=================================================] 100.00%
```
`QmbPdU5M21ZEKwQ28J2zHDQX79TXksYUVfoNJNREgvaWRF`がIPFS上でのディレクトリのCIDになる。

Braveブラウザで`ipfs://QmbPdU5M21ZEKwQ28J2zHDQX79TXksYUVfoNJNREgvaWRF`を表示すると、example001/index.htmlが表示される。

```
$ ipfs ls QmbPdU5M21ZEKwQ28J2zHDQX79TXksYUVfoNJNREgvaWRF
QmW2CLsTR1Y35MuR8VUcXFDFQyd1HRAeUYGtwtoK8LivMY 2375 MSE.js
QmYvWfXFtk7G4LE7wHBjjqT3JtauK1TLC1f8D8TqyBjFbB -    img/
QmVqFec8tw6AQsJeWvaCVW4uZS1RsfmGgBPbgEyZ9dAnzT 480  index.html
QmYuwnwaYe45NiLRFgzzoev2xihDUS1XweT7heRM4uwTKo 1991 main.js
QmQVPNL2KeCnr14V64PcQZGgCVdLvaCfxceZ5gZxgrvAgX -    video/
```

```
$ ipfs object get QmbPdU5M21ZEKwQ28J2zHDQX79TXksYUVfoNJNREgvaWRF
{"Links":[{"Name":"MSE.js","Hash":"QmW2CLsTR1Y35MuR8VUcXFDFQyd1HRAeUYGtwtoK8LivMY","Size":2386},{"Name":"img","Hash":"QmYvWfXFtk7G4LE7wHBjjqT3JtauK1TLC1f8D8TqyBjFbB","Size":869182},{"Name":"index.html","Hash":"QmVqFec8tw6AQsJeWvaCVW4uZS1RsfmGgBPbgEyZ9dAnzT","Size":491},{"Name":"main.js","Hash":"QmYuwnwaYe45NiLRFgzzoev2xihDUS1XweT7heRM4uwTKo","Size":2002},{"Name":"video","Hash":"QmQVPNL2KeCnr14V64PcQZGgCVdLvaCfxceZ5gZxgrvAgX","Size":9073971}],"Data":"\u0008\u0001"}
```

```
$ ipfs dht findprovs QmbPdU5M21ZEKwQ28J2zHDQX79TXksYUVfoNJNREgvaWRF
12D...
```


### ■ IPFS上に存在するコンテンツを表示
IPFS上に追加したexample001 のコンテンツを`ipfs://CID`で表示する。

[Sorce example002](https://github.com/Hideyuki-Machida/IPFS-Example/tree/main/example002) をIPFSに追加

```
$ ipfs add -r example002
added QmW2CLsTR1Y35MuR8VUcXFDFQyd1HRAeUYGtwtoK8LivMY
 ~
added QmRTRQQbUuMm8f4Ag47k8BEJStzdWj3ngZrFhiG9jzVuhd example002
 5.74 KiB / 5.74 KiB
[=============================================================================] 100.00%
```
Braveブラウザで`ipfs://QmRTRQQbUuMm8f4Ag47k8BEJStzdWj3ngZrFhiG9jzVuhd`を表示すると、example002/index.htmlが表示される。

※ BraaveブラウザでもHTMLを`ipfs://`で表示した場合にだけ、画像等のコンテンツを`ipfs://CID`で表示できる。


## IPFS PUBSUB を試す
[Take a look at pubsub on IPFS](https://blog.ipfs.tech/25-pubsub/) 


まずipfs-Dockerを使用して、Containerを複数起動する。

```
$ docker run --name ipfs_001 -p 4001:4001 -p 4001:4001/udp -p 8080:8080 -p 8081:8081 -p 5001:5001 ipfs/go-ipfs daemon --enable-pubsub-experiment

> "ID": "12D3KooWGY2R2PuA7VArN2DZXaQoiGRzZtVWxNCW6Rv8cHGuZzeG"
```
```
$ docker run --name ipfs_002 -p 4002:4001 -p 4002:4001/udp -p 8090:8080 ipfs/go-ipfs daemon --enable-pubsub-experiment

> "ID": "12D3KooWERwpEJHSCs35fWB8wy3sVFiMvzxGXHTb1NFZFdT9VGo1"
```
```
$ docker run --name ipfs_003 -p 4003:4001 -p 4003:4001/udp -p 8100:8080 ipfs/go-ipfs daemon --enable-pubsub-experiment

> "ID": "12D3KooWQQMfDmzCT4M8Z6wc1v1wzEEKKM5MLE7orxthExVfQXnw"
```

`$ ipfs swarm peers`で、複数のノードに接続されていることがわかる。

```
$ ipfs swarm peers
~

```

わかりやすくするために、ローカルノード以外をdisconnectしたい。
まず、IPFS Deamon起動時にconectionされるリストを表示する。

```
$ ipfs bootstrap list
/dnsaddr/bootstrap.libp2p.io/p2p/QmNnooDu7bfjPFoTZYxMNLWUQJyrVwtbZg5gBMjTezGAJN
/dnsaddr/bootstrap.libp2p.io/p2p/QmQCU2EcMqAqQPR2i9bChDtGNJchTbq5TbXJJ16u19uLTa
/dnsaddr/bootstrap.libp2p.io/p2p/QmbLHAnMoJPWSCR5Zhtx6BHJX9KiKNN6tpvbUcqanj75Nb
/dnsaddr/bootstrap.libp2p.io/p2p/QmcZf59bWwK5XFi76CZX8cbJ4BhTzzA3gU1ZjYZcYW3dwt
/ip4/104.131.131.82/tcp/4001/p2p/QmaCpDMGvV2BGHeYERUEnRQAwe3N8SzbUtfsmvsqQLuvuJ
/ip4/104.131.131.82/udp/4001/quic/p2p/QmaCpDMGvV2BGHeYERUEnRQAwe3N8SzbUtfsmvsqQLuvuJ
```

すべての接続先を削除

```
$ ipfs bootstrap rm --all
```

作成した各Containerをrestartするとbootstrap listが空になっている。

```
$ ipfs bootstrap list
```

`$ ipfs swarm peers`でローカルノード同士のみが接続されていることが確認できる。

```
$ ipfs swarm peers
/ip4/172.17.0.3/tcp/4001/p2p/12D3KooWERwpEJHSCs35fWB8wy3sVFiMvzxGXHTb1NFZFdT9VGo1
/ip4/172.17.0.3/udp/4001/quic/p2p/12D3KooWERwpEJHSCs35fWB8wy3sVFiMvzxGXHTb1NFZFdT9VGo1
/ip4/172.17.0.4/udp/4001/quic/p2p/12D3KooWQQMfDmzCT4M8Z6wc1v1wzEEKKM5MLE7orxthExVfQXnw
/ip4/172.17.0.4/udp/4001/quic/p2p/12D3KooWQQMfDmzCT4M8Z6wc1v1wzEEKKM5MLE7orxthExVfQXnw
```

subscribe側で下記を実行。待受状態になる。

```
$ ipfs pubsub sub foo
```

publish側で下記を実行。messageを送信。

```
$ echo "hello world" > test.txt
$ ipfs pubsub pub foo test.txt
```

subscribe側でmessageが表示される。

```
$ ipfs pubsub sub foo
hello world
```

## AWS EC2上でIPFS を試す

こちらを参考にAWS EC2 でいろいろ試してみる。

[EC2上にIPFS NODEを作成する](https://blog.agile.esm.co.jp/entry/2022/07/15/120000) 

上記の通りに環境構築し、docker runの部分だけ、`--enable-pubsub-experiment`を追加する。

```
sudo docker run -d --name ipfs_host -v $ipfs_staging:/export -v $ipfs_data:/data/ipfs -p 4001:4001 -p 0.0.0.0:8080:8080 ipfs/go-ipfs:latest daemon --enable-pubsub-experiment
```

### ■ EC2上のpublic gatewayでIPFSコンテンツを表示する

```
{パブリック IP}:8080/ipfs/QmbPdU5M21ZEKwQ28J2zHDQX79TXksYUVfoNJNREgvaWRF
```

### ■ ローカルとEC2上のIPFSノード同士でPUBSUB

EC2上のIPFSノードのPeer IDを確認。

```
$ sudo docker exec ipfs_host ipfs id
{
	"ID": "12D3KooWPEjot6hgFjK8SVE5fwgcj6wMGMq44JE3sUiKhf1yqQrS",
	~
}
```

EC2上のIPFSノードのAddressesを確認。

```
$ sudo docker exec ipfs_host ipfs swarm addrs local
/ip4/127.0.0.1/tcp/4001
/ip4/127.0.0.1/udp/4001/quic
/ip4/{パブリック IP}/tcp/4001
/ip4/{パブリック IP}/udp/34449/quic
/ip4/{パブリック IP}/udp/4001/quic
/ip4/172.17.0.2/tcp/4001
/ip4/172.17.0.2/udp/4001/quic
```

ローカルのノードからEC2上のIPFSノードにConnectする。

```
$ ipfs swarm connect /ip4/{パブリック IP}/tcp/4001/p2p/12D3KooWPEjot6hgFjK8SVE5fwgcj6wMGMq44JE3sUiKhf1yqQrS
connect 12D3KooWPEjot6hgFjK8SVE5fwgcj6wMGMq44JE3sUiKhf1yqQrS success
```

ローカルのノードとpubsubできるpeerの中にEC2上のIPFSノードのPeer IDがあることを確認。
あとは、相互にpubsubできる。

※ 直接EC2上のIPFSノードにConnectしているローカルノード以外からもConnectしているローカルノードを経由してpubsubできる。

```
$ ipfs pubsub peers
~
12D3KooWPEjot6hgFjK8SVE5fwgcj6wMGMq44JE3sUiKhf1yqQrS
~
```
## IPFSでシンプルなP2Pチャットを試す

PUBSUBを使用して、シンプルなP2Pチャットを試してみる。


### ■ IPFSを起動

```
$ ipfs daemon
```

### ■ チャットAPPサーバーのinstall

```
$ cd example003
$ node install
```

### ■ チャットAPPサーバーを起動する

```
$ node app.js 3000 'http://127.0.0.1:5002/api/v0/'
```

### ■ ブラウザでチャットAPPのUIを表示

```
$ open http://127.0.0.1:3000/
```

### ■ APPのUIでメッセージを送信

* UIの remote にお互いの own Peer ID を入力
* topicに共通のtopicを入力
* 双方の CONNECT ボタンをクリックしてしばらくすると、pubsub_peersに接続先のPeer IDが表示される
* SEND ボタンをクリックしてメッセージを送信すると、お互いのUIにメッセージが表示される

