const listitems=document.querySelectorAll(li);
function toggledone(e) {
if (!e.target.className){
e.target.className="done";
}
else (
    e.target.className="";
)

} ;