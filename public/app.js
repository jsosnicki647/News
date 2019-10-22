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
       $("#modal-article-title").text(title)
   })
})