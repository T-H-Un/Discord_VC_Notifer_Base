/******** This program is only for discord.js v13.x *******/
/******** Must use node.js version 16~ **********/
/******** Use and edit package.json for update packages *******/
/******** Powered by T-H-Un *********/


const http = require('http');
const querystring = require('querystring');
const { Client, Intents } = require('discord.js');
const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.GUILD_VOICE_STATES] });

//叩き起こすためのサーバーを設置する make zombie server with google scripts
http.createServer(function(req, res){
  if (req.method == 'POST'){
    var data = "";
    req.on('data', function(chunk){
      data += chunk;
    });
    req.on('end', function(){
      if(!data){
        res.end("No post data");
        return;
      }
      var dataObject = querystring.parse(data);
      console.log("post:" + dataObject.type);
      if(dataObject.type == "wake"){
        console.log("Woke up in post");
        res.end();
        return;
      }
      res.end();
    });
  }
  else if (req.method == 'GET'){
    res.writeHead(200, {'Content-Type': 'text/plain'});
    res.end('Discord Bot is active now\n');
  }
}).listen(3000);
 

//ボットが稼働状態になったら呼び出される。関数とステータスを設定している。 
//if Bot status is "ready", call this function. It7s start log and Set status of Bot.
client.on('ready', message =>{
  console.log('Bot_Ready');
  client.user.setActivity('Game', { type: 'PLAYING' });
});



/*通話用システム部分 for VC messages functions*/
//process.env.XXX みたいなのは全て.envファイルに正しく設定を行えている前提
//process.env.DISCORD_BOT_TOKEN -> Discord botのTOKENの文字列が格納されている
//process.env.TEXT_CHANNEL_ID -> channel IDの文字列が格納されている
//process.env.VOICE_CHANNEL_ID  -> ボイスチャットチャンネルの文字列が格納されている


var start_buf=Date.now();
var end_buf=Date.now();

client.on('voiceStateUpdate', (oldGuildMember, newGuildMember) =>{
  if(oldGuildMember.channelId==undefined&&newGuildMember.channelId!=undefined){
    if (newGuildMember.channelId == process.env.VOICE_CHANNEL_ID) {
      console.log("特定のボイスチャットチャンネルのみ反映");
    if(client.channels.cache.get(newGuildMember.channelId).members.size==1){
    console.log("通話開始かどうかの条件判定");
    let text="@everyone<@" + newGuildMember.id +"> が通話を開始しました。\n";
    client.channels.cache.get(process.env.TEXT_CHANNEL_ID).send(text);//このIDを送りたいチャンネルにする。1回は発言していないとおかしくなるかも。
    start_buf = Date.now();
      }
    }
  }
  
  if(newGuildMember.channelId==undefined&&oldGuildMember.channelId!=undefined){
    console.log("通話終了の判定");
    let text="通話が終了しました。\n";
    if (oldGuildMember.channelId == process.env.VOICE_CHANNEL_ID) {
      console.log("特定のボイスチャンネル判定終わり");
     if(client.channels.cache.get(oldGuildMember.channelId).members.size==0){
       console.log("最後の判定");
    client.channels.cache.get(process.env.TEXT_CHANNEL_ID).send(text);
    const end_buf = Date.now();
    const totaltime=end_buf-start_buf;
    const days=Math.floor(totaltime/1000/60/60/24);
    const hours=Math.floor(totaltime/1000/60/60)%24
    const min=Math.floor(totaltime/1000/60)%60;
    const sec = Math.floor(totaltime/1000)%60;
    let times="通話時間"+days+"日"+hours+"時間"+min+"分"+sec+"秒"
    client.channels.cache.get(process.env.TEXT_CHANNEL_ID).send(times);
    }
    }
    
  }
});

/*通話用システムここまで end VC function*/

//ログインする関数基本的にDiscord系の関数一番下において置く Login in on Discord with TOKEN
client.login( process.env.DISCORD_BOT_TOKEN );
