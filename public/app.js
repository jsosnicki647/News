$(document).ready(() => {
    $("btn.save").on("click", (e) => {
        const title = $(e.target).data("title")
        const teaser = $(e.target).data("teaser")
        const link = $(e.target).data("link")

        const data = {
            title: title,
            teaser: teaser,
            link: link
        }
        console.log(data)
        $.post("/save", data, () => console.log("saved"))

    })

   $("btn.note").on("click", (e) => {
       $("#note-modal").modal("toggle")
       const title = $(e.target).data("title")
       const id = $(e.target).data("id")
       console.log(id)
       $("#modal-article-title").text(title)
       $("#save-note").data("id", id) 
   })

   $("#btn-headlines").on("click", () => {
       $.ajax("/scrape", {
           type: "GET"
       })
       .then(() => window.location.href = window.location.origin + "/scrape")
   })

   $("#btn-saved-articles").on("click", () => {
        $.ajax("/saved-articles", {
           type: "GET"
       })
       .then(() => window.location.href = window.location.origin + "/saved-articles")
   })

   $("#save-note").on("click", () => {
       const note = $("#note-text").val()
       const article_id = $("#save-note").data("id")
       const data = {
           note: note,
           article_id: article_id
       }

        $.post("/submit", data, () => console.log("saved"))
        $("#note-text").val("")
        $("#note-modal").modal("toggle")

   })

   $("#modal-close").on("click", () => {
        $("#note-text").val("")
        $("#note-modal").modal("toggle")
   })

})