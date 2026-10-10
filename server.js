const http = require('node:http');
const fs = require('node:fs');
const path = require('node:path');

loadEnv();
const ROOT = __dirname;
const PORT = Number(process.env.PORT || 3000);
const MODEL = process.env.OPENAI_MODEL || 'gpt-6-luna';
const MIME = { '.html':'text/html; charset=utf-8', '.css':'text/css; charset=utf-8', '.js':'text/javascript; charset=utf-8', '.json':'application/json; charset=utf-8' };

function loadEnv() {
  try {
    const text = fs.readFileSync(path.join(__dirname, '.env'), 'utf8');
    for (const line of text.split(/\r?\n/)) {
      const m = line.match(/^\s*([A-Za-z_][A-Za-z0-9_]*)\s*=\s*(.*?)\s*$/);
      if (m && !process.env[m[1]]) process.env[m[1]] = m[2].replace(/^['"]|['"]$/g, '');
    }
  } catch {}
}
function send(res, status, data, type='application/json; charset=utf-8') {
  res.writeHead(status, { 'Content-Type':type, 'X-Content-Type-Options':'nosniff', 'Cache-Control':'no-store' });
  res.end(type.startsWith('application/json') ? JSON.stringify(data) : data);
}
function readBody(req) {
  return new Promise((resolve, reject) => {
    let body=''; req.on('data', chunk => { body += chunk; if (body.length > 20000) { reject(new Error('Request too large')); req.destroy(); } });
    req.on('end', () => { try { resolve(JSON.parse(body || '{}')); } catch { reject(new Error('Invalid JSON')); } });
    req.on('error', reject);
  });
}
function localProposal(text) {
  let title=text.trim(), dueDate=null, priority='medium';
  const today=new Date(); const localDate=n=>{const d=new Date(today);d.setDate(d.getDate()+n);return d.getFullYear()+'-'+String(d.getMonth()+1).padStart(2,'0')+'-'+String(d.getDate()).padStart(2,'0')};
  const dates=[[/\b(day after tomorrow)\b|بعد بكرا|بعد غد/i,2],[/\b(today|tonight)\b|اليوم|الليلة/i,0],[/\b(tomorrow|tmrw)\b|بكرا|بكرة|غدا|غداً/i,1]];
  for(const [re,n] of dates){if(re.test(title)){dueDate=localDate(n);title=title.replace(re,' ').replace(/\s+/g,' ').trim();break;}}
  if(/\b(urgent|asap|important|critical)\b|ضروري|مهم جدا|عاجل|مهم/i.test(title))priority='high';
  else if(/\b(low priority|not urgent)\b|مش مستعجل|غير عاجل/i.test(title))priority='low';
  const followUp=/\b(waiting|waiting for|follow up|follow-up|no reply|didn't reply)\b|بستنى|لسه ما رد|لم يرد|تابع|متابعة/i.test(text);
  return { title:title.replace(/\s+/g,' ').trim(), dueDate, priority, followUp, commitmentSummary:followUp?'Follow up on this item':null, clarificationNeeded:!dueDate&&/\b(by|before|due)\b|قبل|موعد/i.test(text), explanation:'Local rules-based proposal. Review before saving.', provider:'local-rules' };
}
async function proposeWithOpenAI(text, context) {
  const key=process.env.OPENAI_API_KEY;
  if (!key) return localProposal(text);
  const schema={type:'object',properties:{
    title:{type:'string'},
    due_date:{type:['string','null'],description:'ISO date YYYY-MM-DD only when clearly inferable; otherwise null'},
    priority:{type:'string',enum:['low','medium','high']},
    follow_up:{type:'boolean'},
    commitment_summary:{type:['string','null']},
    clarification_needed:{type:'boolean'},
    explanation:{type:'string'}
  },required:['title','due_date','priority','follow_up','commitment_summary','clarification_needed','explanation'],additionalProperties:false};
  const response=await fetch('https://api.openai.com/v1/responses',{
    method:'POST',
    headers:{'Authorization':'Bearer '+key,'Content-Type':'application/json'},
    body:JSON.stringify({
      model:MODEL,
      instructions:'You are My Boy, a practical personal agent for university students and company employees in Jordan. Understand the user input in Arabic or English and propose one task, not a long list. Never invent deadlines: use null if unclear and set clarification_needed true when a date seems important but ambiguous. Do not execute actions, send messages, or claim to have contacted anyone. Detect follow-ups and commitments. Return only the requested schema.',
      input:[{role:'user',content:'User context: '+context+'\nToday is '+new Date().toISOString().slice(0,10)+'. User message: '+text}],
      text:{format:{type:'json_schema',name:'my_boy_proposal',strict:true,schema}},
      max_output_tokens:350
    })
  });
  if(!response.ok){const detail=await response.text();throw new Error('LLM provider error '+response.status+': '+detail.slice(0,500));}
  const data=await response.json();
  const raw=data.output_text || (data.output||[]).flatMap(x=>x.content||[]).find(x=>x.type==='output_text')?.text;
  if(!raw)throw new Error('The model returned no structured output');
  const p=JSON.parse(raw);
  return {title:p.title,dueDate:p.due_date,priority:p.priority,followUp:p.follow_up,commitmentSummary:p.commitment_summary,clarificationNeeded:p.clarification_needed,explanation:p.explanation,provider:'openai-responses',model:MODEL};
}
const server=http.createServer(async(req,res)=>{
  const url=new URL(req.url,'http://localhost');
  if(req.method==='GET' && url.pathname==='/api/health') return send(res,200,{ok:true,provider:process.env.OPENAI_API_KEY?'openai-responses':'local-rules',model:process.env.OPENAI_API_KEY?MODEL:null});
  if(req.method==='POST' && url.pathname==='/api/agent/propose'){
    try{
      const body=await readBody(req);
      if(typeof body.text!=='string'||!body.text.trim())return send(res,400,{error:'text must be a non-empty string'});
      if(body.text.length>5000)return send(res,413,{error:'text is too long'});
      const context=['student','employee','both'].includes(body.persona)?body.persona:'student';
      const proposal=await proposeWithOpenAI(body.text.trim(),context);
      if(!proposal.title)return send(res,422,{error:'Could not identify a task title'});
      return send(res,200,{proposal,needsApproval:true});
    }catch(err){return send(res,500,{error:'Could not create a proposal',detail:process.env.NODE_ENV==='development'?err.message:undefined});}
  }
  if(req.method!=='GET' && req.method!=='HEAD'){return send(res,405,{error:'Method not allowed'});}
  const requested=url.pathname==='/'?'/index.html':decodeURIComponent(url.pathname);
  const file=path.resolve(ROOT,'.'+requested);
  if(!file.startsWith(ROOT+path.sep))return send(res,403,{error:'Forbidden'});
  fs.readFile(file,(err,data)=>{if(err)return send(res,404,{error:'Not found'});send(res,200,data,MIME[path.extname(file)]||'application/octet-stream');});
});
server.listen(PORT,'127.0.0.1',()=>console.log('My Boy running at http://127.0.0.1:'+PORT));
