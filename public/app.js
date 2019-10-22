$(document).ready(() => {
    $("btn.save").on("click", (e) => {
        const id = $(e.target).data("id")
        $.ajax("/save/" + id, {
                type: "PUT"
            })
            .then(() => {console.log("SAVED", id)})

    })

   $("btn.note").on("click", (e) => {
       $("#note-modal").modal("toggle")
       const title = $(e.target).data("title")
       const id = $(e.target).data("id")
       console.log(id)
       $("#modal-article-title").text(title)
       $("#save-note").data("id", id) 
   })

//    $("#save-note").on("click", (e) => {
//        const id = $(e.target).data(
})