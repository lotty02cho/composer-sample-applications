var express = require('express'),
  path = require('path'),
  WebSocket = require('ws'),
  http = require('http'),
  url = require('url'),
  config = require('config');

// node는 기본적으로 http모듈을 가지고 있고, connenct는 http모듈에 여러 플러그인을 추가할 수 있는 미들웨어 프레임워크.
// create a new express server

var app = express();
var server = http.createServer(app);

app.get('/assets/config.json', (req, res, next) => {
  res.json({
    useLocalWS: true,
    //node.js에서 제공하는 process.env를 사용하면 시스템에서 설정한 값을 가져올 수 있습니다.
    nodeRedBaseURL: process.env.NODE_RED_BASE_URL || config.get("nodeRedBaseURL")
  });
});

var nodeRedBaseURL = process.env.NODE_RED_BASE_URL || config.get("nodeRedBaseURL");


// static - all our js, css, images, etc go into the assets path
// 이미지, CSS 파일 및 JavaScript 파일과 같은 정적 파일을 제공하려면 Express의 기본 제공 미들웨어 함수인 express.static을 사용
app.use(express.static(path.join(__dirname, 'www')));

//웹소캣 전역객체 설정 server: app의 주소
var wss = new WebSocket.Server({ server: server });

//wss.on('connection',~~) 연결수립 됐을시
wss.on('connection', function (ws) {
  //location은 placeorder와 updateorderstatus가 보내지게 된다.
  var location = url.parse(ws.upgradeReq.url, true);
  console.log('client connected', location.pathname);
  //nodeRedBaseURL로 location.pathname을 보내준다.
  var remoteURL = nodeRedBaseURL + location.pathname;
  console.log('creating remote connection', remoteURL);
  var remote = new WebSocket(remoteURL);
  //client페이지가 종료되면 꺼짐.
  ws.on('close', function () {
    console.log('client closed', location.pathname);
    remote.close();
  });
  //차의 옵션을 선택하고 PURCHASE AND BUILD 버튼을 누르면, 데이터를 보냄
  //
  ws.on('message', function (data) {
    console.log('Received message from ws. Sending to nodered.',data);
    remote.send(data);
  });
  remote.on('open', function () {
    console.log('remote open', location.pathname);
  })
  remote.on('close', function () {
    console.log('remote closed', location.pathname);
    ws.close();
  });
  remote.on('message', function (data) {
    console.log('Received message from nodered. Sending to ws.',data);
    ws.send(data);
  });
});

// start server on the specified port
// 특정한 포트에서 시작함.
server.listen(8200, function () {
  'use strict';
  // print a message when the server starts listening
  console.log('server starting on http://localhost:8200');
});
