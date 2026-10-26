/* ---------- wiring ---------- */
$('#btnSettings').onclick=openSettings;
$('#btnNote').onclick=openNotes;
$('#lessonBack').onclick=()=>{show('home');renderHome(curLesson&&curLesson.id)};
$('#playBack').onclick=exitLevel;
wirePet();
$('#btnRead').onclick=()=>speak($('#bubble').innerHTML);
if('speechSynthesis' in window)speechSynthesis.getVoices();
renderHome();
