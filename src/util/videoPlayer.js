import shaka from 'shaka-player'
import { licenseServer } from '../constants'

let shakaPlayer = null

const onErrorEvent = (event) => {
    onError(event.detail);
}

const onError = (error) => {
    console.error('Error code', error.code, 'object', error);
}

export const initPlayer = (manifestUri, video) => {
    shaka.polyfill.installAll()
    if (shaka.Player.isBrowserSupported()) {
      if (!manifestUri || !video.current) return
      shakaPlayer = new shaka.Player(video.current)


      shakaPlayer.addEventListener('error', onErrorEvent)
      shakaPlayer.configure({
        drm: {
          servers: { 'com.widevine.alpha': licenseServer }
        }
      })
      // 拦截请求 & 包装请求
  // 请求携带的数据要参照所使用的drm的文档
  shakaPlayer.getNetworkingEngine().registerRequestFilter(function(type, request) {
    const { StringUtils }  = shaka.util
    const { Uint8ArrayUtils }  = shaka.util

    if (type === shaka.net.NetworkingEngine.RequestType.LICENSE) {
      const wrapped = {};

      wrapped.rawLicenseRequestBase64 =
          Uint8ArrayUtils.toBase64(new Uint8Array(request.body));

      // wrapped.favoriteColor = 'blue'
      // wrapped.Beatles = ['John', 'Paul', 'George', 'Ringo']
      // wrapped.bestBeatleIndex = 1
      // wrapped.pEqualsNP = false

      // const wrappedJson = JSON.stringify(wrapped);
      // request.body = StringUtils.toUTF8(wrappedJson);
    }
  })

  // 拦截响应
  shakaPlayer.getNetworkingEngine().registerResponseFilter(function(type, response) {
    const { StringUtils }  = shaka.util
    const { Uint8ArrayUtils } = shaka.util

    if (type === shaka.net.NetworkingEngine.RequestType.LICENSE) {
      // const wrappedString = StringUtils.fromUTF8(response.data)
      // const wrapped = JSON.parse(wrappedString)
      // const { license }  = wrapped
      // response.data = Uint8ArrayUtils.fromBase64(license);
      // console.log(wrapped);
    }
  });
      shakaPlayer.load(manifestUri).then(function() {
        // do something
      }).catch(onError)

    } else {
        console.error('Browser not supported!');
    }
}
