# IPFS-Example

分散型インターネットの基盤のひとつ、IPFSを色々試してみる。

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



