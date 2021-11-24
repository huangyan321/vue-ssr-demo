var express = require("express");
var path = require("path");
var historyApi = require("./middleware/historyApiFallback");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
var fs = require("fs");
var cache = require("lru-cache");
const { createBundleRenderer } = require("vue-server-renderer");
const resolve = (file) => path.resolve(__dirname, file);
const isProd = true;
var app = express();
let readyPromise;
// 跨域配置
app.all("*", function (req, res, next) {
  // 设置允许跨域的域名，*代表允许任意域名跨域

  res.header("Access-Control-Allow-Origin", "*");
  // 允许的header类型
  res.header(
    "Access-Control-Allow-Headers",
    "Content-Type,Access-Token,Appid,Secret,Authorization"
  );
  // 跨域允许的请求方式
  res.header("Access-Control-Allow-Methods", "DELETE,PUT,POST,GET,OPTIONS");
  if (req.method.toLowerCase() == "options") res.sendStatus(200);
  // 让options尝试请求快速结束
  else next();
});
app.use(logger("dev"));
app.use(express.json());
app.use(
  express.urlencoded({
    extended: false,
  })
);
app.use(cookieParser());

let renderer;
function createRenderer(bundle, options) {
  return createBundleRenderer(
    bundle,
    Object.assign(options, {
      // for component caching
      cache: new cache({
        max: 1000,
        maxAge: 1000 * 60 * 10,
      }),
      // this is only needed when vue-server-renderer is npm-linked
      // basedir: resolve('./dist'),
      // recommended for performance
      runInNewContext: false,
    })
  );
}
// app.use(
//   // 使用history模式
//   historyApi({
//     index: "/index.html",
//   })
// );
//微缓存服务
const serve = (path, cache) => express.static(resolve(path), {
  maxAge: cache && isProd ? 1000 * 60 * 60 * 24 * 30 : 0
})
app.use('/dist/', serve('../client/dist', true))
app.use('/public/', serve('../client/public', true))

if (isProd) {
  const bundle = require("../client/dist/vue-ssr-server-bundle.json");
  const template = fs.readFileSync(
    resolve("../client/public/index.html"),
    "utf-8"
  );
  const clientManifest = require("../client/dist/vue-ssr-client-manifest.json");

  renderer = createRenderer(bundle, { template, clientManifest });
} else {
  readyPromise = require("../client/build/setup-dev-server")(
    app,
    resolve("../client/public/index.html"),
    (bundle, options) => {
      renderer = createRenderer(bundle, options);
    }
  );
}

async function render(req, res) {
  const s = Date.now();
  res.setHeader("Content-Type", "text/html");
  const context = {
    title: "lan bi tou", // default title
    url: req.originalUrl,
  };
  let result = await renderToStringPromise(context);
  res.send(result);
}
function renderToStringPromise(context) {
  return new Promise((resolve, reject) => {
    renderer.renderToString(context, (err, html) => {
      if (err) {
        console.log(err);
      }
      if (!isProd) {
        console.log(`whole request: ${Date.now() - s}ms`);
      }
      resolve(html);
    });
  });
}
app.get(
  "*",
  isProd
    ? (req, res) => {
        render(req, res);
      }
    : (req, res) => {
        readyPromise.then(() => render(req, res));
      }
);
module.exports = app;
