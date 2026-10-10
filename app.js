const KEY='ai-task-assistant.tasks';
const LOG_KEY='ai-task-assistant.audit';
const PERSONA_KEY='ai-task-assistant.persona';
const COMMIT_KEY='ai-task-assistant.commitments';
const TASK_SUGGESTIONS={
 student:['عندي تسليم مشروع الخميس ولازم أخلص الجزء الأخير','عندي امتحان ولازم أراجع 4 محاضرات قبل الخميس','الدكتور طلب مني أعدل المشروع وأبعتله النسخة'],
 employee:['المدير بده التقرير الخميس ولسه بستنى أرقام أحمد','بعتت للعميل ولسه ما رد، ذكرني أتابعه','عندي اجتماع بكرا ولازم أجهز الأرقام'],
 both:['عندي شغل بالنهار وتسليم جامعة الخميس، ساعدني أرتبهم','عندي ساعة فاضية، شو أهم إشي أعمله؟','لازم أتابع شخص بالشغل وأخلص جزء من مشروع الجامعة']
};
const personaLabels={student:'University',employee:'Work',both:'Study + work'};
let tasks=[],audit=[],commitments=[];
try{tasks=JSON.parse(localStorage.getItem(KEY)||'[]');if(!Array.isArray(tasks))tasks=[]}catch{tasks=[]}
try{audit=JSON.parse(localStorage.getItem(LOG_KEY)||'[]');if(!Array.isArray(audit))audit=[]}catch{audit=[]}
try{commitments=JSON.parse(localStorage.getItem(COMMIT_KEY)||'[]');if(!Array.isArray(commitments))commitments=[]}catch{commitments=[]}
const $=id=>document.getElementById(id);
const today=()=>{const d=new Date();return new Date(d.getTime()-d.getTimezoneOffset()*60000).toISOString().slice(0,10)};
const dateOffset=n=>{const d=new Date();d.setDate(d.getDate()+n);return new Date(d.getTime()-d.getTimezoneOffset()*60000).toISOString().slice(0,10)};
const save=()=>{localStorage.setItem(KEY,JSON.stringify(tasks));render()};
function log(action,details={}){audit.unshift({id:crypto.randomUUID(),at:new Date().toISOString(),action,details});audit=audit.slice(0,100);localStorage.setItem(LOG_KEY,JSON.stringify(audit));renderAudit()}
function saveCommitments(){localStorage.setItem(COMMIT_KEY,JSON.stringify(commitments));renderCommitments()}
function escapeHtml(s){return String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[c]))}
function inferTask(raw){
 let title=raw.trim(),due='',priority='Medium',followUp='';
 const lower=title.toLowerCase();
 const rules=[[/\b(today|tonight)\b|اليوم|الليلة/,0],[/\b(tomorrow|tmrw)\b|بكرا|بكرة|غدا|غداً/,1],[/\b(day after tomorrow)\b|بعد بكرا|بعد غد/,2]];
 for(const [pattern,offset] of rules){if(pattern.test(lower)){due=dateOffset(offset);title=title.replace(pattern,' ').replace(/\s+/g,' ').trim();break}}
 if(/\b(urgent|asap|important|critical)\b|ضروري|مهم جدا|عاجل|مهم/.test(lower)){priority='High';title=title.replace(/\b(urgent|asap|important|critical)\b|ضروري|مهم جدا|عاجل|مهم/ig,' ').replace(/\s+/g,' ').trim()}
 else if(/\b(low priority|not urgent)\b|مش مستعجل|غير عاجل/.test(lower)){priority='Low';title=title.replace(/\b(low priority|not urgent)\b|مش مستعجل|غير عاجل/ig,' ').replace(/\s+/g,' ').trim()}
 if(/\b(waiting|waiting for|follow up|follow-up|no reply|didn't reply)\b|بستنى|لسه ما رد|لم يرد|تابع|متابعة/.test(lower)){followUp='Follow up';}
 const titleClean=title.replace(/^[,،:؛.\-\s]+|[,،:؛.\-\s]+$/g,'');
 return{title:titleClean,due,priority,followUp};
}
function render(){
 const filter=$('filter').value;
 const visible=tasks.filter(t=>filter==='all'||(filter==='done'?t.done:!t.done));
 $('todayCount').textContent=tasks.filter(t=>t.due===today()&&!t.done).length;
 $('doneCount').textContent=tasks.filter(t=>t.done).length;
 $('pendingCount').textContent=tasks.filter(t=>!t.done).length;
 $('tasks').innerHTML=visible.length?visible.map(t=>'<div class="task '+(t.done?'done':'')+'"><input type="checkbox" aria-label="Mark '+escapeHtml(t.title)+' complete" '+(t.done?'checked':'')+' onchange="toggle(\''+t.id+'\')"><div class="task-main"><div class="task-title">'+escapeHtml(t.title)+'</div><div class="meta">'+(t.due?'Due '+escapeHtml(t.due):'No due date')+' · <span class="priority '+t.priority.toLowerCase()+'">'+escapeHtml(t.priority)+'</span>'+(t.followUp?' · Follow-up':'')+'</div></div><button class="secondary" onclick="removeTask(\''+t.id+'\')" aria-label="Delete task">Delete</button></div>').join(''):'<p class="empty">No tasks match this filter.</p>';
 renderAudit();renderCommitments();updateAgentSummary();
}
function getAgentContext(){
 const activeCommitments=commitments.filter(c=>c.status!=='done');
 const openTasks=tasks.filter(t=>!t.done);
 return {persona:localStorage.getItem(PERSONA_KEY)||'student',openTasks,activeCommitments};
}
function chooseMove(){
 const ctx=getAgentContext();
 const dueCommitments=ctx.activeCommitments.filter(c=>c.due&&c.due<=today());
 if(dueCommitments[0])return {type:'commitment',item:dueCommitments[0]};
 const todayTasks=ctx.openTasks.filter(t=>t.due===today());
 if(todayTasks.length)return {type:'task',item:todayTasks.find(t=>t.priority==='High')||todayTasks[0]};
 const followUp=ctx.openTasks.find(t=>t.followUp);
 if(followUp)return {type:'task',item:followUp};
 const high=ctx.openTasks.find(t=>t.priority==='High');
 return high?{type:'task',item:high}:ctx.openTasks[0]?{type:'task',item:ctx.openTasks[0]}:null;
}
function updateAgentSummary(){
 const pending=tasks.filter(t=>!t.done);
 const activeCommitments=commitments.filter(c=>c.status!=='done');
 const dueToday=pending.filter(t=>t.due===today()).length;
 const persona=localStorage.getItem(PERSONA_KEY)||'student';
 const hour=new Date().getHours();
 const greeting=hour<12?'Good morning.':hour<18?'Good afternoon.':'Good evening.';
 $('greeting').textContent=greeting+' '+(persona==='student'?'Let’s handle university.':persona==='employee'?'Let’s handle work.':'Let’s handle both.');
 $('agentSummary').textContent=dueToday?('You have '+dueToday+' move'+(dueToday===1?'':'s')+' due today. I’ll help you pick what matters first.'):pending.length?('You have '+pending.length+' open task'+(pending.length===1?'':'s')+'. Ask me for your next move.'): 'Nothing is waiting on you yet. Tell me what’s going on.';
}
function toggle(id){const t=tasks.find(x=>x.id===id);if(t){t.done=!t.done;log(t.done?'task.completed':'task.reopened',{taskId:id});save()}}
function removeTask(id){const t=tasks.find(x=>x.id===id);tasks=tasks.filter(t=>t.id!==id);log('task.deleted',{taskId:id,title:t?.title||''});save()}
function showPreview(t,raw){
 $('preview').hidden=false;
 const follow=t.followUp?'<div class="preview-item"><span>Signal</span><strong>Follow-up detected</strong></div>':'';
 $('preview').innerHTML='<h3>My Boy proposal</h3><p class="muted small">I understood this as a task'+(t.followUp?' with a follow-up':'')+'. Nothing is saved until you approve it.</p><div class="preview-grid"><div class="preview-item"><span>Next action</span><strong>'+escapeHtml(t.title||'Add a task title')+'</strong></div><div class="preview-item"><span>Due date</span><strong>'+(t.due?escapeHtml(t.due):'Not detected')+'</strong></div><div class="preview-item"><span>Priority</span><strong>'+escapeHtml(t.priority)+'</strong></div>'+follow+'</div><div class="actions"><button type="button" id="discardSuggestion" class="secondary">Reject</button><button type="button" id="confirmSuggestion" '+(t.title?'':'disabled')+'>Approve & let My Boy handle it</button></div>';
 log('agent.proposal_created',{input:raw,proposal:t});
 $('discardSuggestion').onclick=()=>{$('preview').hidden=true;log('agent.proposal_rejected',{proposal:t})};
 $('confirmSuggestion').onclick=()=>{
   const task={id:crypto.randomUUID(),title:t.title,due:t.due,priority:t.priority,done:false,createdAt:new Date().toISOString(),source:'agent',followUp:t.followUp};
   tasks.unshift(task);
   if(t.followUp){commitments.unshift({id:crypto.randomUUID(),title:t.title,due:t.due,status:'waiting',createdAt:new Date().toISOString()});saveCommitments();log('agent.commitment_created',{taskId:task.id,type:'follow-up'})}
   log('agent.action_approved',{action:'task.create',taskId:task.id,proposal:t});
   $('quickInput').value='';$('preview').hidden=true;save();
 };
}
function renderCommitments(){
 const el=$('commitments');if(!el)return;
 const active=commitments.filter(c=>c.status!=='done').slice(0,6);
 el.innerHTML=active.length?active.map(c=>'<div class="commitment"><div class="commitment-icon">↗</div><div class="commitment-main"><div class="commitment-title">'+escapeHtml(c.title)+'</div><div class="commitment-meta">My Boy is tracking this follow-up'+(c.due?' · '+escapeHtml(c.due):'')+'</div></div><button class="secondary" onclick="completeCommitment(\''+c.id+'\')">Done</button></div>').join(''):'<p class="empty">No commitments yet. Tell My Boy about something you’re waiting for or owe.</p>';
}
function completeCommitment(id){const c=commitments.find(x=>x.id===id);if(c){c.status='done';c.completedAt=new Date().toISOString();saveCommitments();log('commitment.completed',{commitmentId:id})}}
function renderAudit(){const el=$('audit');if(!el)return;el.innerHTML=audit.slice(0,8).map(x=>'<div class="audit-row"><span>'+escapeHtml(x.action)+'</span><time>'+new Date(x.at).toLocaleString()+'</time></div>').join('')||'<p class="empty">No actions recorded yet.</p>'}
function getNextMove(){
 const pending=tasks.filter(t=>!t.done);
 if(!pending.length)return null;
 const todayTasks=pending.filter(t=>t.due===today()).sort((a,b)=>(a.priority==='High'?0:1)-(b.priority==='High'?0:1));
 return todayTasks[0]||pending.find(t=>t.priority==='High')||pending[0];
}
function showMove(){
 const decision=chooseMove();
 $('movePanel').hidden=false;
 const t=decision?.type==='task'?decision.item:null;
 const commitment=decision?.type==='commitment'?decision.item:null;
 if(!decision){$('moveContent').innerHTML='<div class="move-card"><div><div class="move-title">You’re clear.</div><div class="move-meta">Tell My Boy what is coming up and I’ll help plan it.</div></div><button id="moveCapture">Tell My Boy</button></div>';$('moveCapture').onclick=()=>$('quickInput').focus();return}
 if(commitment){$('moveContent').innerHTML='<div class="move-card"><div><div class="move-title">Follow up: '+escapeHtml(commitment.title)+'</div><div class="move-meta">This commitment is due for attention. My Boy is tracking it for you.</div></div><div class="move-actions"><button id="moveCommitDone">Done</button><button id="moveCommitSkip" class="secondary">Not now</button></div></div>'; $('moveCommitDone').onclick=()=>{completeCommitment(commitment.id);showMove();log('agent.move_completed',{commitmentId:commitment.id,type:'commitment'})}; $('moveCommitSkip').onclick=()=>{$('movePanel').hidden=true;log('agent.move_skipped',{commitmentId:commitment.id,type:'commitment'});}; log('agent.move_recommended',{commitmentId:commitment.id,type:'commitment'}); return}
 $('moveContent').innerHTML='<div class="move-card"><div><div class="move-title">'+escapeHtml(t.title)+'</div><div class="move-meta">'+(t.due?'Due '+escapeHtml(t.due)+' · ':'')+escapeHtml(t.priority)+' priority'+(t.followUp?' · Follow-up':'')+'</div></div><div class="move-actions"><button id="moveDone">Done</button><button id="moveSkip" class="secondary">Not now</button></div></div>'; 
 $('moveDone').onclick=()=>{toggle(t.id);showMove();log('agent.move_completed',{taskId:t.id})};
 $('moveSkip').onclick=()=>{$('movePanel').hidden=true;log('agent.move_skipped',{taskId:t.id})};
 log('agent.move_recommended',{taskId:t.id});
}
function renderSuggestions(){
 const persona=$('persona').value;localStorage.setItem(PERSONA_KEY,persona);
 $('suggestions').innerHTML=TASK_SUGGESTIONS[persona].map((s,i)=>'<button type="button" class="suggestion-chip" data-suggestion="'+i+'">'+escapeHtml(s)+'</button>').join('');
 $('suggestions').querySelectorAll('[data-suggestion]').forEach(btn=>btn.onclick=()=>{$('quickInput').value=TASK_SUGGESTIONS[persona][Number(btn.dataset.suggestion)];$('quickInput').focus()});
 updateAgentSummary();
}
$('persona').value=localStorage.getItem(PERSONA_KEY)||'student';
$('persona').onchange=renderSuggestions;
$('moveBtn').onclick=showMove;
$('addBtn').onclick=()=>$('dialog').showModal();
$('cancelBtn').onclick=()=>$('dialog').close();
$('filter').onchange=render;
$('parseBtn').onclick=()=>{const raw=$('quickInput').value.trim();if(!raw){$('quickInput').focus();return}showPreview(inferTask(raw),raw)};
$('taskForm').onsubmit=e=>{e.preventDefault();const title=$('title').value.trim();if(!title)return;const task={id:crypto.randomUUID(),title,due:$('due').value,priority:$('priority').value,done:false,createdAt:new Date().toISOString(),source:'manual',followUp:''};tasks.unshift(task);log('task.created',{taskId:task.id,source:'manual'});$('taskForm').reset();$('dialog').close();save()};
render();