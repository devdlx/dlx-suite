var Readable=require("readable-stream").Readable,series=require("run-series"),test=require("tape"),Tracker=require("bittorrent-tracker/server"),WebTorrent=require("../../");test("client.seed: stream",function(e){e.plan(9);var n=new Tracker({udp:!1,ws:!1});n.on("error",function(n){e.fail(n)}),n.on("warning",function(n){e.fail(n)});var r,t,o,a;series([function(e){n.listen(e)},function(t){var i=n.http.address().port;o="http://localhost:"+i+"/announce",r=new WebTorrent({dht:!1}),r.on("error",function(n){e.fail(n)}),r.on("warning",function(n){e.fail(n)});var l=new Readable;l._read=function(){},l.push("HELLO WORLD\n"),l.push(null);var u={name:"hello.txt",pieceLength:5,announce:[o]};r.seed([l],u,function(e){a=e.magnetURI,t(null)})},function(n){t=new WebTorrent({dht:!1}),t.on("error",function(n){e.fail(n)}),t.on("warning",function(n){e.fail(n)}),t.add(a,function(r){e.equal(r.files.length,1),e.equal(r.files[0].name,"hello.txt"),e.equal(r.files[0].length,12),r.files[0].getBuffer(function(r,t){e.error(r),e.equal(t.toString("utf8"),"HELLO WORLD\n","content"),n(null)})})}],function(o){e.error(o),r.destroy(function(n){e.error(n,"seeder destroyed")}),t.destroy(function(n){e.error(n,"client destroyed")}),n.close(function(){e.pass("tracker closed")})})});