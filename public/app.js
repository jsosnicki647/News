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
        $.post("/save", data, (a) => {
            if (a == "already saved") {
                $("#already-saved").modal("toggle")
            } else {
                $(e.target).removeClass("btn-danger")
                $(e.target).addClass("btn-secondary")
                $(e.target).text("saved")
            }
        })

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
            notes.forEach(element => {
                const newNoteDiv = $("<div>")
                const timeSpan = $("<span>")
                const noteP = $("<p>")
                const del = $("<btn class='delete-note btn btn-danger'>")
                $(del).attr("data-id", element._id)
                del.text("Delete")
                timeSpan.text(element.time + ": ")
                noteP.text(element.note)

                $(newNoteDiv).append(del).append(timeSpan).append(noteP).append($("<br>"))
                $("#notes").prepend(newNoteDiv)

                addOnClickToDelete()
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

        $.post("/submit", data, (a) => {
            console.log(a)
            const time = a.notes[a.notes.length - 1].time
            const id = a.notes[a.notes.length - 1]._id
            const newNoteDiv = $("<div>")
            const timeSpan = $("<span>")
            const noteP = $("<p>")
            const del = $("<btn class='delete-note btn btn-danger'>")
            $(del).attr("data-id", id)
            del.text("Delete")
            timeSpan.text(time + ": ")
            noteP.text(note)
            $(newNoteDiv).append(del).append(timeSpan).append(noteP).append($("<br>"))
            $("#notes").prepend(newNoteDiv)
            $("#note-text").val("")

            addOnClickToDelete()
        })
    })

    const addOnClickToDelete = () => {

        $(".delete-note").on("click", (e) => {
            const id = $(e.target).data("id")
            $.ajax({
                url: "/delete-note/" + id,
                method: "DELETE"
            }).then(() => {
                $(e.target).parent().remove()
            })
        })
    }


    $(".delete-article").on("click", (e) => {
        const id = $(e.target).data("id")
        $.ajax({
            url: "/delete-article/" + id,
            method: "DELETE"
        }).then(() => window.location.href = window.location.origin + "/saved-articles")
    })


    $("#modal-close").on("click", () => {
        $("#note-text").val("")
        $("#note-modal").modal("toggle")
    })

})