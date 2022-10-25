# IPFS-Example

分散型インターネットの基盤のひとつ、IPFSを色々試してみる。

## Braveブラウザでコンテンツを表示する
要Braveブラウザ

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

<a href="ipfs://QmbPdU5M21ZEKwQ28J2zHDQX79TXksYUVfoNJNREgvaWRF"> Demo </a>


### ■ IPFS上に存在するコンテンツを表示
IPFS上に追加したexample001 のコンテンツを`ipfs://CID`で表示する。

※ BraaveブラウザでもHTMLを`ipfs://`で表示した場合にだけ、画像等のコンテンツを`ipfs://CID`で表示できる。

<a href="ipfs://QmRTRQQbUuMm8f4Ag47k8BEJStzdWj3ngZrFhiG9jzVuhd"> Demo </a>
