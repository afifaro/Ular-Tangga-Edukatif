
const loaderOverlay=document.getElementById('loaderOverlay');
const splash=document.getElementById('splash');
const gameRoot=document.getElementById('gameRoot');
const startBtn=document.getElementById('startBtn');
const settingsBtn=document.getElementById('settingsBtn');
const settingsMenu=document.getElementById('settingsMenu');
const uploadBtn=document.getElementById('uploadBtn');
const fileInput=document.getElementById('fileInput');
const toasts=document.getElementById('toasts');
let defaultQuestions=[], activeQuestions=[];

// toast
function showToast(msg,type='info'){ const el=document.createElement('div'); el.textContent=msg; el.style.padding='8px 12px'; el.style.borderRadius='8px'; el.style.background= type==='success'?'#2ea043':(type==='warn'?'#eab312':'#c83c3c'); el.style.color='#fff'; el.style.marginTop='8px'; toasts.appendChild(el); setTimeout(()=>el.remove(),3200);}

// load questions.json but never hang
async function loadDefaultQuestions(){ try{ const res=await fetch('questions.json'); if(!res.ok) throw new Error('not found'); const data=await res.json(); if(Array.isArray(data)&&data.length>0){ defaultQuestions=data; activeQuestions=defaultQuestions.slice(); showToast('✅ Soal bawaan dimuat.','success'); } else { defaultQuestions=[]; activeQuestions=[]; showToast('⚠️ Soal bawaan kosong. Unggah soal Anda.','warn'); } }catch(e){ defaultQuestions=[]; activeQuestions=[]; showToast('⚠️ Soal bawaan tidak ditemukan. Unggah soal Anda.','warn'); } loaderOverlay.classList.add('hidden'); splash.classList.remove('hidden');}

// handlers
settingsBtn.addEventListener('click', ()=> settingsMenu.classList.toggle('hidden'));
document.getElementById('closeSettings').addEventListener('click', ()=> settingsMenu.classList.add('hidden'));
uploadBtn.addEventListener('click', ()=> fileInput.click());

fileInput.addEventListener('change', (ev)=>{ const f=ev.target.files[0]; if(!f) return; const reader=new FileReader(); reader.onload=(e)=>{ try{ const wb=XLSX.read(e.target.result,{type:'binary'}); const sheet=wb.Sheets[wb.SheetNames[0]]; const rows=XLSX.utils.sheet_to_json(sheet,{header:1}); const parsed=[]; for(let r of rows){ const q=(r[0]||'').toString().trim(); const a=(r[1]||'').toString().trim(); const b=(r[2]||'').toString().trim(); const c=(r[3]||'').toString().trim(); const key=(r[4]||'').toString().trim().toUpperCase(); const tfq=(r[5]||'').toString().trim(); const tfk=(r[6]||'').toString().trim().toLowerCase(); if(q) parsed.push({type:'pilihan',question:q,options:[a,b,c],answerIndex:key==='B'?1:(key==='C'?2:0)}); if(tfq) parsed.push({type:'benar_salah',question:tfq,answer:(['benar','b','true','ya','1'].includes(tfk))}); } if(parsed.length>0){ activeQuestions=parsed; showToast('✅ Soal berhasil dimuat! Soal bawaan dinonaktifkan.','success'); } else { showToast('⚠️ Format file tidak sesuai atau kosong.','warn'); } }catch(err){ console.error(err); showToast('❌ Gagal memuat soal.','error'); } }; reader.readAsBinaryString(f); });

startBtn.addEventListener('click', ()=>{ splash.classList.add('hidden'); gameRoot.classList.remove('hidden'); });

window.addEventListener('DOMContentLoaded', loadDefaultQuestions);
