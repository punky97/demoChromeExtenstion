// document.addEventListener('DOMContentLoaded', function() {

//     var displayAlerteButton = $('#displayAlert');
//     displayAlerteButton.addEventListener('click', function() {
//       alert('Welcome');
//   }, false)});

$('#displayAlert').on('click', function(){
  alert('aa')
})

var coll = document.getElementsByClassName("collapsible");
var i;

for (i = 0; i < coll.length; i++) {
  coll[i].addEventListener("click", function() {
    this.classList.toggle("active");
    var content = this.nextElementSibling;
    if (content.style.height === "200px") {
      content.style.height = "0px";
    } else {
      content.style.height = "200px";
    }
  });
}
