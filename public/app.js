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
        $("#notes").empty()
        $("#note-modal").modal("toggle")
        const title = $(e.target).data("title")
        const id = $(e.target).data("id")
        $("#modal-article-title").text(title)
        $("#save-note").data("id", id)
        console.log("FRONT BTN.NOTE: " + id)
        $.ajax({
            url: "/populated/" + id,
            method: "GET"
        }).then((notes) => {
            console.log("NOTES: " + notes[0].note)
            notes.forEach(element => {
                const p = $("<span>")
                const del = $("<btn class='delete-note btn btn-danger'>")
                del.text("Delete")
                p.text(element.time + ": " + element.note)

                $("#notes").append(del).append(p).append($("<br>"))

            })
        })
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

        const p = $("<span>")
        const del = $("<btn class='delete-note btn btn-danger'>")
        del.text("Delete")
        p.text(Date.now() + ": " + note)

        $("#notes").append(del).append(p).append($("<br>"))
        $("#note-text").val("")

    })

    $("#modal-close").on("click", () => {
        $("#note-text").val("")
        $("#note-modal").modal("toggle")
    })

})