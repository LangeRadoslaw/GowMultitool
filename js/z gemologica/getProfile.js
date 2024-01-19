import $ from "./jQuery.js";
import main from "./main.js";

$(document).ready(function() {
  const id = window.location.pathname.split("/")[2];
  $("#title").html("Loading data...");
  $.ajax({
    url: "/profileData/" + id + window.location.search
  }).done(function(data, textStatus, xhr) {
    main.start(data);
  }).fail(function(data, textStatus, xhr) {
    if (data.status >= 400 && data.status < 500) {
      $("#title").html(data.responseText);
    } else {
      $("#title").html("Unexpected error: " + data.responseText);
    }
    $("#subtitle").html(data.status);
  });
});

export default {};

