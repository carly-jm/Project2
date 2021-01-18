$(function (){
    $("#add-btn").on("click", function(event) {
        // Make sure to preventDefault on a submit event.
        event.preventDefault();

        var image = $("#image").val().trim()
        var split = image.split('.')
    
        var newPost = {
          caption: $("#caption").val().trim(),
          preview: `./images/${image}`,
          thumbnail: `./images/${split[0]}_thumb.${split[1]}`
        };
    
        // Send the POST request.
        $.ajax("/api/posts", {
          type: "POST",
          data: newPost
        }).then(
          function() {
            console.log(newPost);
            // Reload the page to get the updated list
            location.reload();
          }
        );
      });
    });
